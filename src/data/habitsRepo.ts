import { useEffect, useMemo, useState } from 'react'
import type { Habit, Relapse } from '../lib/habits'
import { useStore } from './DataStoreContext'
import { useCollection } from './hooks'
import { asBool, asNumber, asString, toDate, type DataStore, type StoredDoc } from './store'

const EPOCH = new Date(0)

export function parseHabit(doc: StoredDoc): Habit {
  return {
    id: doc.id,
    name: asString(doc.name, '이름 없음'),
    emoji: asString(doc.emoji, '🚫'),
    startAt: toDate(doc.startAt) ?? EPOCH,
    dailyCost: asNumber(doc.dailyCost),
    dailyMinutes: asNumber(doc.dailyMinutes),
    reason: asString(doc.reason),
    isSensitive: asBool(doc.isSensitive),
    archived: asBool(doc.archived),
    createdAt: toDate(doc.createdAt) ?? EPOCH,
  }
}

export function parseRelapse(doc: StoredDoc): Relapse {
  return { id: doc.id, at: toDate(doc.at) ?? EPOCH, note: asString(doc.note) }
}

/** 모든 끊기 항목 (보관 포함), 만든 순서대로 */
export function useHabits(): { habits: Habit[]; loading: boolean } {
  const { docs, loading } = useCollection('habits')
  const habits = useMemo(
    () => docs.map(parseHabit).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [docs],
  )
  return { habits, loading }
}

/** 여러 항목의 실패 기록을 한 번에 구독. { [habitId]: Relapse[] (최근 순) } */
export function useRelapses(habitIds: readonly string[]): Record<string, Relapse[]> {
  const store = useStore()
  const key = habitIds.join(',')
  const [state, setState] = useState<{ store: DataStore | null; key: string; map: Record<string, Relapse[]> }>({
    store: null,
    key: '',
    map: {},
  })

  useEffect(() => {
    if (!store || !key) return
    const ids = key.split(',')
    const offs = ids.map((id) =>
      store.subscribeCollection(`habits/${id}/relapses`, (docs) => {
        const relapses = docs.map(parseRelapse).sort((a, b) => b.at.getTime() - a.at.getTime())
        setState((prev) => {
          const base = prev.store === store && prev.key === key ? prev.map : {}
          return { store, key, map: { ...base, [id]: relapses } }
        })
      }),
    )
    return () => offs.forEach((off) => off())
  }, [store, key])

  return state.store === store && state.key === key ? state.map : EMPTY_MAP
}

const EMPTY_MAP: Record<string, Relapse[]> = {}

export type HabitInput = Omit<Habit, 'id' | 'archived' | 'createdAt'>

export function addHabit(store: DataStore, input: HabitInput): Promise<string> {
  return store.add('habits', { ...input, archived: false, createdAt: new Date() })
}

export function updateHabit(store: DataStore, id: string, input: Partial<HabitInput & { archived: boolean }>) {
  return store.update(`habits/${id}`, input)
}

export function addRelapse(store: DataStore, habitId: string, at: Date, note: string) {
  return store.add(`habits/${habitId}/relapses`, { at, note })
}

export function removeRelapse(store: DataStore, habitId: string, relapseId: string) {
  return store.remove(`habits/${habitId}/relapses/${relapseId}`)
}
