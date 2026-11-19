import { describe, expect, it } from 'vitest'
import { formatDuration, formatMinutes, formatWon } from './format'

describe('format', () => {
  it('formatWon', () => {
    expect(formatWon(22500)).toBe('22,500원')
    expect(formatWon(0)).toBe('0원')
  })

  it('formatMinutes', () => {
    expect(formatMinutes(45)).toBe('45분')
    expect(formatMinutes(200)).toBe('3시간 20분')
    expect(formatMinutes(120)).toBe('2시간')
    expect(formatMinutes(1500)).toBe('1일 1시간')
  })

  it('formatDuration', () => {
    expect(formatDuration(7 * 60_000)).toBe('7분')
    expect(formatDuration((5 * 60 + 12) * 60_000)).toBe('5시간 12분')
    expect(formatDuration((3 * 24 + 4) * 3_600_000 + 999)).toBe('3일 4시간')
  })
})
