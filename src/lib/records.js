import { newlyUnlocked } from './titles'
import { addDays, dateKey, startOfWeek } from './time'

// 記録データ。ゲストはブラウザ、ログイン中は Firestore の users/{uid} に同じ形で持つ。
//   total    累計秒（Firestore では旧版から続く totalTime）
//   daily    { 'YYYY-MM-DD': 秒 }
//   sessions 記録した回数
//   longest  1回の最長秒
//   titles   { 称号id: 'YYYY-MM-DD'（取得日） }
//   goal     目標の文章
export function emptyRecord() {
  return { total: 0, daily: {}, sessions: 0, longest: 0, titles: {}, goal: '' }
}

export function normalizeRecord(value) {
  const base = emptyRecord()
  if (!value || typeof value !== 'object') return base
  return {
    total: finiteOr(value.total, 0),
    daily: { ...value.daily },
    sessions: finiteOr(value.sessions, 0),
    longest: finiteOr(value.longest, 0),
    titles: { ...value.titles },
    goal: typeof value.goal === 'string' ? value.goal : '',
  }
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback
}

function grantTitles(record, ids, now) {
  if (ids.length === 0) return record
  const today = dateKey(now)
  return { ...record, titles: { ...record.titles, ...Object.fromEntries(ids.map((id) => [id, today])) } }
}

// 条件を満たしているのにまだ持っていない称号を付ける（あとから称号を増やしたときや旧版のデータ向け）。
// 何も増えなければ同じオブジェクトを返す。
export function withEarnedTitles(record, now) {
  return grantTitles(record, newlyUnlocked(record), now)
}

// session: { id, seconds, days: {キー: 秒}, target, startedAt }
export function applySession(record, session, now) {
  const daily = { ...record.daily }
  for (const [key, seconds] of Object.entries(session.days)) {
    daily[key] = (daily[key] ?? 0) + seconds
  }
  const next = {
    ...record,
    daily,
    total: record.total + session.seconds,
    sessions: record.sessions + 1,
    longest: Math.max(record.longest, session.seconds),
  }
  const unlocked = newlyUnlocked(next, session)
  return { record: grantTitles(next, unlocked, now), unlocked }
}

// 直前に記録した作業の取り消し。applySession の結果に含まれていた
// prevLongest と unlocked（その回で取れた称号）を使って元に戻す。
export function revertSession(record, session, now) {
  const daily = { ...record.daily }
  for (const [key, seconds] of Object.entries(session.days)) {
    const left = (daily[key] ?? 0) - seconds
    if (left > 0) daily[key] = left
    else delete daily[key]
  }
  const titles = { ...record.titles }
  for (const id of session.unlocked ?? []) delete titles[id]
  const next = {
    ...record,
    daily,
    titles,
    total: Math.max(0, record.total - session.seconds),
    sessions: Math.max(0, record.sessions - 1),
    longest: record.longest === session.seconds ? (session.prevLongest ?? record.longest) : record.longest,
  }
  // ほかの記録で条件を満たしている称号は残す
  return withEarnedTitles(next, now)
}

// ゲストの記録をアカウントへ引き継ぐ
export function mergeRecords(base, extra, now) {
  const daily = { ...base.daily }
  for (const [key, seconds] of Object.entries(extra.daily)) {
    daily[key] = (daily[key] ?? 0) + seconds
  }
  const titles = { ...extra.titles }
  for (const [id, date] of Object.entries(base.titles)) {
    if (!titles[id] || date < titles[id]) titles[id] = date
  }
  const next = {
    total: base.total + extra.total,
    daily,
    sessions: base.sessions + extra.sessions,
    longest: Math.max(base.longest, extra.longest),
    titles,
    goal: base.goal || extra.goal,
  }
  return withEarnedTitles(next, now)
}

export function hasProgress(record) {
  return record.total > 0 || record.goal !== '' || Object.keys(record.titles).length > 0
}

// ---- Firestore のドキュメントとの変換 ----

export const SCHEMA_VERSION = 2

export function fromCloud(doc, now) {
  if (!doc) return emptyRecord()
  const record = normalizeRecord({
    total: doc.totalTime,
    daily: doc.daily,
    sessions: doc.sessions,
    longest: doc.longest,
    titles: doc.titles,
    goal: doc.goal,
  })
  // 旧版（2024年まで）のデータ。日別の記録は「最後に開いた週」の分しか残っていない。
  if ((doc.schema ?? 1) < SCHEMA_VERSION) record.daily = legacyDaily(doc)
  return withEarnedTitles(record, now)
}

export function toCloud(record) {
  return {
    schema: SCHEMA_VERSION,
    totalTime: record.total,
    daily: record.daily,
    sessions: record.sessions,
    longest: record.longest,
    titles: record.titles,
    goal: record.goal,
  }
}

// 旧版は timestamp に 'YYYY/M/D'（M は 0 はじまり）で最後に開いた日、
// aWeekTotalTime に その週の月〜日の秒数を持っていた
export function legacyDaily(doc) {
  const daily = {}
  const week = doc.aWeekTotalTime
  const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(doc.timestamp ?? '')
  if (!Array.isArray(week) || !match) return daily
  const lastOpened = new Date(Number(match[1]), Number(match[2]), Number(match[3]))
  const monday = startOfWeek(lastOpened)
  const lastIndex = (lastOpened.getDay() + 6) % 7
  for (let i = 0; i <= lastIndex && i < week.length; i++) {
    const seconds = Math.floor(Number(week[i]))
    if (seconds > 0) daily[dateKey(addDays(monday, i))] = seconds
  }
  return daily
}
