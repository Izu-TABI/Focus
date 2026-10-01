import { randomId } from './storage'
import { elapsedMs, splitByDay } from './time'

// 作業中のセッション。リロードしても続きから再開できるよう localStorage に置く。
//   target    目標秒数
//   segments  実際に作業していた区間 [{ start, end }]。end が null の区間が進行中。
//   alerted   目標達成の通知を出したか
export function createSession(targetSeconds, now) {
  return { id: randomId(), target: targetSeconds, segments: [{ start: now, end: null }], alerted: false }
}

export function isPaused(session) {
  return session.segments.at(-1).end !== null
}

export function pauseSession(session, now) {
  if (isPaused(session)) return session
  const segments = session.segments.slice(0, -1)
  segments.push({ ...session.segments.at(-1), end: now })
  return { ...session, segments }
}

export function resumeSession(session, now) {
  if (!isPaused(session)) return session
  return { ...session, segments: [...session.segments, { start: now, end: null }] }
}

export function elapsedSeconds(session, now) {
  return elapsedMs(session.segments, now) / 1000
}

// 次に表示上の秒が切り替わるまでのミリ秒
export function msUntilNextSecond(session, now) {
  return 1000 - (elapsedMs(session.segments, now) % 1000)
}

export function msUntilGoal(session, now) {
  return session.target * 1000 - elapsedMs(session.segments, now)
}

// 終了したセッションを記録用の形にする
export function finishSession(session, now) {
  const { days, seconds } = splitByDay(session.segments, now)
  return {
    id: session.id,
    seconds,
    days,
    target: session.target,
    startedAt: session.segments[0].start,
  }
}

export function isValidSession(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    Number.isFinite(value.target) &&
    Array.isArray(value.segments) &&
    value.segments.length > 0 &&
    value.segments.every((s) => Number.isFinite(s.start) && (s.end === null || Number.isFinite(s.end)))
  )
}
