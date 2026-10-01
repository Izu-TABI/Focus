import { useEffect, useRef } from 'react'
import { Figure } from '../components/Figure'
import { TitleIcon } from '../components/TitleIcon'
import { useSession } from '../data/session'
import { useStore } from '../data/store'
import { useToday } from '../lib/effects'
import { currentStreak, secondsOn } from '../lib/stats'
import { formatDuration } from '../lib/time'
import { findTitle } from '../lib/titles'

export function SummaryView() {
  const { summary, dismissSummary, undo } = useSession()
  const { record, account, signIn } = useStore()
  const okRef = useRef(null)
  const now = useToday()
  const today = secondsOn(record.daily, now)
  const streak = currentStreak(record.daily, now)
  const { finished, reached, unlocked } = summary

  useEffect(() => {
    okRef.current?.focus()
  }, [])

  return (
    <div className="timer-view">
      <section className="summary" aria-labelledby="summary-title">
        <h1 id="summary-title" className={`summary-kicker${reached ? ' is-reached' : ''}`}>
          {reached ? '目標達成' : 'おつかれさまでした'}
        </h1>
        <p className="summary-time">
          <Figure>{formatDuration(finished.seconds)}</Figure>
        </p>
        <p className="summary-sub">集中しました</p>

        <dl className="summary-stats">
          <div>
            <dt className="label">今日の合計</dt>
            <dd>
              <Figure>{formatDuration(today)}</Figure>
            </dd>
          </div>
          <div>
            <dt className="label">連続</dt>
            <dd>
              <Figure>{`${streak.days}日`}</Figure>
            </dd>
          </div>
        </dl>

        {unlocked.length > 0 && (
          <ul className="summary-badges">
            {unlocked.map((id) => {
              const title = findTitle(id)
              return (
                <li className="summary-badge" key={id}>
                  <TitleIcon id={id} />
                  <span>
                    <span className="label">新しい称号</span>
                    <strong>{title.name}</strong>　{title.description}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {!account && (
          <p className="summary-note">
            記録はこのブラウザに保存されています。
            <button type="button" className="link-button" onClick={signIn}>
              ログイン
            </button>
            すると、ほかの端末でも見られます。
          </p>
        )}

        <div className="summary-actions">
          <button ref={okRef} type="button" className="btn btn-primary btn-large" onClick={dismissSummary}>
            OK
          </button>
          <button type="button" className="btn btn-quiet btn-small" onClick={undo}>
            この記録を取り消す
          </button>
        </div>
      </section>
    </div>
  )
}
