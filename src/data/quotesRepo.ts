import { useMemo } from 'react'
import { SEED_QUOTES, type Quote } from '../content/quotes'
import { pickDaily } from '../lib/daily'
import { useCollection } from './hooks'
import { asString, toDate, type DataStore, type StoredDoc } from './store'

export type UserQuote = Quote & { id: string; createdAt: Date }

export function parseQuote(doc: StoredDoc): UserQuote {
  return {
    id: doc.id,
    text: asString(doc.text),
    author: asString(doc.author),
    createdAt: toDate(doc.createdAt) ?? new Date(0),
  }
}

/** 내가 추가한 명언 (최근 순) */
export function useUserQuotes(): { quotes: UserQuote[]; loading: boolean } {
  const { docs, loading } = useCollection('quotes')
  const quotes = useMemo(
    () => docs.map(parseQuote).filter((q) => q.text).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [docs],
  )
  return { quotes, loading }
}

/** 오늘의 명언: 시드 + 내 명언 중 하루 1개 고정 */
export function useDailyQuote(dayKey: string): Quote | null {
  const { quotes, loading } = useUserQuotes()
  return useMemo(() => {
    if (loading) return null
    // 시드 다음에 내 명언을 오래된 순으로 붙여서, 새 명언을 추가해도 기존 날짜의 결과가 크게 흔들리지 않게
    const pool: Quote[] = [...SEED_QUOTES, ...[...quotes].reverse()]
    return pickDaily(pool, dayKey, 'quote')
  }, [quotes, loading, dayKey])
}

export function addQuote(store: DataStore, text: string, author: string) {
  return store.add('quotes', { text, author, createdAt: new Date() })
}

export function removeQuote(store: DataStore, id: string) {
  return store.remove(`quotes/${id}`)
}

export function updateMotto(store: DataStore, motto: string) {
  return store.update('', { motto })
}
