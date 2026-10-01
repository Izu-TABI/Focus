import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  applySession,
  emptyRecord,
  fromCloud,
  hasProgress,
  normalizeRecord,
  revertSession,
  SCHEMA_VERSION,
  withEarnedTitles,
} from '../lib/records'
import { load, randomId, remove, save } from '../lib/storage'
import { formatDuration } from '../lib/time'
import { appliedOps, applyOps, commitOp, deleteUserDoc, fetchUserDoc } from './cloud'
import { firebaseIfLoaded, loadFirebase } from './firebase'
import { useToast } from './toast'

const StoreContext = createContext(null)

export function useStore() {
  return useContext(StoreContext)
}

export const DEFAULT_SETTINGS = {
  minutes: 5, // 最後に選んだ作業時間。初めての人には「とりあえず5分」
  sound: true,
  notify: false,
  notifyAsked: false,
  keepAwake: true,
  theme: 'system',
}

const THEME_COLORS = { light: '#f4f3ef', dark: '#121211' }

// localStorage のキー
const ACCOUNT = 'account'
const GUEST = 'guest'
const SETTINGS = 'settings'
const cacheKey = (uid) => `cache:${uid}`
const outboxKey = (uid) => `outbox:${uid}`

function guestRecord() {
  const record = normalizeRecord(load(GUEST))
  const earned = withEarnedTitles(record, new Date())
  if (earned !== record) save(GUEST, earned)
  return earned
}

// サーバーで確認できた記録に、まだ送れていない操作を重ねたもの
function accountRecord(uid) {
  return applyOps(normalizeRecord(load(cacheKey(uid))), load(outboxKey(uid), []), new Date())
}

function enqueue(uid, op) {
  save(outboxKey(uid), [...load(outboxKey(uid), []), op])
}

function accountFromUser(user) {
  return { uid: user.uid, name: user.displayName ?? '', email: user.email ?? '', photo: user.photoURL ?? '' }
}

export function StoreProvider({ children }) {
  const toast = useToast()
  const [account, setAccount] = useState(() => load(ACCOUNT))
  const [record, setRecord] = useState(() => {
    const saved = load(ACCOUNT)
    return saved ? accountRecord(saved.uid) : guestRecord()
  })
  // 'restoring'（前回ログインしていて確認中） / 'signed-in' / 'guest'
  const [authState, setAuthState] = useState(() => (load(ACCOUNT) ? 'restoring' : 'guest'))
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [sync, setSync] = useState({ status: 'idle', pending: 0 })
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load(SETTINGS, {}) }))

  const accountRef = useRef(account)
  const flushing = useRef(false)
  const retry = useRef({ timer: null, delay: 0, flush: null })

  const refresh = useCallback(() => {
    const current = accountRef.current
    setRecord(current ? accountRecord(current.uid) : guestRecord())
    if (current) {
      setSync((previous) => ({ ...previous, pending: load(outboxKey(current.uid), []).length }))
    }
  }, [])

  // 送信待ちの操作を順番に Firestore へ送る
  const flush = useCallback(async () => {
    const current = accountRef.current
    if (!current || flushing.current) return
    let services
    try {
      services = await loadFirebase()
    } catch {
      return
    }
    await services.auth.authStateReady()
    const user = services.auth.currentUser
    if (!user || user.uid !== current.uid) return

    flushing.current = true
    clearTimeout(retry.current.timer)
    try {
      for (;;) {
        const outbox = load(outboxKey(current.uid), [])
        // 再送中も「未送信あり」の表示は成功するまで出したままにする
        setSync((previous) => ({
          status: outbox.length === 0 ? 'idle' : previous.status === 'idle' ? 'syncing' : previous.status,
          pending: outbox.length,
        }))
        if (outbox.length === 0) break
        const op = outbox[0]
        const confirmed = await commitOp(services, user, op, new Date())
        save(cacheKey(current.uid), confirmed)
        save(
          outboxKey(current.uid),
          load(outboxKey(current.uid), []).filter((pending) => pending.id !== op.id),
        )
        refresh()
      }
      retry.current.delay = 0
    } catch (error) {
      console.warn('同期に失敗しました', error)
      const pending = load(outboxKey(current.uid), []).length
      setSync({ status: navigator.onLine ? 'error' : 'offline', pending })
      // 15秒から始めて最大10分まで間隔をあけて再送する
      retry.current.delay = Math.min(retry.current.delay ? retry.current.delay * 2 : 15_000, 600_000)
      retry.current.timer = setTimeout(() => retry.current.flush?.(), retry.current.delay)
    } finally {
      flushing.current = false
    }
  }, [refresh])

  useEffect(() => {
    retry.current.flush = flush
  }, [flush])

  // サーバーの記録を取り直す
  const pull = useCallback(
    async (uid) => {
      try {
        const services = await loadFirebase()
        const doc = await fetchUserDoc(services, uid)
        if (accountRef.current?.uid !== uid) return
        save(cacheKey(uid), fromCloud(doc, new Date()))
        // 送ったのに返事を受け取れなかった操作は、もう反映されているので捨てる
        const applied = appliedOps(doc)
        const outbox = load(outboxKey(uid), []).filter((op) => !applied.includes(op.id))
        if (doc && (doc.schema ?? 1) < SCHEMA_VERSION && !outbox.some((op) => op.type === 'migrate')) {
          outbox.push({ type: 'migrate', id: `migrate-${uid}` })
        }
        save(outboxKey(uid), outbox)
        refresh()
      } catch (error) {
        console.warn('記録を読み込めませんでした', error)
        setSync((previous) => ({ ...previous, status: navigator.onLine ? 'error' : 'offline' }))
      }
      flush()
    },
    [flush, refresh],
  )

  const handleUser = useCallback(
    async (user) => {
      if (!user) {
        const previous = accountRef.current
        accountRef.current = null
        if (previous) {
          remove(ACCOUNT)
          remove(cacheKey(previous.uid))
          setAccount(null)
        }
        setAuthState('guest')
        setSync({ status: 'idle', pending: 0 })
        refresh()
        return
      }

      const next = accountFromUser(user)
      accountRef.current = next
      save(ACCOUNT, next)
      setAccount(next)
      setAuthState('signed-in')

      // ゲストとして付けた記録はアカウントへ引き継ぐ
      const guest = guestRecord()
      if (hasProgress(guest)) {
        enqueue(next.uid, { type: 'merge', id: `merge-${randomId()}`, record: guest })
        remove(GUEST)
        if (guest.total > 0) toast(`このブラウザの記録（${formatDuration(guest.total)}）をアカウントに引き継ぎました`)
      }
      refresh()
      await pull(next.uid)
    },
    [pull, refresh, toast],
  )

  // Firebase は最初の表示が終わってから読み込む
  useEffect(() => {
    let unsubscribe = () => {}
    let cancelled = false
    const start = () => {
      loadFirebase()
        .then((services) => {
          if (cancelled) return
          setFirebaseReady(true)
          unsubscribe = services.authModule.onAuthStateChanged(services.auth, handleUser)
        })
        .catch((error) => {
          console.warn(error)
          if (!cancelled && accountRef.current) setSync((previous) => ({ ...previous, status: 'offline' }))
        })
    }
    const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200))
    idle(start)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [handleUser])

  // ネットワークが戻ったときや画面に戻ってきたときに再送する
  useEffect(() => {
    const retryNow = () => {
      if (document.visibilityState === 'visible' && accountRef.current) flush()
    }
    window.addEventListener('online', retryNow)
    document.addEventListener('visibilitychange', retryNow)
    return () => {
      window.removeEventListener('online', retryNow)
      document.removeEventListener('visibilitychange', retryNow)
    }
  }, [flush])

  // ほかのタブでの変更を反映する
  useEffect(() => {
    const onStorage = (event) => {
      const key = event.key?.replace(/^focus:/, '') ?? ''
      if (key === SETTINGS) setSettings({ ...DEFAULT_SETTINGS, ...load(SETTINGS, {}) })
      else if (key === GUEST || key.startsWith('cache:') || key.startsWith('outbox:')) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  // テーマ。ブラウザの上部バーなどの色（theme-color）も合わせる
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'system') delete root.dataset.theme
    else root.dataset.theme = settings.theme
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      const scheme = meta.media.includes('dark') ? 'dark' : 'light'
      meta.content = THEME_COLORS[settings.theme === 'system' ? scheme : settings.theme]
    })
  }, [settings.theme])

  const updateSetting = useCallback((key, value) => {
    setSettings((previous) => {
      const next = { ...previous, [key]: value }
      save(SETTINGS, next)
      return next
    })
  }, [])

  // ---- 記録の操作 ----

  // finished: finishSession の結果。称号の取得状況などを返す（取り消しにも使う）
  const recordSession = useCallback(
    (finished) => {
      const current = accountRef.current
      const before = current ? accountRecord(current.uid) : guestRecord()
      const { record: after, unlocked } = applySession(before, finished, new Date())
      if (current) {
        enqueue(current.uid, { type: 'session', id: finished.id, session: finished })
        refresh()
        flush()
      } else {
        save(GUEST, after)
        setRecord(after)
      }
      return { unlocked, prevLongest: before.longest, after }
    },
    [flush, refresh],
  )

  const undoSession = useCallback(
    (finished, { unlocked, prevLongest }) => {
      const session = { ...finished, unlocked, prevLongest }
      const current = accountRef.current
      if (current) {
        enqueue(current.uid, { type: 'revert', id: `undo-${finished.id}`, session })
        refresh()
        flush()
      } else {
        const reverted = revertSession(guestRecord(), session, new Date())
        save(GUEST, reverted)
        setRecord(reverted)
      }
    },
    [flush, refresh],
  )

  const setGoal = useCallback(
    (goal) => {
      const text = goal.trim().slice(0, 80)
      const current = accountRef.current
      if (current) {
        enqueue(current.uid, { type: 'goal', id: `goal-${randomId()}`, goal: text })
        refresh()
        flush()
      } else {
        const next = { ...guestRecord(), goal: text }
        save(GUEST, next)
        setRecord(next)
      }
    },
    [flush, refresh],
  )

  const resetGuest = useCallback(() => {
    remove(GUEST)
    setRecord(emptyRecord())
  }, [])

  // ---- アカウント ----

  const signIn = useCallback(async () => {
    let services = firebaseIfLoaded()
    try {
      // 読み込み済みならクリックの処理中にそのままポップアップを開く（ブロックされにくい）
      services ??= await loadFirebase()
      await services.authModule.signInWithPopup(services.auth, services.provider)
    } catch (error) {
      const code = error?.code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      if (code === 'auth/popup-blocked') toast('ポップアップがブロックされました。もう一度押してください')
      else if (code === 'auth/network-request-failed') toast('ネットワークにつながっていません')
      else toast('ログインできませんでした。時間をおいてもう一度お試しください')
      console.warn(error)
    }
  }, [toast])

  const signOut = useCallback(async () => {
    const services = await loadFirebase()
    await services.authModule.signOut(services.auth)
    toast('ログアウトしました')
  }, [toast])

  // 本人確認 → 記録の削除 → アカウントの削除 の順に行う。
  // 先にアカウントを消すと、記録を消す権限がなくなってデータが残ってしまう。
  const deleteAccount = useCallback(async () => {
    const services = firebaseIfLoaded() ?? (await loadFirebase())
    const user = services.auth.currentUser
    if (!user) throw new Error('ログインしていません')
    await services.authModule.reauthenticateWithPopup(user, services.provider)
    // 送信待ちが残っていると、消したあとにドキュメントを作り直してしまうので先に捨てる
    remove(outboxKey(user.uid))
    remove(cacheKey(user.uid))
    await deleteUserDoc(services, user.uid)
    await services.authModule.deleteUser(user)
  }, [])

  const value = useMemo(
    () => ({
      account,
      authState,
      firebaseReady,
      record,
      sync,
      settings,
      updateSetting,
      recordSession,
      undoSession,
      setGoal,
      resetGuest,
      signIn,
      signOut,
      deleteAccount,
      retrySync: flush,
    }),
    [
      account,
      authState,
      firebaseReady,
      record,
      sync,
      settings,
      updateSetting,
      recordSession,
      undoSession,
      setGoal,
      resetGuest,
      signIn,
      signOut,
      deleteAccount,
      flush,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
