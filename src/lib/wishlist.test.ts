import { describe, expect, it } from 'vitest'
import { summarizeWishlist, type WishItem } from './wishlist'

const item = (id: string, price: number, purchasedAt: Date | null = null): WishItem => ({
  id,
  name: id,
  price,
  url: '',
  purchasedAt,
  createdAt: new Date('2026-11-01T00:00:00Z'),
})

describe('summarizeWishlist', () => {
  it('진행률 = 쓸 수 있는 돈 / 가격 (최대 100%)', () => {
    const s = summarizeWishlist([item('향수', 200000), item('양말', 10000)], 50000)
    expect(s.available).toBe(50000)
    expect(s.pending.map((p) => [p.item.id, p.progress, p.canBuy])).toEqual([
      ['양말', 1, true],
      ['향수', 0.25, false],
    ])
  })

  it('구매한 금액은 쓸 수 있는 돈에서 빠진다', () => {
    const s = summarizeWishlist([item('양말', 10000, new Date('2026-11-03T00:00:00Z')), item('향수', 200000)], 50000)
    expect(s.spent).toBe(10000)
    expect(s.available).toBe(40000)
    expect(s.pending[0].progress).toBe(0.2)
    expect(s.purchased.map((p) => p.id)).toEqual(['양말'])
  })

  it('쓸 수 있는 돈은 음수가 되지 않는다', () => {
    const s = summarizeWishlist([item('향수', 200000, new Date())], 50000)
    expect(s.available).toBe(0)
  })
})
