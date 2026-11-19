import { useMemo } from 'react'
import { toDayKey } from '../lib/date'
import { computeStreak, type StreakResult } from '../lib/streak'
import { useCollection } from './hooks'
import type { DataStore } from './store'

/**
 * '기록한 날' 표시. (서울 기준 오늘)
 * 기록한 날의 조건: 한 줄 일지 작성 / 할일 1개 이상 완료 / 착장 기록 / 운동 기록
 * → 각 기능에서 저장할 때 이 함수를 부릅니다. 한 번 표시된 날은 지우지 않습니다.
 */
export function markRecorded(store: DataStore, now: Date) {
  return store.set(`activityDays/${toDayKey(now)}`, { recorded: true, lastAt: now })
}

/** 기록한 날 목록 */
export function useRecordedDays(): { days: Set<string>; loading: boolean } {
  const { docs, loading } = useCollection('activityDays')
  const days = useMemo(() => new Set(docs.filter((d) => d.recorded === true).map((d) => d.id)), [docs])
  return { days, loading }
}

/** 기록 스트릭 (오늘 기준) */
export function useStreak(todayKey: string): StreakResult & { recordedDays: Set<string>; loading: boolean } {
  const { days, loading } = useRecordedDays()
  return useMemo(() => ({ ...computeStreak(days, todayKey), recordedDays: days, loading }), [days, todayKey, loading])
}
