import { addDays, dateKey, parseKey, startOfDay, startOfWeek } from './time'

// 連続日数に数えるのは1分以上記録した日
export const ACTIVE_DAY_SECONDS = 60

export function secondsOn(daily, date) {
  return daily[dateKey(date)] ?? 0
}

export function weekSeries(daily, anyDayInWeek) {
  const monday = startOfWeek(anyDayInWeek)
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    return { date, key: dateKey(date), seconds: secondsOn(daily, date) }
  })
}

export function sumSeries(series) {
  return series.reduce((sum, day) => sum + day.seconds, 0)
}

function isActive(daily, date) {
  return secondsOn(daily, date) >= ACTIVE_DAY_SECONDS
}

// 今日まだ記録していなくても、昨日までの連続は「継続中」として数える
export function currentStreak(daily, now) {
  const today = startOfDay(now)
  const activeToday = isActive(daily, today)
  let cursor = activeToday ? today : addDays(today, -1)
  let days = 0
  while (isActive(daily, cursor)) {
    days += 1
    cursor = addDays(cursor, -1)
  }
  return { days, activeToday }
}

export function bestStreak(daily) {
  const keys = Object.keys(daily)
    .filter((key) => daily[key] >= ACTIVE_DAY_SECONDS)
    .sort()
  let best = 0
  let run = 0
  let previous = null
  for (const key of keys) {
    const date = parseKey(key)
    run = previous && dateKey(addDays(previous, 1)) === key ? run + 1 : 1
    best = Math.max(best, run)
    previous = date
  }
  return best
}

// GitHub の草のような年間グラフ用。列が週（月曜はじまり）、最後の列が今週。
export function yearGrid(daily, now, weeks = 53) {
  const today = startOfDay(now)
  const firstMonday = addDays(startOfWeek(today), -(weeks - 1) * 7)
  const columns = []
  for (let w = 0; w < weeks; w++) {
    const days = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(firstMonday, w * 7 + d)
      days.push({
        date,
        key: dateKey(date),
        seconds: secondsOn(daily, date),
        future: date > today,
      })
    }
    columns.push(days)
  }
  return columns
}

// 草の濃さ（0〜4）
export function heatLevel(seconds) {
  if (seconds < ACTIVE_DAY_SECONDS) return 0
  if (seconds < 30 * 60) return 1
  if (seconds < 60 * 60) return 2
  if (seconds < 2 * 60 * 60) return 3
  return 4
}

export function sumSince(daily, fromDate) {
  const fromKey = dateKey(fromDate)
  return Object.entries(daily).reduce((sum, [key, seconds]) => (key >= fromKey ? sum + seconds : sum), 0)
}
