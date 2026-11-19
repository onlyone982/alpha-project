import { useMemo } from 'react'
import { useCollection } from './hooks'
import { asString, toDate, type DataStore } from './store'

export type SosResult = 'resisted' | 'relapsed'

export function addSosEvent(store: DataStore, habitId: string | null, result: SosResult) {
  return store.add('sosEvents', { habitId, at: new Date(), result })
}

/** SOS 에서 버틴 횟수 (배지 집계용) */
export function useSosWins(): number {
  const { docs } = useCollection('sosEvents')
  return useMemo(() => docs.filter((d) => asString(d.result) === 'resisted' && toDate(d.at)).length, [docs])
}
