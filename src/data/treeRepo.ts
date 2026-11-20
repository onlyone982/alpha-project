import { useMemo } from 'react'
import { toDayKey } from '../lib/date'
import { useCollection } from './hooks'
import type { DataStore } from './store'

/** 물 준 날 목록 */
export function useWateredDays(): { days: Set<string>; loading: boolean } {
  const { docs, loading } = useCollection('treeWaterings')
  const days = useMemo(() => new Set(docs.map((d) => d.id)), [docs])
  return { days, loading }
}

/** 오늘 물 주기 (하루 1번) */
export function waterTree(store: DataStore, now: Date) {
  return store.set(`treeWaterings/${toDayKey(now)}`, { at: now })
}
