import { describe, expect, it } from 'vitest'
import { LEVELS } from '../content/levels'
import { checkLevels, levelFor, resolveLevels } from './levels'

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

describe('checkLevels / resolveLevels', () => {
  it('정상', () => {
    expect(checkLevels([{ name: 'A', minDays: 0 }, { name: 'B', minDays: 10 }]).ok).toBe(true)
  })
  it('첫 레벨이 0일이 아니면 안 됨', () => {
    expect(checkLevels([{ name: 'A', minDays: 3 }]).ok).toBe(false)
  })
  it('일수가 커지지 않으면 안 됨', () => {
    expect(checkLevels([{ name: 'A', minDays: 0 }, { name: 'B', minDays: 0 }]).ok).toBe(false)
  })
  it('이름이 비면 안 됨', () => {
    expect(checkLevels([{ name: ' ', minDays: 0 }]).ok).toBe(false)
  })
  it('저장값이 이상하면 기본 레벨', () => {
    expect(resolveLevels(undefined)).toBe(LEVELS)
    expect(resolveLevels([{ name: 'X', minDays: 5 }])).toBe(LEVELS)
    expect(resolveLevels([{ name: 'X', minDays: 0 }, { name: 'Y', minDays: 7 }]).map((l) => l.name)).toEqual(['X', 'Y'])
  })
  it('커스텀 레벨로 판정', () => {
    expect(levelFor(8, [{ name: 'X', minDays: 0 }, { name: 'Y', minDays: 7 }]).level.name).toBe('Y')
  })
})
