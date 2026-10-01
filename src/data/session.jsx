import { createContext, useCallback, useContext, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { celebrate } from '../lib/effects'
import { showNotification } from '../lib/notify'
import {
  createSession,
  elapsedSeconds,
  finishSession,
  isPaused,
  isValidSession,
  msUntilGoal,
  msUntilNextSecond,
  pauseSession,
  resumeSession,
} from '../lib/session'
import { playChime, unlockAudio } from '../lib/sound'
import { load, save, subscribe } from '../lib/storage'
import { formatDuration } from '../lib/time'
import { useStore } from './store'
import { useToast } from './toast'

const SessionContext = createContext(null)

export function useSession() {
  return useContext(SessionContext)
}

// 1分未満の作業は、押し間違いとみなして記録しない
export const MIN_RECORD_SECONDS = 60

function storedSession() {
  const value = load('session')
  return isValidSession(value) ? value : null
}

export function SessionProvider({ children }) {
  const { settings, recordSession, undoSession } = useStore()
  const toast = useToast()
  const [session, setSessionState] = useState(storedSession)
  const [now, setNow] = useState(() => Date.now())
  // 直前に終えた作業のまとめ（取り消しにも使う）
  const [summary, setSummary] = useState(null)

  const setSession = useCallback((next) => {
    save('session', next)
    setSessionState(next)
    setNow(Date.now())
  }, [])

  // ほかのタブで開始・終了したときも同じ状態にする
  useEffect(
    () =>
      subscribe('session', () => {
        setSessionState(storedSession())
        setNow(Date.now())
      }),
    [],
  )

  // 表示上の秒が変わるタイミングに合わせて更新する
  useEffect(() => {
    if (!session || isPaused(session)) return
    let timer
    const tick = () => {
      const time = Date.now()
      setNow(time)
      timer = setTimeout(tick, msUntilNextSecond(session, time) + 5)
    }
    timer = setTimeout(tick, msUntilNextSecond(session, Date.now()) + 5)
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      clearTimeout(timer)
      tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [session])

  const announceGoal = useEffectEvent((target) => {
    celebrate()
    if (settings.sound) playChime()
    if (settings.notify && !document.hasFocus()) {
      showNotification(
        `${formatDuration(target)}の目標を達成しました`,
        'このまま続けることもできます。終えるときは Focus で「終了」を押してください。',
      )
    }
  })

  // 目標時間になったら一度だけ知らせる。バックグラウンドのタブでも時間どおりに動くよう、
  // 毎秒の更新とは別に、ちょうどの時刻にタイマーを仕掛けておく。
  useEffect(() => {
    if (!session || session.alerted || isPaused(session)) return
    const delay = msUntilGoal(session, Date.now())
    const timer = setTimeout(() => {
      const current = storedSession()
      if (!current || current.id !== session.id || current.alerted) return
      setSession({ ...current, alerted: true })
      // しばらく閉じていて、開いたときにはとっくに過ぎていた場合は静かに
      if (delay > -60_000) announceGoal(current.target)
    }, Math.max(0, delay))
    return () => clearTimeout(timer)
  }, [session, setSession])

  const start = useCallback(
    (minutes) => {
      unlockAudio()
      setSummary(null)
      setSession(createSession(minutes * 60, Date.now()))
    },
    [setSession],
  )

  const pause = useCallback(() => {
    const current = storedSession()
    if (current) setSession(pauseSession(current, Date.now()))
  }, [setSession])

  const resume = useCallback(() => {
    unlockAudio()
    const current = storedSession()
    if (current) setSession(resumeSession(current, Date.now()))
  }, [setSession])

  const finish = useCallback(() => {
    const current = storedSession()
    if (!current) return
    const finished = finishSession(current, Date.now())
    setSession(null)
    if (finished.seconds < MIN_RECORD_SECONDS) {
      toast('1分未満だったので記録しませんでした')
      return
    }
    const result = recordSession(finished)
    setSummary({ finished, reached: finished.seconds >= finished.target, ...result })
  }, [recordSession, setSession, toast])

  const undo = useCallback(() => {
    if (!summary) return
    undoSession(summary.finished, summary)
    setSummary(null)
    toast('記録を取り消しました')
  }, [summary, toast, undoSession])

  const dismissSummary = useCallback(() => setSummary(null), [])

  const value = useMemo(() => {
    const elapsed = session ? elapsedSeconds(session, now) : 0
    return {
      session,
      paused: session ? isPaused(session) : false,
      elapsed,
      remaining: session ? Math.max(0, session.target - elapsed) : 0,
      reached: session ? elapsed >= session.target : false,
      summary,
      start,
      pause,
      resume,
      finish,
      undo,
      dismissSummary,
    }
  }, [session, now, summary, start, pause, resume, finish, undo, dismissSummary])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
