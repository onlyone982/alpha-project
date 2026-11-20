import { LEVELS, type Level } from '../content/levels'
import { addDaysToKey, DAY_MS, toDayKey } from './date'

/** 달성 소식으로 알려줄 일수 */
export const MILESTONES = [1, 3, 7, 14, 30, 50, 100, 200, 365]

export type Achievement = { key: string; text: string; dayKey: string; sensitive: boolean }

export type AchievementInput = {
  todayKey: string
  habits: readonly {
    id: string
    name: string
    emoji: string
    isSensitive: boolean
    /** 마지막 실패(없으면 시작) 시각 */
    since: Date
    currentStreakDays: number
  }[]
  recordStreak: { current: number; todayRecorded: boolean }
  /** 설정에서 바꾼 레벨 (없으면 기본) */
  levels?: readonly Level[]
}

/**
 * 최근 달성 소식 (최근 7일, 최신 순).
 * - 끊기: 현재 연속에서 지나온 가장 높은 단계 (예: 금주 30일 달성)
 * - 기록 스트릭: 지나온 가장 높은 단계
 * - 레벨: 지금 레벨에 오른 날 (첫 레벨 제외)
 */
export function recentAchievements(input: AchievementInput, withinDays = 7): Achievement[] {
  const list: Achievement[] = []
  const top = (days: number) => [...MILESTONES].reverse().find((m) => m <= days)

  for (const h of input.habits) {
    const m = top(h.currentStreakDays)
    if (!m) continue
    list.push({
      key: `quit:${h.id}:${m}`,
      text: `${h.emoji} ${h.name} ${m}일 달성!`,
      dayKey: toDayKey(new Date(h.since.getTime() + m * DAY_MS)),
      sensitive: h.isSensitive,
    })
  }

  // 연속 기록 마지막 날 (오늘 기록 안 했으면 어제)
  const { current, todayRecorded } = input.recordStreak
  const lastKey = todayRecorded ? input.todayKey : addDaysToKey(input.todayKey, -1)
  const dayOfStreak = (n: number) => addDaysToKey(lastKey, n - current)

  const m = top(current)
  if (m) list.push({ key: `streak:${m}`, text: `🔥 ${m}일 연속 기록 달성!`, dayKey: dayOfStreak(m), sensitive: false })

  const level = [...(input.levels ?? LEVELS)].reverse().find((l) => l.minDays > 0 && l.minDays <= current)
  if (level) {
    list.push({ key: `level:${level.name}`, text: `⬆️ LV: ${level.name} 달성!`, dayKey: dayOfStreak(level.minDays), sensitive: false })
  }

  const oldest = addDaysToKey(input.todayKey, -(withinDays - 1))
  return list.filter((a) => a.dayKey >= oldest && a.dayKey <= input.todayKey).sort((a, b) => b.dayKey.localeCompare(a.dayKey))
}
