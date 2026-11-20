import { createContext, useContext } from 'react'
import type { BadgeState } from '../data/useBadgeStatus'

export const BadgeContext = createContext<BadgeState>({ loading: true, statuses: [], earned: new Map() })

/** 배지 상태 (BadgeProvider 가 한 번만 계산해서 나눠줌) */
export function useBadges(): BadgeState {
  return useContext(BadgeContext)
}
