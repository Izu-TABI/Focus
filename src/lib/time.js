// 日付まわりのユーティリティ。記録は端末のローカル日付 'YYYY-MM-DD' をキーにする。

export function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// setDate を使うので夏時間の切り替えがあってもずれない
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// 週は月曜はじまり
export function startOfWeek(date) {
  const day = startOfDay(date)
  return addDays(day, -((day.getDay() + 6) % 7))
}

// セグメント（作業していた区間）の合計ミリ秒。end が null の区間は now まで進行中。
export function elapsedMs(segments, now) {
  return segments.reduce((sum, { start, end }) => sum + Math.max(0, (end ?? now) - start), 0)
}

// 作業区間を日付ごとの秒数に分ける。日をまたいだ作業はそれぞれの日に振り分ける。
export function splitByDay(segments, now) {
  const msByDay = {}
  let totalMs = 0
  for (const { start, end } of segments) {
    const stop = end ?? now
    let cursor = start
    while (cursor < stop) {
      const nextDay = addDays(startOfDay(new Date(cursor)), 1).getTime()
      const chunkEnd = Math.min(stop, nextDay)
      const key = dateKey(new Date(cursor))
      msByDay[key] = (msByDay[key] ?? 0) + (chunkEnd - cursor)
      totalMs += chunkEnd - cursor
      cursor = chunkEnd
    }
  }

  // 秒に丸めた合計が全体の秒数と一致するよう、端数は一番長い日に寄せる
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = {}
  let assigned = 0
  let largest = null
  for (const [key, ms] of Object.entries(msByDay)) {
    days[key] = Math.floor(ms / 1000)
    assigned += days[key]
    if (largest === null || ms > msByDay[largest]) largest = key
  }
  if (largest !== null) days[largest] += totalSeconds - assigned
  for (const key of Object.keys(days)) {
    if (days[key] <= 0) delete days[key]
  }
  return { days, seconds: totalSeconds }
}

// タイマー表示用。59:59 までは M:SS、それ以上は H:MM:SS
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

// 記録の表示用。「1時間20分」「25分」。1分未満は「0分」。
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h === 0) return `${m}分`
  return m === 0 ? `${h}時間` : `${h}時間${m}分`
}

// 大きな合計用。10時間を超えたら分は省いて「204時間」とする
export function formatTotal(totalSeconds) {
  return totalSeconds >= 10 * 3600 ? `${Math.floor(totalSeconds / 3600)}時間` : formatDuration(totalSeconds)
}

// 目標時間の表示用（分単位で設定されるもの）
export function formatMinutes(minutes) {
  return formatDuration(minutes * 60)
}
