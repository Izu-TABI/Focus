import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { useSession } from '../data/session'
import { useStore } from '../data/store'
import { notificationPermission, requestNotifications } from '../lib/notify'
import { formatClock, formatDuration } from '../lib/time'
import { Dial } from './Dial'

const DIM_AFTER_MS = 4000

export function RunningView() {
  const { session, paused, elapsed, remaining, reached, pause, resume, finish } = useSession()
  const { record, settings, updateSetting } = useStore()
  const dimmed = useIdleDim(!paused)
  const target = session.target
  const overtime = Math.max(0, elapsed - target)
  const state = paused ? 'paused' : reached ? 'done' : 'running'
  const askNotify = !settings.notifyAsked && notificationPermission() === 'default'

  let label = '残り'
  if (paused) label = '一時停止中'
  else if (reached) label = '目標達成'

  return (
    <div className="timer-view is-running" data-dimmed={dimmed}>
      <Dial progress={elapsed / target} state={state}>
        <div className="dial-label">{label}</div>
        <div className="clock" role="timer">
          {reached ? `+${formatClock(overtime)}` : formatClock(Math.ceil(remaining))}
        </div>
        <div className="dial-caption">
          {reached ? `合計 ${formatClock(elapsed)}` : `目標 ${formatDuration(target)}`}
        </div>
      </Dial>

      <div className="timer-controls">
        {record.goal && (
          <p className="running-goal">
            <span className="label">目標</span>
            <span className="goal-text">{record.goal}</span>
          </p>
        )}

        <div className="session-controls">
          {paused ? (
            <button type="button" className="btn btn-secondary" onClick={resume}>
              <Icon name="play" />
              再開
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={pause}>
              <Icon name="pause" />
              一時停止
            </button>
          )}
          <button type="button" className={`btn ${reached ? 'btn-primary' : 'btn-secondary'}`} onClick={finish}>
            <Icon name="stop" />
            {reached ? '記録する' : '終了'}
          </button>
        </div>

        {askNotify && (
          <div className="notify-prompt">
            <Icon name="bell" />
            <span>目標の時間になったら通知しますか？</span>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={async () => {
                const permission = await requestNotifications()
                updateSetting('notify', permission === 'granted')
                updateSetting('notifyAsked', true)
              }}
            >
              通知をオン
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="閉じる"
              onClick={() => updateSetting('notifyAsked', true)}
            >
              <Icon name="close" />
            </button>
          </div>
        )}

        <p className="keyboard-hint">スペースキーで一時停止 / 再開</p>
      </div>
    </div>
  )
}

// しばらく操作がないとボタン類を薄くして、タイマーだけが目に入るようにする
function useIdleDim(enabled) {
  const [dimmed, setDimmed] = useState(false)
  useEffect(() => {
    if (!enabled) return
    let timer = setTimeout(() => setDimmed(true), DIM_AFTER_MS)
    const wake = () => {
      setDimmed(false)
      clearTimeout(timer)
      timer = setTimeout(() => setDimmed(true), DIM_AFTER_MS)
    }
    const events = ['pointermove', 'pointerdown', 'keydown']
    events.forEach((name) => window.addEventListener(name, wake))
    return () => {
      clearTimeout(timer)
      setDimmed(false)
      events.forEach((name) => window.removeEventListener(name, wake))
    }
  }, [enabled])
  return enabled && dimmed
}
