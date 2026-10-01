// 作業時間の選択肢（分）
export const PRESETS = [5, 15, 30, 60, 90]
export const MAX_MINUTES = 240

// 「その他」で微調整するときの刻み。1〜10分は1分、60分までは5分、それ以上は15分刻み
export function nextMinutes(minutes) {
  if (minutes < 10) return minutes + 1
  if (minutes < 60) return Math.min(60, Math.floor(minutes / 5) * 5 + 5)
  return Math.min(MAX_MINUTES, Math.floor(minutes / 15) * 15 + 15)
}

export function previousMinutes(minutes) {
  if (minutes <= 10) return Math.max(1, minutes - 1)
  if (minutes <= 60) return Math.ceil(minutes / 5) * 5 - 5
  return Math.ceil(minutes / 15) * 15 - 15
}
