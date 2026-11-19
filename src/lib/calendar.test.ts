import { describe, expect, it } from 'vitest'
import { addMonths, lastNDays, monthGrid, weekdayOfKey } from './calendar'

describe('calendar', () => {
  it('요일', () => {
    expect(weekdayOfKey('2026-11-01')).toBe(0) // 일요일
    expect(weekdayOfKey('2026-11-20')).toBe(5) // 금요일
  })

  it('2026년 11월: 일요일 시작, 30일, 5주', () => {
    const grid = monthGrid('2026-11')
    expect(grid[0]).toBe('2026-11-01')
    expect(grid.filter(Boolean)).toHaveLength(30)
    expect(grid.length).toBe(35)
  })

  it('2026년 2월: 앞쪽 빈칸', () => {
    const grid = monthGrid('2026-02')
    expect(grid.slice(0, 1)).toEqual(['2026-02-01']) // 2026-02-01 은 일요일
    expect(grid.filter(Boolean)).toHaveLength(28)
    const may = monthGrid('2026-05') // 5/1 금요일
    expect(may.slice(0, 6)).toEqual([null, null, null, null, null, '2026-05-01'])
  })

  it('addMonths', () => {
    expect(addMonths('2026-11', 1)).toBe('2026-12')
    expect(addMonths('2026-12', 1)).toBe('2027-01')
    expect(addMonths('2026-01', -1)).toBe('2025-12')
  })

  it('lastNDays', () => {
    expect(lastNDays('2026-11-20', 3)).toEqual(['2026-11-18', '2026-11-19', '2026-11-20'])
  })
})
