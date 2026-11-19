import { describe, expect, it } from 'vitest'
import { checkRelapseTime, computeHabitStats, sumSavings, type Habit, type Relapse } from './habits'

const kst = (s: string) => new Date(`${s}+09:00`)

function habit(over: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    name: '금연',
    emoji: '🚭',
    startAt: kst('2026-11-01T22:00:00'),
    dailyCost: 4500,
    dailyMinutes: 30,
    reason: '',
    isSensitive: false,
    archived: false,
    createdAt: kst('2026-11-01T22:00:00'),
    ...over,
  }
}

const relapse = (at: string, id = at): Relapse => ({ id, at: kst(at), note: '' })

describe('computeHabitStats: 실패 없음', () => {
  const stats = computeHabitStats(habit(), [], kst('2026-11-05T10:00:00'))

  it('현재 연속 = 시작부터 지금까지', () => {
    expect(stats.currentStreakDays).toBe(3) // 3일 12시간
    expect(stats.currentDayNumber).toBe(4)
  })

  it('최장 기록 = 현재 연속', () => {
    expect(stats.longestStreakMs).toBe(stats.currentStreakMs)
  })

  it('누적 성공 일수 = 시작일 ~ 어제 (11/1, 2, 3, 4)', () => {
    expect(stats.cleanDays).toBe(4)
  })

  it('아낀 돈과 시간', () => {
    expect(stats.savedMoney).toBe(4 * 4500)
    expect(stats.savedMinutes).toBe(4 * 30)
  })

  it('시도 횟수 1', () => {
    expect(stats.attempts).toBe(1)
  })
})

describe('computeHabitStats: 실패해도 0으로 리셋되지 않음', () => {
  const relapses = [relapse('2026-11-08T21:00:00')]
  const stats = computeHabitStats(habit(), relapses, kst('2026-11-10T09:00:00'))

  it('현재 연속은 마지막 실패부터', () => {
    expect(stats.currentStreakDays).toBe(1) // 1일 12시간
    expect(stats.currentDayNumber).toBe(2)
  })

  it('최장 기록은 그대로 남음 (11/1 22시 ~ 11/8 21시 = 6일 23시간)', () => {
    expect(stats.longestStreakDays).toBe(6)
    expect(stats.longestDayNumber).toBe(7)
  })

  it('현재 연속이 최장이면 일차 표시가 같다', () => {
    const fresh = computeHabitStats(habit(), [], kst('2026-11-05T10:00:00'))
    expect(fresh.longestDayNumber).toBe(fresh.currentDayNumber)
  })

  it('누적 성공 일수는 실패한 날만 빠짐 (11/1~11/9 = 9일 - 11/8 = 8일)', () => {
    expect(stats.cleanDays).toBe(8)
    expect(stats.savedMoney).toBe(8 * 4500)
  })

  it('시도 횟수 2', () => {
    expect(stats.attempts).toBe(2)
  })
})

describe('computeHabitStats: 경계 상황', () => {
  it('하루에 여러 번 실패해도 그날 하루만 빠진다', () => {
    const relapses = [relapse('2026-11-03T09:00:00'), relapse('2026-11-03T20:00:00'), relapse('2026-11-03T23:59:00')]
    const stats = computeHabitStats(habit(), relapses, kst('2026-11-05T10:00:00'))
    expect(stats.cleanDays).toBe(3) // 11/1, 2, 4
    expect(stats.attempts).toBe(4)
  })

  it('시작한 날 바로 실패', () => {
    const stats = computeHabitStats(habit(), [relapse('2026-11-01T23:00:00')], kst('2026-11-02T08:00:00'))
    expect(stats.cleanDays).toBe(0)
    expect(stats.currentStreakDays).toBe(0)
    expect(stats.currentDayNumber).toBe(1)
  })

  it('서울 자정 직전 실패는 그날로 계산', () => {
    // UTC로는 11/3 14:59, 서울로는 11/3 23:59
    const stats = computeHabitStats(habit(), [relapse('2026-11-03T23:59:00')], kst('2026-11-05T10:00:00'))
    expect(stats.cleanDays).toBe(3) // 11/1, 2, 4
  })

  it('시작 당일에는 누적 성공 일수 0 (오늘은 아직 안 끝남)', () => {
    const stats = computeHabitStats(habit(), [], kst('2026-11-01T23:30:00'))
    expect(stats.cleanDays).toBe(0)
    expect(stats.savedMoney).toBe(0)
  })

  it('시작 전 / 미래 실패 기록은 무시', () => {
    const relapses = [relapse('2026-10-30T10:00:00'), relapse('2026-12-01T10:00:00')]
    const stats = computeHabitStats(habit(), relapses, kst('2026-11-05T10:00:00'))
    expect(stats.attempts).toBe(1)
    expect(stats.cleanDays).toBe(4)
  })

  it('시작 일시가 미래면 전부 0', () => {
    const stats = computeHabitStats(habit({ startAt: kst('2026-11-10T00:00:00') }), [], kst('2026-11-05T10:00:00'))
    expect(stats.currentStreakMs).toBe(0)
    expect(stats.cleanDays).toBe(0)
  })

  it('비용이 음수로 들어와도 아낀 돈은 음수가 되지 않음', () => {
    const stats = computeHabitStats(habit({ dailyCost: -100 }), [], kst('2026-11-05T10:00:00'))
    expect(stats.savedMoney).toBe(0)
  })
})

describe('checkRelapseTime', () => {
  const now = kst('2026-11-05T10:00:00')
  it('정상', () => expect(checkRelapseTime(habit(), kst('2026-11-04T10:00:00'), now).ok).toBe(true))
  it('시작 전', () => expect(checkRelapseTime(habit(), kst('2026-10-31T10:00:00'), now).ok).toBe(false))
  it('미래', () => expect(checkRelapseTime(habit(), kst('2026-11-05T12:00:00'), now).ok).toBe(false))
})

describe('sumSavings', () => {
  it('합계', () => {
    const now = kst('2026-11-05T10:00:00')
    const a = computeHabitStats(habit(), [], now)
    const b = computeHabitStats(habit({ dailyCost: 10000, dailyMinutes: 0 }), [], now)
    expect(sumSavings([a, b])).toEqual({ money: 4 * 4500 + 4 * 10000, minutes: 4 * 30 })
  })
})
