import { useMemo } from 'react'
import type { BadgeStatus } from '../lib/badges'
import { useCollection } from './hooks'
import { asBool, asString, toDate, type DataStore } from './store'

export type EarnedBadge = { key: string; defId: string; habitId: string | null; earnedAt: Date; seen: boolean }

/** 받은 배지 { key → 정보 } */
export function useEarnedBadges(): { earned: Map<string, EarnedBadge>; loading: boolean } {
  const { docs, loading } = useCollection('badges')
  const earned = useMemo(
    () =>
      new Map(
        docs.map((d) => [
          d.id,
          {
            key: d.id,
            defId: asString(d.defId),
            habitId: asString(d.habitId) || null,
            earnedAt: toDate(d.earnedAt) ?? new Date(0),
            seen: asBool(d.seen),
          },
        ]),
      ),
    [docs],
  )
  return { earned, loading }
}

/** 새 배지 저장. 한 번 받은 배지는 지우지 않습니다. */
export function awardBadges(store: DataStore, statuses: readonly BadgeStatus[], now: Date) {
  return Promise.all(
    statuses.map((s) =>
      store.set(`badges/${s.key}`, { defId: s.def.id, habitId: s.habit?.id ?? null, earnedAt: now, seen: false }),
    ),
  )
}

/** 축하 화면을 보여줬음 */
export function markBadgesSeen(store: DataStore, keys: readonly string[]) {
  return Promise.all(keys.map((key) => store.update(`badges/${key}`, { seen: true })))
}
