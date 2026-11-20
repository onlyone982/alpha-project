import { addDaysToKey, dayKeyDiff } from './date'

/** 나무 성장 단계 (물 준 날 수 기준) */
export const TREE_STAGES = [
  { key: 'seed', name: '씨앗', minDays: 0 },
  { key: 'sprout', name: '새싹', minDays: 1 },
  { key: 'sapling', name: '묘목', minDays: 3 },
  { key: 'small', name: '작은 나무', minDays: 7 },
  { key: 'big', name: '큰 나무', minDays: 14 },
  { key: 'blossom', name: '꽃 핀 나무', minDays: 30 },
] as const

export type TreeStageKey = (typeof TREE_STAGES)[number]['key']

/** 마지막으로 물 준 뒤 이만큼 지나면 시듦 (2일 넘게 안 줌 = 3일째) */
export const WILT_AFTER_DAYS = 3

export type TreeState = {
  stage: (typeof TREE_STAGES)[number]
  wateredDays: number
  wateredToday: boolean
  wilted: boolean
  daysToNext: number | null
}

export function treeState(watered: ReadonlySet<string>, todayKey: string): TreeState {
  const days = [...watered].filter((k) => k <= todayKey).sort()
  const total = days.length
  let stageIndex = 0
  TREE_STAGES.forEach((s, i) => {
    if (total >= s.minDays) stageIndex = i
  })
  const last = days[days.length - 1]
  const sinceLast = last ? dayKeyDiff(last, todayKey) : null
  const next = TREE_STAGES[stageIndex + 1]
  return {
    stage: TREE_STAGES[stageIndex],
    wateredDays: total,
    wateredToday: watered.has(todayKey),
    wilted: sinceLast !== null && sinceLast >= WILT_AFTER_DAYS,
    daysToNext: next ? next.minDays - total : null,
  }
}

export const yesterday = (key: string) => addDaysToKey(key, -1)
