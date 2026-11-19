import { describe, expect, it } from 'vitest'
import { addDaysToKey } from './date'
import { hashString, pickDaily } from './daily'

describe('pickDaily', () => {
  it('같은 날에는 항상 같은 항목', () => {
    const items = ['a', 'b', 'c', 'd', 'e']
    expect(pickDaily(items, '2026-11-20')).toBe(pickDaily(items, '2026-11-20'))
  })

  it('빈 목록이면 null', () => {
    expect(pickDaily([], '2026-11-20')).toBeNull()
  })

  it('날짜가 바뀌면 여러 항목이 고루 나온다', () => {
    const items = Array.from({ length: 10 }, (_, i) => i)
    const seen = new Set<number>()
    for (let i = 0; i < 60; i++) seen.add(pickDaily(items, addDaysToKey('2026-01-01', i))!)
    expect(seen.size).toBeGreaterThanOrEqual(8)
  })

  it('해시는 0 이상의 정수', () => {
    expect(hashString('') >= 0).toBe(true)
    expect(Number.isInteger(hashString('명언'))).toBe(true)
  })
})
