import { describe, expect, test } from 'vitest'
import { bestStreak, currentStreak, heatLevel, sumSeries, weekSeries, yearGrid } from '../src/lib/stats'

const daily = {
  '2026-09-27': 1800, // 日
  '2026-09-28': 600, // 月
  '2026-09-29': 30, // 1分未満は連続に数えない
  '2026-09-30': 3600,
  '2026-10-01': 1200,
}

describe('weekSeries', () => {
  test('returns Monday to Sunday of the week containing the date', () => {
    const series = weekSeries(daily, new Date(2026, 9, 1))
    expect(series.map((d) => d.key)).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ])
    expect(sumSeries(series)).toBe(600 + 30 + 3600 + 1200)
  })
})

describe('streaks', () => {
  test('counts back from today when today is active', () => {
    expect(currentStreak(daily, new Date(2026, 9, 1, 21))).toEqual({ days: 2, activeToday: true })
  })

  test('a streak that ended yesterday is still alive today', () => {
    expect(currentStreak(daily, new Date(2026, 9, 2, 8))).toEqual({ days: 2, activeToday: false })
  })

  test('a missed day breaks the streak', () => {
    expect(currentStreak(daily, new Date(2026, 9, 3, 8))).toEqual({ days: 0, activeToday: false })
  })

  test('best streak spans month boundaries', () => {
    expect(bestStreak(daily)).toBe(2)
    expect(bestStreak({ '2026-09-29': 60, '2026-09-30': 60, '2026-10-01': 60, '2026-10-03': 60 })).toBe(3)
  })
})

describe('yearGrid', () => {
  test('ends with the current week and marks future days', () => {
    const grid = yearGrid(daily, new Date(2026, 9, 1, 12))
    expect(grid).toHaveLength(53)
    const lastWeek = grid.at(-1)
    expect(lastWeek[0].key).toBe('2026-09-28')
    expect(lastWeek[3]).toMatchObject({ key: '2026-10-01', seconds: 1200, future: false })
    expect(lastWeek[4].future).toBe(true)
  })

  test('heat levels', () => {
    expect([0, 59, 60, 1799, 1800, 3600, 7200].map(heatLevel)).toEqual([0, 0, 1, 1, 2, 3, 4])
  })
})
