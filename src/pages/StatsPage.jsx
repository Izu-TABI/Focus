import { useLayoutEffect, useRef, useState } from 'react'
import { Figure } from '../components/Figure'
import { Icon } from '../components/Icon'
import { TitleIcon } from '../components/TitleIcon'
import { useStore } from '../data/store'
import { useToday } from '../lib/effects'
import {
  bestStreak,
  currentStreak,
  heatLevel,
  secondsOn,
  sumSeries,
  sumSince,
  weekSeries,
  yearGrid,
} from '../lib/stats'
import { addDays, formatDuration, formatTotal, startOfWeek } from '../lib/time'
import { TITLES } from '../lib/titles'

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日']

export function StatsPage() {
  const { record, account, signIn } = useStore()
  const now = useToday()
  const streak = currentStreak(record.daily, now)
  const best = bestStreak(record.daily)
  const thisWeek = sumSeries(weekSeries(record.daily, now))

  return (
    <div className="stats-page">
      <h1 className="page-title">記録</h1>

      <dl className="tiles">
        <Tile label="今日" value={formatDuration(secondsOn(record.daily, now))} />
        <Tile label="今週" value={formatDuration(thisWeek)} />
        <Tile label="連続" value={`${streak.days}日`} note={`最高 ${Math.max(best, streak.days)}日`} />
        <Tile label="累計" value={formatTotal(record.total)} note={record.sessions ? `${record.sessions}回` : null} />
      </dl>

      {!account && (
        <p className="guest-note">
          ゲストとして使っています。記録はこのブラウザにだけ保存されます。
          <button type="button" className="link-button" onClick={signIn}>
            Googleでログイン
          </button>
          すると、ほかの端末と同期できます。
        </p>
      )}

      <WeekSection daily={record.daily} now={now} />
      <YearSection daily={record.daily} total={record.total} now={now} />
      <TitlesSection record={record} />
    </div>
  )
}

function Tile({ label, value, note }) {
  return (
    <div className="tile">
      <dt className="label">{label}</dt>
      <dd className="tile-value">
        <Figure>{value}</Figure>
      </dd>
      {note && <dd className="tile-note">{note}</dd>}
    </div>
  )
}

function WeekSection({ daily, now }) {
  const [offset, setOffset] = useState(0)
  const monday = addDays(startOfWeek(now), offset * 7)
  const series = weekSeries(daily, monday)
  const total = sumSeries(series)
  const max = Math.max(...series.map((day) => day.seconds), 30 * 60)
  const todayKey = series.find((day) => day.date.toDateString() === now.toDateString())?.key
  const sunday = addDays(monday, 6)
  const range = `${monday.getMonth() + 1}/${monday.getDate()} – ${sunday.getMonth() + 1}/${sunday.getDate()}`

  return (
    <section className="section">
      <div className="section-head">
        <h2>{offset === 0 ? '今週' : offset === -1 ? '先週' : range}</h2>
        <div className="week-nav">
          <span className="meta">
            <Figure>{formatDuration(total)}</Figure>
          </span>
          <button type="button" className="icon-button" aria-label="前の週" onClick={() => setOffset(offset - 1)}>
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="次の週"
            disabled={offset >= 0}
            onClick={() => setOffset(offset + 1)}
          >
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
      <div className="week-chart" role="img" aria-label={weekLabel(series)}>
        {series.map((day) => {
          const minutes = Math.floor(day.seconds / 60)
          return (
            <div className={`week-col${day.key === todayKey ? ' is-today' : ''}`} key={day.key}>
              <span className="week-value">{minutes > 0 ? minutes : ''}</span>
              <span className="week-bar" style={{ height: `${(day.seconds / max) * 100}%` }} />
            </div>
          )
        })}
      </div>
      <div className="week-labels" aria-hidden="true">
        {series.map((day, i) => (
          <span key={day.key} className={day.key === todayKey ? 'is-today' : ''}>
            {WEEKDAYS[i]}
          </span>
        ))}
      </div>
      <p className="chart-unit">単位：分</p>
    </section>
  )
}

function weekLabel(series) {
  return series.map((day, i) => `${WEEKDAYS[i]}曜日 ${formatDuration(day.seconds)}`).join('、')
}

function YearSection({ daily, total: lifetime, now }) {
  const grid = yearGrid(daily, now)
  const scroller = useRef(null)
  const yearAgo = addDays(now, -364)
  const total = sumSince(daily, yearAgo)
  const activeDays = grid.flat().filter((day) => !day.future && heatLevel(day.seconds) > 0).length

  // 最新の週が見えるように、表示される前に右端までスクロールしておく
  useLayoutEffect(() => {
    const element = scroller.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [])

  return (
    <section className="section">
      <div className="section-head">
        <h2>この1年</h2>
        <span className="meta">
          <Figure>{formatTotal(total)}</Figure>　<Figure>{`${activeDays}日`}</Figure>
        </span>
      </div>
      <div className="heatmap-scroll" ref={scroller}>
        <div className="heatmap" role="img" aria-label={`この1年で${activeDays}日、合計${formatDuration(total)}集中しました`}>
          <div className="heatmap-months" aria-hidden="true">
            {grid.map((week, i) => {
              // 月が変わった列にだけ月を書く
              const month = week[0].date.getMonth()
              const changed = i > 0 && month !== grid[i - 1][0].date.getMonth()
              return <span key={week[0].key}>{changed ? `${month + 1}月` : ''}</span>
            })}
          </div>
          <div className="heatmap-weekdays" aria-hidden="true">
            <span>月</span>
            <span />
            <span>水</span>
            <span />
            <span>金</span>
            <span />
            <span />
          </div>
          <div className="heatmap-grid">
            {grid.map((week) => (
              <div className="heatmap-week" key={week[0].key}>
                {week.map((day) => (
                  <span
                    key={day.key}
                    className="heat"
                    data-level={day.future ? 'future' : heatLevel(day.seconds)}
                    title={day.future ? undefined : `${day.date.getMonth() + 1}月${day.date.getDate()}日 ${formatDuration(day.seconds)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="heat-legend" aria-hidden="true">
        少ない
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className="heat" data-level={level} />
        ))}
        多い
      </div>
      <LegacyNote daily={daily} lifetime={lifetime} />
    </section>
  )
}

// 旧版（2024年まで）の記録は合計時間しか残っていないので、グラフに出ない理由を添える
function LegacyNote({ daily, lifetime }) {
  const untracked = lifetime - Object.values(daily).reduce((sum, seconds) => sum + seconds, 0)
  if (untracked < 60) return null
  return (
    <p className="legacy-note">
      以前のバージョンで記録した {formatTotal(untracked)} は日ごとの内訳がないため、累計にだけ含まれています。
    </p>
  )
}

function TitlesSection({ record }) {
  const owned = TITLES.filter((title) => record.titles[title.id]).length
  return (
    <section className="section">
      <div className="section-head">
        <h2>称号</h2>
        <span className="meta">
          {owned} / {TITLES.length}
        </span>
      </div>
      <ul className="titles">
        {TITLES.map((title) => {
          const date = record.titles[title.id]
          const progress = !date && title.progress?.(record)
          return (
            <li className={`title-item${date ? ' is-owned' : ''}`} key={title.id}>
              <TitleIcon id={title.id} className="title-icon" />
              <div className="title-body">
                <div className="title-name">{title.name}</div>
                <div className="title-description">{title.description}</div>
                {progress && (
                  <div className="title-progress" aria-hidden="true">
                    <span style={{ width: `${Math.min(1, progress.value / progress.goal) * 100}%` }} />
                  </div>
                )}
              </div>
              <div className="title-status">
                {date && formatDate(date)}
                {progress && `${progress.format(Math.min(progress.value, progress.goal))} / ${progress.format(progress.goal)}`}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function formatDate(key) {
  return key.replaceAll('-', '.')
}
