import { useMemo } from 'react'
import type { WishItem } from '../lib/wishlist'
import { useCollection } from './hooks'
import { asNumber, asString, toDate, type DataStore, type StoredDoc } from './store'

export function parseWish(doc: StoredDoc): WishItem {
  return {
    id: doc.id,
    name: asString(doc.name, '이름 없음'),
    price: asNumber(doc.price),
    url: asString(doc.url),
    purchasedAt: toDate(doc.purchasedAt),
    createdAt: toDate(doc.createdAt) ?? new Date(0),
  }
}

export function useWishlist(): { items: WishItem[]; loading: boolean } {
  const { docs, loading } = useCollection('wishlist')
  const items = useMemo(() => docs.map(parseWish), [docs])
  return { items, loading }
}

export function addWish(store: DataStore, input: { name: string; price: number; url: string }) {
  return store.add('wishlist', { ...input, purchasedAt: null, createdAt: new Date() })
}

export function setWishPurchased(store: DataStore, id: string, purchasedAt: Date | null) {
  return store.update(`wishlist/${id}`, { purchasedAt })
}

export function removeWish(store: DataStore, id: string) {
  return store.remove(`wishlist/${id}`)
}
