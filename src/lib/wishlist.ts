export type WishItem = {
  id: string
  name: string
  price: number
  url: string
  /** 구매 완료한 시각. 아직이면 null */
  purchasedAt: Date | null
  createdAt: Date
}

export type WishProgress = {
  item: WishItem
  /** 0 ~ 1 */
  progress: number
  canBuy: boolean
}

export type WishlistSummary = {
  /** 쓸 수 있는 아낀 돈 = 전체 아낀 돈 - 이미 구매한 위시 가격 합 */
  available: number
  spent: number
  /** 아직 안 산 것들, 진행률 높은 순 */
  pending: WishProgress[]
  /** 구매 완료, 최근 순 */
  purchased: WishItem[]
}

export function summarizeWishlist(items: readonly WishItem[], totalSaved: number): WishlistSummary {
  const purchased = items
    .filter((item) => item.purchasedAt)
    .sort((a, b) => b.purchasedAt!.getTime() - a.purchasedAt!.getTime())
  const spent = purchased.reduce((sum, item) => sum + Math.max(0, item.price), 0)
  const available = Math.max(0, totalSaved - spent)

  const pending = items
    .filter((item) => !item.purchasedAt)
    .map((item) => {
      const price = Math.max(0, item.price)
      const progress = price === 0 ? 1 : Math.min(1, available / price)
      return { item, progress, canBuy: progress >= 1 }
    })
    .sort((a, b) => b.progress - a.progress || a.item.createdAt.getTime() - b.item.createdAt.getTime())

  return { available, spent, pending, purchased }
}
