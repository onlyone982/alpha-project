import { describe, expect, it } from 'vitest'
import { addDaysToKey } from './date'
import { computeStreak } from './streak'

/** '2026-11-01' 부터 n일 연속 키 */
const days = (start: string, n: number) => Array.from({ length: n }, (_, i) => addDaysToKey(start, i))
const set = (...groups: string[][]) => new Set(groups.flat())

describe('computeStreak', () => {
  it('기록이 없으면 0', () => {
    const r = computeStreak(new Set(), '2026-11-10')
    expect(r).toMatchObject({ current: 0, longest: 0, freezes: 0, todayRecorded: false })
  })

  it('어제까지 3일 연속, 오늘 아직 기록 안 함 → 3 유지', () => {
    const r = computeStreak(set(days('2026-11-07', 3)), '2026-11-10')
    expect(r.current).toBe(3)
    expect(r.todayRecorded).toBe(false)
  })

  it('오늘 기록하면 바로 +1', () => {
    const r = computeStreak(set(days('2026-11-07', 4)), '2026-11-10')
    expect(r.current).toBe(4)
    expect(r.todayRecorded).toBe(true)
  })

  it('프리즈 없이 하루 빠지면 끊김', () => {
    const r = computeStreak(set(days('2026-11-01', 3), ['2026-11-05']), '2026-11-06')
    expect(r.current).toBe(1)
    expect(r.longest).toBe(3)
  })

  it('7일 연속이면 프리즈 1개 획득', () => {
    const r = computeStreak(set(days('2026-11-01', 7)), '2026-11-08')
    expect(r.freezes).toBe(1)
  })

  it('프리즈가 빠진 날을 막아준다 (일수는 안 늘어남)', () => {
    // 11/1~11/7 기록(프리즈 1) → 11/8 빠짐(프리즈 사용) → 11/9 기록
    const r = computeStreak(set(days('2026-11-01', 7), ['2026-11-09']), '2026-11-10')
    expect(r.current).toBe(8)
    expect(r.freezes).toBe(0)
    expect([...r.frozenDays]).toEqual(['2026-11-08'])
  })

  it('프리즈 1개로 이틀 빠지면 둘째 날 끊김', () => {
    const r = computeStreak(set(days('2026-11-01', 7), ['2026-11-10']), '2026-11-11')
    expect([...r.frozenDays]).toEqual(['2026-11-08'])
    expect(r.current).toBe(1)
    expect(r.longest).toBe(7)
  })

  it('프리즈는 최대 2개', () => {
    const r = computeStreak(set(days('2026-11-01', 28)), '2026-11-29')
    expect(r.freezes).toBe(2)
  })

  it('연속이 없을 때는 프리즈를 쓰지 않는다', () => {
    // 7일 기록 → 프리즈 1 → 2일 빠짐(첫날 프리즈 사용, 둘째날 끊김) → 그다음 빈 날에는 프리즈 소모 없음
    const r = computeStreak(set(days('2026-11-01', 7)), '2026-11-20')
    expect([...r.frozenDays]).toEqual(['2026-11-08'])
    expect(r.current).toBe(0)
  })

  it('오늘 기록 안 했어도 오늘은 끊기지도, 프리즈를 쓰지도 않는다', () => {
    const r = computeStreak(set(days('2026-11-01', 7)), '2026-11-08')
    expect(r.frozenDays.size).toBe(0)
    expect(r.current).toBe(7)
  })

  it('오늘 기록으로 7일이 되면 프리즈 즉시 획득', () => {
    const r = computeStreak(set(days('2026-11-02', 7)), '2026-11-08')
    expect(r.current).toBe(7)
    expect(r.freezes).toBe(1)
  })
})
