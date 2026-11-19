import { describe, expect, it } from 'vitest'
import { formatSeoul, toDayKey } from './date'

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
