import { describe, expect, test } from 'vitest'
import { dateKey, elapsedMs, formatClock, formatDuration, formatTotal, splitByDay, startOfWeek } from '../src/lib/time'

const at = (d, h, m = 0, s = 0) => new Date(2026, 9, d, h, m, s).getTime() // 2026年10月

describe('dateKey', () => {
  test('zero-pads month and day', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(dateKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('startOfWeek', () => {
  test('weeks start on Monday, including when today is Sunday', () => {
    expect(dateKey(startOfWeek(new Date(2026, 9, 1)))).toBe('2026-09-28') // 木曜
    expect(dateKey(startOfWeek(new Date(2026, 9, 4, 23)))).toBe('2026-09-28') // 日曜
    expect(dateKey(startOfWeek(new Date(2026, 9, 5)))).toBe('2026-10-05') // 月曜
  })
})

describe('splitByDay', () => {
  test('a session inside one day', () => {
    const result = splitByDay([{ start: at(1, 10), end: at(1, 10, 25) }])
    expect(result).toEqual({ days: { '2026-10-01': 1500 }, seconds: 1500 })
  })

  test('a session across midnight is split between the two days', () => {
    const result = splitByDay([{ start: at(1, 23, 30), end: at(2, 0, 45) }])
    expect(result).toEqual({ days: { '2026-10-01': 1800, '2026-10-02': 2700 }, seconds: 4500 })
  })

  test('paused time is not counted and an open segment runs until now', () => {
    const segments = [
      { start: at(1, 9), end: at(1, 9, 10) },
      { start: at(1, 9, 20), end: null },
    ]
    expect(elapsedMs(segments, at(1, 9, 30))).toBe(20 * 60 * 1000)
    expect(splitByDay(segments, at(1, 9, 30)).seconds).toBe(1200)
  })

  test('rounded per-day seconds always add up to the total', () => {
    const start = at(1, 23, 59, 59) + 400
    const result = splitByDay([{ start, end: at(2, 0, 0, 1) + 700 }])
    const sum = Object.values(result.days).reduce((a, b) => a + b, 0)
    expect(result.seconds).toBe(2)
    expect(sum).toBe(2)
  })
})

describe('formatting', () => {
  test('formatClock', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(59.9)).toBe('0:59')
    expect(formatClock(1500)).toBe('25:00')
    expect(formatClock(3600)).toBe('1:00:00')
    expect(formatClock(5461)).toBe('1:31:01')
  })

  test('formatDuration', () => {
    expect(formatDuration(0)).toBe('0分')
    expect(formatDuration(301)).toBe('5分') // 旧版は「6分1秒」と表示していた
    expect(formatDuration(3600)).toBe('1時間')
    expect(formatDuration(4800)).toBe('1時間20分')
  })

  test('formatTotal drops minutes once the total passes 10 hours', () => {
    expect(formatTotal(4800)).toBe('1時間20分')
    expect(formatTotal(737516)).toBe('204時間')
  })
})
