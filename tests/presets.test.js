import { describe, expect, test } from 'vitest'
import { MAX_MINUTES, nextMinutes, previousMinutes } from '../src/lib/presets'

describe('custom duration steps', () => {
  test('1 minute steps up to 10, then 5 minutes up to 60, then 15 minutes', () => {
    const ups = []
    for (let m = 1; m < MAX_MINUTES; m = nextMinutes(m)) ups.push(m)
    expect(ups.slice(0, 12)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20])
    expect(ups).toContain(60)
    expect(ups).toContain(75)
    expect(nextMinutes(MAX_MINUTES)).toBe(MAX_MINUTES)
  })

  test('stepping back lands on the same grid, even from an odd value', () => {
    expect(previousMinutes(15)).toBe(10)
    expect(previousMinutes(12)).toBe(10)
    expect(previousMinutes(70)).toBe(60)
    expect(previousMinutes(1)).toBe(1)
    expect(nextMinutes(12)).toBe(15)
  })
})
