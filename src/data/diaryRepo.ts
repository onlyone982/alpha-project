import { useDoc } from './hooks'
import { asString, toDate, type DataStore } from './store'

export function useDiary(dateKey: string): { text: string; updatedAt: Date | null; loading: boolean } {
  const { data, loading } = useDoc(`diary/${dateKey}`)
  return { text: asString(data?.text), updatedAt: toDate(data?.updatedAt), loading }
}

export function saveDiary(store: DataStore, dateKey: string, text: string, now: Date) {
  return store.set(`diary/${dateKey}`, { text, updatedAt: now })
}
