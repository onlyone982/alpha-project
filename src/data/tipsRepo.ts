import { useMemo } from 'react'
import { useDoc } from './hooks'
import type { DataStore } from './store'

const PATH = 'meta/tips'

export type TipState = {
  /** 이미 추천을 보여준 시간대 { '2026-11-20:morning': true } */
  seen: Record<string, boolean>
  /** '관심 없음' 누른 추천 */
  hidden: string[]
  /** '좋아요' 누른 추천 (다시 추천 안 함) */
  accepted: string[]
}

export function useTipState(): { state: TipState; loading: boolean } {
  const { data, loading } = useDoc(PATH)
  const state = useMemo<TipState>(
    () => ({
      seen: (data?.seen as Record<string, boolean>) ?? {},
      hidden: Array.isArray(data?.hidden) ? (data.hidden as string[]) : [],
      accepted: Array.isArray(data?.accepted) ? (data.accepted as string[]) : [],
    }),
    [data],
  )
  return { state, loading }
}

export const markTipSlotSeen = (store: DataStore, key: string) => store.set(PATH, { seen: { [key]: true } })

export const hideTip = (store: DataStore, state: TipState, id: string) =>
  store.set(PATH, { hidden: [...new Set([...state.hidden, id])] })

export const acceptTip = (store: DataStore, state: TipState, id: string) =>
  store.set(PATH, { accepted: [...new Set([...state.accepted, id])] })
