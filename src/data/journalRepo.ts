import { markRecorded } from './activityRepo'
import { useDoc } from './hooks'
import { asNumber, asString, toDate, type DataStore } from './store'

export const JOURNAL_MAX_LENGTH = 200

export type JournalEntry = { text: string; mood: number | null; updatedAt: Date | null }

/** 특정 날짜의 한 줄 일지 */
export function useJournal(dateKey: string): { entry: JournalEntry | null; loading: boolean } {
  const { data, loading } = useDoc(`journal/${dateKey}`)
  const entry = data
    ? { text: asString(data.text), mood: asNumber(data.mood, 0) || null, updatedAt: toDate(data.updatedAt) }
    : null
  return { entry, loading }
}

/** 일지 저장. 내용이 있으면 오늘을 '기록한 날'로 표시 */
export async function saveJournal(store: DataStore, dateKey: string, text: string, mood: number | null, now: Date) {
  const trimmed = text.trim().slice(0, JOURNAL_MAX_LENGTH)
  await store.set(`journal/${dateKey}`, { text: trimmed, mood, updatedAt: now })
  if (trimmed || mood) await markRecorded(store, now)
}
