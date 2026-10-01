import { useState } from 'react'
import { Figure } from '../components/Figure'
import { Icon } from '../components/Icon'
import { useSession } from '../data/session'
import { useStore } from '../data/store'
import { useToday } from '../lib/effects'
import { MAX_MINUTES, nextMinutes, PRESETS, previousMinutes } from '../lib/presets'
import { currentStreak, secondsOn } from '../lib/stats'
import { formatClock, formatDuration } from '../lib/time'
import { Dial } from './Dial'
import { GoalEditor } from './GoalEditor'

export function IdleView() {
  const { record, settings, updateSetting } = useStore()
  const { start } = useSession()
  const minutes = settings.minutes
  const isPreset = PRESETS.includes(minutes)
  const [customOpen, setCustomOpen] = useState(false)
  const now = useToday()
  const today = secondsOn(record.daily, now)
  const streak = currentStreak(record.daily, now)

  const choose = (value) => updateSetting('minutes', value)

  let streakText = null
  if (streak.activeToday && streak.days >= 2) streakText = `${streak.days}日連続`
  else if (!streak.activeToday && streak.days >= 1) streakText = `今日で${streak.days + 1}日連続`

  return (
    <div className="timer-view">
      <Dial progress={0} state="idle">
        <div className="clock" aria-label={`${formatDuration(minutes * 60)}に設定中`}>
          {formatClock(minutes * 60)}
        </div>
        <div className="dial-caption">
          {today > 0 ? `今日 ${formatDuration(today)}` : '今日はまだ記録なし'}
          {streakText && (
            <>
              <br />
              {streakText}
            </>
          )}
        </div>
      </Dial>

      <div className="timer-controls">
        <div className="segmented presets" role="group" aria-label="作業時間">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={minutes === value}
              onClick={() => {
                choose(value)
                setCustomOpen(false)
              }}
            >
              <Figure>{`${value}分`}</Figure>
            </button>
          ))}
          <button
            type="button"
            aria-pressed={!isPreset}
            aria-expanded={customOpen}
            onClick={() => setCustomOpen((open) => !open)}
          >
            {isPreset ? 'その他' : <Figure>{`${minutes}分`}</Figure>}
          </button>
        </div>

        {customOpen && (
          <div className="stepper" role="group" aria-label="作業時間を調整">
            <button
              type="button"
              className="stepper-button"
              aria-label="短くする"
              disabled={minutes <= 1}
              onClick={() => choose(previousMinutes(minutes))}
            >
              <Icon name="minus" />
            </button>
            <output className="stepper-value">
              <Figure>{formatDuration(minutes * 60)}</Figure>
            </output>
            <button
              type="button"
              className="stepper-button"
              aria-label="長くする"
              disabled={minutes >= MAX_MINUTES}
              onClick={() => choose(nextMinutes(minutes))}
            >
              <Icon name="plus" />
            </button>
          </div>
        )}

        <button type="button" className="btn btn-primary btn-large start-button" onClick={() => start(minutes)}>
          <Icon name="play" />
          はじめる
        </button>

        <GoalEditor />
      </div>
    </div>
  )
}
