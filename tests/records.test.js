import { describe, expect, test } from 'vitest'
import { applySession, emptyRecord, fromCloud, mergeRecords, revertSession, toCloud } from '../src/lib/records'

const now = new Date(2026, 9, 1, 12)

function session(overrides = {}) {
  return {
    id: 's1',
    seconds: 1500,
    days: { '2026-10-01': 1500 },
    target: 1500,
    startedAt: new Date(2026, 9, 1, 10).getTime(),
    ...overrides,
  }
}

describe('applySession', () => {
  test('adds the time to the day, the total and the counters', () => {
    const { record, unlocked } = applySession(emptyRecord(), session(), now)
    expect(record).toMatchObject({ total: 1500, sessions: 1, longest: 1500, daily: { '2026-10-01': 1500 } })
    expect(unlocked).toEqual(['first'])
    expect(record.titles).toEqual({ first: '2026-10-01' })
  })

  test('session titles: going twice past the target, and starting early', () => {
    const early = new Date(2026, 9, 1, 5, 30).getTime()
    const { unlocked } = applySession(emptyRecord(), session({ seconds: 700, target: 300, startedAt: early }), now)
    expect(unlocked).toEqual(['first', 'immersed', 'early'])
  })

  test('a 5 minute target is the smallest that counts for のめり込み', () => {
    const { unlocked } = applySession(emptyRecord(), session({ seconds: 200, target: 60 }), now)
    expect(unlocked).not.toContain('immersed')
  })
})

describe('revertSession', () => {
  test('undo restores the previous record', () => {
    const before = applySession(emptyRecord(), session({ id: 'a', seconds: 600, days: { '2026-09-30': 600 } }), now).record
    const applied = applySession(before, session(), now)
    const undone = revertSession(applied.record, { ...session(), prevLongest: before.longest, unlocked: applied.unlocked }, now)
    expect(undone).toEqual(before)
  })

  test('titles still earned by other records are kept', () => {
    const base = { ...emptyRecord(), total: 40000, daily: { '2026-09-01': 40000 }, longest: 40000 }
    const applied = applySession(base, session(), now)
    const undone = revertSession(applied.record, { ...session(), unlocked: ['first', 'total10'] }, now)
    expect(undone.titles).toHaveProperty('first')
    expect(undone.titles).toHaveProperty('total10')
  })
})

describe('mergeRecords', () => {
  test('adds guest time to the account and keeps the earliest title date', () => {
    const account = { ...emptyRecord(), total: 100, daily: { '2026-10-01': 100 }, sessions: 1, longest: 100, titles: { first: '2026-09-01' }, goal: '' }
    const guest = { ...emptyRecord(), total: 2000, daily: { '2026-10-01': 1500, '2026-09-30': 500 }, sessions: 2, longest: 1500, titles: { first: '2026-09-30' }, goal: '英検2級' }
    const merged = mergeRecords(account, guest, now)
    expect(merged).toMatchObject({
      total: 2100,
      daily: { '2026-10-01': 1600, '2026-09-30': 500 },
      sessions: 3,
      longest: 1500,
      goal: '英検2級',
    })
    expect(merged.titles.first).toBe('2026-09-01')
  })
})

describe('Firestore documents', () => {
  test('a legacy document keeps its total and recovers the last week by day', () => {
    const legacy = {
      userName: 'Test',
      nickname: '未設定',
      totalTime: 40000,
      todayTotal: 300,
      timestamp: '2024/2/12', // 旧版は月が 0 はじまり → 2024年3月12日（火）
      aWeekTotalTime: [100, 300, 999, 999, 0, 0, 0],
      discordSendBool: false,
      goal: 'CSSを完全に理解する',
    }
    const record = fromCloud(legacy, now)
    expect(record.total).toBe(40000)
    expect(record.daily).toEqual({ '2024-03-11': 100, '2024-03-12': 300 })
    expect(record.goal).toBe('CSSを完全に理解する')
    expect(Object.keys(record.titles).sort()).toEqual(['first', 'total10'])
  })

  test('round-trips through toCloud', () => {
    const { record } = applySession(emptyRecord(), session(), now)
    expect(fromCloud(toCloud(record), now)).toEqual(record)
  })

  test('a missing document is an empty record', () => {
    expect(fromCloud(undefined, now)).toEqual(emptyRecord())
  })
})
