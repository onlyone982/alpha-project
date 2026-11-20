import { describe, expect, it } from 'vitest'
import { HABIT_TIPS } from '../content/habitTips'
import { slotForHour, slotKey, tipQueue } from './tips'

describe('시간대', () => {
  it.each([
    [5, 'morning'],
    [10, 'morning'],
    [11, 'lunch'],
    [16, 'lunch'],
    [17, 'evening'],
    [23, 'evening'],
    [2, 'evening'],
  ] as const)('%i시 → %s', (hour, slot) => expect(slotForHour(hour)).toBe(slot))

  it('새벽은 전날 저녁으로 묶임', () => {
    expect(slotKey('2026-11-21', 2, '2026-11-20')).toBe('2026-11-20:evening')
    expect(slotKey('2026-11-21', 8, '2026-11-20')).toBe('2026-11-21:morning')
  })
})

describe('tipQueue', () => {
  it('그 시간대 추천만, 숨긴 것 제외', () => {
    const q = tipQueue(HABIT_TIPS, 'lunch', 's', new Set(['l-sunscreen']), [])
    expect(q.every((t) => t.slot === 'lunch')).toBe(true)
    expect(q.map((t) => t.id)).not.toContain('l-sunscreen')
  })

  it('같은 seed 면 같은 순서, 다른 seed 면 섞임', () => {
    const a = tipQueue(HABIT_TIPS, 'morning', '2026-11-20:morning', new Set(), []).map((t) => t.id)
    const b = tipQueue(HABIT_TIPS, 'morning', '2026-11-20:morning', new Set(), []).map((t) => t.id)
    expect(a).toEqual(b)
    const seeds = new Set(['1', '2', '3', '4', '5'].map((s) => tipQueue(HABIT_TIPS, 'morning', s, new Set(), [])[0].id))
    expect(seeds.size).toBeGreaterThan(1)
  })

  it('내 끊기 항목과 관련된 추천이 먼저', () => {
    const q = tipQueue(HABIT_TIPS, 'morning', 'x', new Set(), ['금연'])
    expect(q[0].id).toBe('m-walk-smoke')
  })

  it('추천 id 가 겹치지 않는다', () => {
    const ids = HABIT_TIPS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
