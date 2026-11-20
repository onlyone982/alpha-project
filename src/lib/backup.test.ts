import { describe, expect, it } from 'vitest'
import { toJsonSafe } from './backup'

describe('toJsonSafe', () => {
  it('Date 와 Timestamp 를 ISO 문자열로, 중첩 구조 유지', () => {
    const d = new Date('2026-11-20T00:00:00Z')
    expect(
      toJsonSafe({ a: d, b: [{ at: { toDate: () => d } }], c: 1, n: null }),
    ).toEqual({ a: '2026-11-20T00:00:00.000Z', b: [{ at: '2026-11-20T00:00:00.000Z' }], c: 1, n: null })
  })
})
