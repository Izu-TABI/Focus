import { useState } from 'react'
import { Dialog } from '../components/Dialog'
import { GoogleMark, Icon } from '../components/Icon'
import { useStore } from '../data/store'
import { useToast } from '../data/toast'
import { notificationPermission, requestNotifications } from '../lib/notify'
import { Link, navigate } from '../lib/router'
import { playChime, unlockAudio } from '../lib/sound'
import { formatDuration } from '../lib/time'

export function SettingsPage() {
  return (
    <div className="settings-page">
      <h1 className="page-title">設定</h1>
      <AccountCard />
      <GoalCard />
      <TimerCard />
      <AppearanceCard />
      <DataCard />
      <nav className="settings-links" aria-label="このアプリについて">
        <Link to="/about">Focus について</Link>
        <Link to="/privacy-policy">プライバシーポリシー</Link>
        <a href="https://github.com/Izu-TABI/Focus" target="_blank" rel="noreferrer">
          GitHub
          <Icon name="external" />
        </a>
      </nav>
      <p className="version">Focus {__APP_VERSION__}</p>
    </div>
  )
}

export function GoogleButton({ onClick, children = 'Googleでログイン' }) {
  return (
    <button type="button" className="google-button" onClick={onClick}>
      <GoogleMark width="18" height="18" />
      <span>{children}</span>
    </button>
  )
}

function AccountCard() {
  const { account, authState, sync, signIn, signOut, retrySync } = useStore()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!account) {
    return (
      <section className="section">
        <div className="section-head">
          <h2>アカウント</h2>
          <span className="meta">ゲスト</span>
        </div>
        <p className="muted small">
          記録はこのブラウザにだけ保存されています。Googleでログインすると記録をアカウントに引き継ぎ、ほかの端末とも同期できます。
        </p>
        <div className="card-actions">
          <GoogleButton onClick={signIn} />
        </div>
      </section>
    )
  }

  const startSignOut = () => {
    if (sync.pending > 0) setConfirmOpen(true)
    else signOut()
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>アカウント</h2>
      </div>
      <div className="profile">
        <span className="avatar avatar-large">
          {account.photo ? (
            <img src={account.photo} alt="" referrerPolicy="no-referrer" />
          ) : (
            (account.name || account.email || '?').slice(0, 1)
          )}
        </span>
        <div className="profile-text">
          <div className="profile-name">{account.name || 'Google アカウント'}</div>
          {account.email && <div className="muted small">{account.email}</div>}
        </div>
      </div>
      <SyncStatus authState={authState} sync={sync} onRetry={retrySync} />
      <div className="card-actions">
        <button type="button" className="btn btn-secondary" onClick={startSignOut}>
          ログアウト
        </button>
      </div>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="ログアウトしますか？"
        actions={
          <>
            <button type="button" className="btn btn-quiet" onClick={() => setConfirmOpen(false)}>
              キャンセル
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setConfirmOpen(false)
                signOut()
              }}
            >
              ログアウト
            </button>
          </>
        }
      >
        <p>
          まだ送信できていない記録が{sync.pending}件あります。ログアウトしても、次にこのアカウントでログインしたときに送信されます。
        </p>
      </Dialog>
    </section>
  )
}

function SyncStatus({ authState, sync, onRetry }) {
  if (authState === 'restoring') return <p className="sync-status">ログイン状態を確認しています…</p>
  if (sync.pending === 0) {
    return <p className="sync-status is-ok">記録はクラウドに保存されています</p>
  }
  if (sync.status === 'syncing') return <p className="sync-status">同期しています…</p>
  return (
    <p className="sync-status is-warning">
      {sync.status === 'offline' ? 'オフラインのため' : 'うまく通信できず'}、{sync.pending}件の記録が未送信です。つながりしだい自動で送信します。
      <button type="button" className="link-button" onClick={onRetry}>
        今すぐ再送
      </button>
    </p>
  )
}

function GoalCard() {
  const { record, setGoal } = useStore()
  const toast = useToast()
  const [draft, setDraft] = useState(null)
  const value = draft ?? record.goal
  const changed = draft !== null && draft.trim() !== record.goal

  return (
    <section className="section">
      <div className="section-head">
        <h2>目標</h2>
      </div>
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault()
          setGoal(value)
          setDraft(null)
          toast(value.trim() ? '目標を保存しました' : '目標を消しました')
        }}
      >
        <label className="visually-hidden" htmlFor="settings-goal">
          目標
        </label>
        <input
          id="settings-goal"
          className="text-input"
          value={value}
          maxLength={80}
          placeholder="例：英検2級に合格する"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!changed}>
          保存
        </button>
      </form>
      <p className="muted small field-note">作業中、タイマーの下に表示されます。</p>
    </section>
  )
}

function TimerCard() {
  const { settings, updateSetting } = useStore()
  const toast = useToast()
  const [permission, setPermission] = useState(notificationPermission)
  const wakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator

  const toggleNotify = async (checked) => {
    updateSetting('notifyAsked', true)
    if (!checked) {
      updateSetting('notify', false)
      return
    }
    const result = permission === 'granted' ? 'granted' : await requestNotifications()
    setPermission(result)
    updateSetting('notify', result === 'granted')
    if (result === 'denied') toast('ブラウザの設定で通知がブロックされています')
  }

  let notifyNote = '別のタブやアプリで作業していても、目標の時間になると通知が届きます。'
  if (permission === 'unsupported') notifyNote = 'このブラウザでは通知を使えません。iPhone はホーム画面に追加すると使えます。'
  else if (permission === 'denied') notifyNote = 'ブラウザの設定で通知がブロックされています。サイトの設定から許可してください。'

  return (
    <section className="section">
      <div className="section-head">
        <h2>タイマー</h2>
      </div>
      <SettingRow
        title="目標達成を音で知らせる"
        checked={settings.sound}
        onChange={(checked) => updateSetting('sound', checked)}
      >
        <button
          type="button"
          className="link-button"
          onClick={() => {
            unlockAudio()
            playChime()
          }}
        >
          試しに鳴らす
        </button>
      </SettingRow>
      <SettingRow
        title="目標達成を通知で知らせる"
        checked={settings.notify && permission === 'granted'}
        disabled={permission === 'unsupported' || permission === 'denied'}
        onChange={toggleNotify}
      >
        {notifyNote}
      </SettingRow>
      <SettingRow
        title="作業中は画面をスリープさせない"
        checked={settings.keepAwake && wakeLockSupported}
        disabled={!wakeLockSupported}
        onChange={(checked) => updateSetting('keepAwake', checked)}
      >
        {wakeLockSupported ? 'スマートフォンを置いてリングを見ながら作業するときに便利です。' : 'このブラウザでは使えません。'}
      </SettingRow>
    </section>
  )
}

function SettingRow({ title, checked, disabled = false, onChange, children }) {
  const id = `setting-${title}`
  return (
    <div className="setting-row">
      <div className="setting-text">
        <label htmlFor={id} className="setting-title">
          {title}
        </label>
        {children && <div className="setting-note">{children}</div>}
      </div>
      <span className="switch">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span />
      </span>
    </div>
  )
}

const THEMES = [
  { value: 'system', label: '自動' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
]

function AppearanceCard() {
  const { settings, updateSetting } = useStore()
  return (
    <section className="section">
      <div className="section-head">
        <h2>表示</h2>
      </div>
      <div className="setting-row">
        <div className="setting-text">
          <span className="setting-title" id="theme-label">
            テーマ
          </span>
          <div className="setting-note">「自動」は端末のダークモードに合わせます。</div>
        </div>
        <div className="segmented theme-switch" role="radiogroup" aria-labelledby="theme-label">
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              type="button"
              role="radio"
              aria-checked={settings.theme === theme.value}
              onClick={() => updateSetting('theme', theme.value)}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function DataCard() {
  const { account, record, resetGuest, deleteAccount } = useStore()
  const toast = useToast()
  const [dialog, setDialog] = useState(null)
  const [busy, setBusy] = useState(false)

  const confirmDelete = async () => {
    setBusy(true)
    try {
      await deleteAccount()
      setDialog(null)
      navigate('/')
      toast('アカウントとすべての記録を削除しました。ご利用ありがとうございました。', { duration: 6000 })
    } catch (error) {
      const code = error?.code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      if (code === 'auth/user-mismatch') toast('ログイン中のアカウントを選んでください')
      else if (code === 'auth/popup-blocked') toast('ポップアップがブロックされました。もう一度押してください')
      else toast('削除できませんでした。時間をおいてもう一度お試しください')
      console.warn(error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section">
      <div className="section-head">
        <h2>データ</h2>
      </div>
      {account ? (
        <>
          <p className="muted small">アカウントと、これまでのすべての記録を削除します。</p>
          <div className="card-actions">
            <button type="button" className="btn btn-danger-outline" onClick={() => setDialog('delete')}>
              アカウントを削除
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted small">このブラウザに保存されている記録（{formatDuration(record.total)}）と目標を消去します。</p>
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-danger-outline"
              disabled={record.total === 0 && !record.goal}
              onClick={() => setDialog('reset')}
            >
              記録を消去
            </button>
          </div>
        </>
      )}

      <Dialog
        open={dialog === 'delete'}
        onClose={() => !busy && setDialog(null)}
        title="アカウントを削除しますか？"
        actions={
          <>
            <button type="button" className="btn btn-quiet" disabled={busy} onClick={() => setDialog(null)}>
              キャンセル
            </button>
            <button type="button" className="btn btn-danger" disabled={busy} onClick={confirmDelete}>
              {busy ? '削除しています…' : '削除する'}
            </button>
          </>
        }
      >
        <p>アカウントと、これまでのすべての記録を削除します。この操作は取り消せません。</p>
        <p className="dialog-note">確認のため、もう一度 Google でログインしてもらいます。</p>
      </Dialog>

      <Dialog
        open={dialog === 'reset'}
        onClose={() => setDialog(null)}
        title="記録を消去しますか？"
        actions={
          <>
            <button type="button" className="btn btn-quiet" onClick={() => setDialog(null)}>
              キャンセル
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                resetGuest()
                setDialog(null)
                toast('記録を消去しました')
              }}
            >
              消去する
            </button>
          </>
        }
      >
        <p>このブラウザに保存されている記録と目標を消去します。この操作は取り消せません。</p>
      </Dialog>
    </section>
  )
}
