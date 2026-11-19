import { describe, expect, it } from 'vitest'
import { dayNumber, elapsedParts } from './dayCounter'

const kst = (s: string) => new Date(`${s}+09:00`)

describe('dayNumber', () => {
  it('시작 당일은 DAY 1', () => {
    expect(dayNumber(kst('2026-10-03T06:00:00'), kst('2026-10-03T23:59:59'))).toBe(1)
  })

  it('서울 자정이 지나면 DAY 2 (24시간이 안 지나도)', () => {
    expect(dayNumber(kst('2026-10-03T23:00:00'), kst('2026-10-04T00:00:01'))).toBe(2)
  })

  it('시작 전이면 0', () => {
    expect(dayNumber(kst('2026-10-03T06:00:00'), kst('2026-10-03T05:00:00'))).toBe(0)
  })

  it('47일째', () => {
    expect(dayNumber(kst('2026-10-04T06:00:00'), kst('2026-11-19T10:00:00'))).toBe(47)
  })
})

describe('elapsedParts', () => {
  it('일/시/분/초로 나눈다', () => {
    expect(elapsedParts(kst('2026-10-01T00:00:00'), kst('2026-10-03T13:22:05'))).toEqual({
      days: 2,
      hours: 13,
      minutes: 22,
      seconds: 5,
    })
  })

  it('미래 시작이면 0', () => {
    expect(elapsedParts(kst('2026-10-03T00:00:00'), kst('2026-10-01T00:00:00'))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })
})
