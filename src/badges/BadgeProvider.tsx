import { useEffect, useRef, type ReactNode } from 'react'
import { useStore } from '../data/DataStoreContext'
import { awardBadges } from '../data/badgesRepo'
import { useBadgeStatus } from '../data/useBadgeStatus'
import { newlyEarned } from '../lib/badges'
import { BadgeContext } from './BadgeContext'

/**
 * 배지 판정기 + 상태 공유.
 * 데이터가 바뀔 때(기록 저장 등)와 1분마다 판정해서 새 배지를 저장합니다.
 * 데이터가 하나라도 덜 불러와졌으면 판정하지 않습니다. (잘못된 배지 방지)
 */
export function BadgeProvider({ children }: { children: ReactNode }) {
  const store = useStore()
  const state = useBadgeStatus()
  const { loading, statuses, earned } = state
  const pending = useRef(new Set<string>())

  useEffect(() => {
    if (!store || loading) return
    const fresh = newlyEarned(statuses, new Set(earned.keys())).filter((s) => !pending.current.has(s.key))
    if (fresh.length === 0) return
    fresh.forEach((s) => pending.current.add(s.key))
    awardBadges(store, fresh, new Date()).catch((error) => {
      console.error('배지를 저장하지 못했어요', error)
      fresh.forEach((s) => pending.current.delete(s.key))
    })
  }, [store, loading, statuses, earned])

  return <BadgeContext.Provider value={state}>{children}</BadgeContext.Provider>
}
