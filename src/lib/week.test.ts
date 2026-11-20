import { describe, expect, it } from 'vitest'
import { summarizeWeek, weekDays } from './week'

describe('weekDays', () => {
  it('월요일 시작 (2026-11-20 금요일 → 11/16 ~ 11/22)', () => {
    expect(weekDays('2026-11-20')).toEqual([
      '2026-11-16',
      '2026-11-17',
      '2026-11-18',
      '2026-11-19',
      '2026-11-20',
      '2026-11-21',
      '2026-11-22',
    ])
  })

  it('일요일은 그 주의 마지막 날', () => {
    expect(weekDays('2026-11-22')[0]).toBe('2026-11-16')
  })
})

describe('summarizeWeek', () => {
  it('이번 주 것만 센다', () => {
    const s = summarizeWeek({
      todayKey: '2026-11-20',
      recordedDays: new Set(['2026-11-15', '2026-11-16', '2026-11-18', '2026-11-20']),
      todos: [
        { date: '2026-11-15', done: true },
        { date: '2026-11-17', done: true },
        { date: '2026-11-20', done: false },
      ],
      relapseDays: ['2026-11-10', '2026-11-19'],
    })
    expect(s).toEqual({ daysSoFar: 5, recordedDays: 3, todoDone: 1, todoTotal: 2, relapses: 1 })
  })
})
