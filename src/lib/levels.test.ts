import { describe, expect, it } from 'vitest'
import { levelFor } from './levels'

describe('levelFor', () => {
  it.each([
    [0, 'Doomer'],
    [13, 'Doomer'],
    [14, 'NPC'],
    [29, 'NPC'],
    [30, 'Normal'],
    [60, 'Grindset'],
    [99, 'Grindset'],
    [100, 'Sigma'],
    [200, 'Chad'],
    [364, 'Chad'],
    [365, 'Gigachad'],
    [1000, 'Gigachad'],
  ])('%i일 → %s', (days, name) => {
    expect(levelFor(days).level.name).toBe(name)
  })

  it('다음 레벨까지 남은 일수', () => {
    expect(levelFor(10)).toMatchObject({ next: { name: 'NPC' }, daysToNext: 4 })
    expect(levelFor(400)).toMatchObject({ next: null, daysToNext: null })
  })

  it('음수는 0으로', () => {
    expect(levelFor(-3).level.name).toBe('Doomer')
  })
})
