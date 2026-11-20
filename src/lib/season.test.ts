import { describe, expect, it } from 'vitest'
import { nextSeason, seasonFor, seasonTheme } from './season'

describe('seasonFor', () => {
  it.each([
    ['2026-11-20', '2026-winter', '2026-10-01', '2026-12-31'],
    ['2026-10-01', '2026-winter', '2026-10-01', '2026-12-31'],
    ['2027-01-01', '2027-spring', '2027-01-01', '2027-03-31'],
    ['2028-02-29', '2028-spring', '2028-01-01', '2028-03-31'],
    ['2027-05-10', '2027-summer', '2027-04-01', '2027-06-30'],
    ['2027-09-30', '2027-fall', '2027-07-01', '2027-09-30'],
  ])('%s → %s (%s ~ %s)', (day, id, start, end) => {
    expect(seasonFor(day)).toMatchObject({ id, start, end })
  })

  it('Winter Arc 이름과 이모지', () => {
    expect(seasonFor('2026-11-20')).toMatchObject({ name: 'Winter Arc', emoji: '❄️' })
  })
})

describe('nextSeason', () => {
  it('Winter → 다음 해 Spring, Fall → Winter', () => {
    expect(nextSeason(seasonFor('2026-11-20')).id).toBe('2027-spring')
    expect(nextSeason(seasonFor('2027-08-01')).id).toBe('2027-winter')
  })
})

describe('seasonTheme', () => {
  const winter = seasonFor('2026-11-20')
  it('저장된 주제 우선, 없거나 비면 기본 주제', () => {
    expect(seasonTheme(winter, { '2026-winter': '도파민 끊는 겨울' })).toBe('도파민 끊는 겨울')
    expect(seasonTheme(winter, { '2026-winter': '  ' })).toBe('조용히 강해지는 시즌')
    expect(seasonTheme(winter, undefined)).toBe('조용히 강해지는 시즌')
  })
})
