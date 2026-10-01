import { useEffect, useLayoutEffect } from 'react'
import { Icon } from './components/Icon'
import { useSession } from './data/session'
import { useStore } from './data/store'
import { useDocumentTitle, useWakeLock } from './lib/effects'
import { Link, navigate, usePath } from './lib/router'
import { formatClock } from './lib/time'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { SettingsPage } from './pages/SettingsPage'
import { StatsPage } from './pages/StatsPage'
import { TimerPage } from './timer/TimerPage'

const TABS = [
  { to: '/', label: 'タイマー', icon: 'timer' },
  { to: '/stats', label: '記録', icon: 'chart' },
  { to: '/settings', label: '設定', icon: 'sliders' },
]

const PAGES = {
  '/': TimerPage,
  '/stats': StatsPage,
  '/settings': SettingsPage,
  '/about': AboutPage,
  '/privacy-policy': PrivacyPage,
}

export function App() {
  const path = usePath()
  const { session, paused } = useSession()
  const { settings } = useStore()
  const Page = PAGES[path] ?? TimerPage

  // 旧版のページ（/account-delete や /error）などはトップへ
  useEffect(() => {
    if (!PAGES[path]) navigate('/', { replace: true })
  }, [path])

  // 新しいページを描いた直後（画面に出る前）に先頭へ戻す
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  useDocumentTitle(useSessionTitle())
  useWakeLock(settings.keepAwake && Boolean(session) && !paused)

  return (
    <div className="app" data-focus={Boolean(session) && path === '/'}>
      <TopBar />
      <main className="page">
        <div className="page-view" key={path}>
          <Page />
        </div>
      </main>
      <BottomBar />
    </div>
  )
}

function useSessionTitle() {
  const { session, paused, remaining, reached, elapsed } = useSession()
  if (!session) return 'Focus'
  if (paused) return `⏸ ${formatClock(Math.ceil(remaining))} · Focus`
  if (reached) return `✓ +${formatClock(elapsed - session.target)} · Focus`
  return `${formatClock(Math.ceil(remaining))} · Focus`
}

function TopBar() {
  const path = usePath()
  const tabIndex = TABS.findIndex((tab) => tab.to === path)
  const { account, sync } = useStore()
  const { session, remaining, reached } = useSession()
  const unsynced = sync.pending > 0 && (sync.status === 'offline' || sync.status === 'error')

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Focus タイマー">
        Focus
      </Link>
      <nav className="top-tabs" aria-label="メニュー" style={{ '--tab': tabIndex }}>
        <TabIndicator index={tabIndex} />
        {TABS.map((tab) => (
          <Link key={tab.to} to={tab.to}>
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="account-slot">
        {session && path !== '/' && (
          <Link to="/" className="session-pill">
            <span className="session-pill-dot" />
            {reached ? '目標達成' : formatClock(Math.ceil(remaining))}
          </Link>
        )}
        {unsynced && (
          <Link to="/settings" className="sync-dot" aria-label="まだ送信できていない記録があります" title="未送信の記録があります" />
        )}
        {account ? (
          <Link to="/settings" className="avatar" aria-label={`${account.name || 'アカウント'}（設定）`}>
            {account.photo ? (
              <img src={account.photo} alt="" referrerPolicy="no-referrer" />
            ) : (
              (account.name || account.email || '?').slice(0, 1)
            )}
          </Link>
        ) : (
          path !== '/settings' && (
            // 設定のアカウント欄（Google のログインボタンがある）へ案内する
            <Link to="/settings" className="header-link">
              ログイン
            </Link>
          )
        )}
      </div>
    </header>
  )
}

function BottomBar() {
  const path = usePath()
  const tabIndex = TABS.findIndex((tab) => tab.to === path)
  return (
    <nav className="bottombar" aria-label="メニュー" style={{ '--tab': tabIndex }}>
      <TabIndicator index={tabIndex} />
      {TABS.map((tab) => (
        <Link key={tab.to} to={tab.to}>
          <Icon name={tab.icon} />
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

// 選択中のタブの背景。タブを切り替えると、新しいタブまで滑るように動く（--tab で位置を決める）
function TabIndicator({ index }) {
  return index >= 0 ? <span className="tab-indicator" aria-hidden="true" /> : null
}
