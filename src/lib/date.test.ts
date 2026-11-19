import { describe, expect, it } from 'vitest'
import { addDaysToKey, dayKeyDiff, formatSeoul, fromSeoulInput, toDayKey, toSeoulInput } from './date'

describe('toDayKey (서울 기준 자정 경계)', () => {
  it('UTC 14:59:59 는 서울 23:59:59 이므로 같은 날', () => {
    expect(toDayKey(new Date('2026-11-19T14:59:59Z'))).toBe('2026-11-19')
  })

  it('UTC 15:00:00 은 서울 다음 날 00:00:00', () => {
    expect(toDayKey(new Date('2026-11-19T15:00:00Z'))).toBe('2026-11-20')
  })

  it('연말 경계', () => {
    expect(toDayKey(new Date('2026-12-31T15:00:00Z'))).toBe('2027-01-01')
  })
})

describe('formatSeoul', () => {
  it('서울 시각으로 포맷', () => {
    expect(formatSeoul(new Date('2026-11-19T00:30:05Z'), 'HH:mm:ss')).toBe('09:30:05')
  })
})

describe('날짜 키 계산', () => {
  it('dayKeyDiff', () => {
    expect(dayKeyDiff('2026-11-19', '2026-11-19')).toBe(0)
    expect(dayKeyDiff('2026-11-19', '2026-12-01')).toBe(12)
    expect(dayKeyDiff('2026-12-31', '2027-01-01')).toBe(1)
  })

  it('addDaysToKey', () => {
    expect(addDaysToKey('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDaysToKey('2026-03-01', -1)).toBe('2026-02-28')
  })
})

describe('datetime-local 입력 변환 (서울)', () => {
  it('입력값을 서울 시각으로 해석', () => {
    expect(fromSeoulInput('2026-10-03T06:00')?.toISOString()).toBe('2026-10-02T21:00:00.000Z')
  })

  it('잘못된 값은 null', () => {
    expect(fromSeoulInput('')).toBeNull()
    expect(fromSeoulInput('2026-10-03')).toBeNull()
  })

  it('왕복 변환', () => {
    expect(toSeoulInput(fromSeoulInput('2026-11-20T00:15')!)).toBe('2026-11-20T00:15')
  })
})
