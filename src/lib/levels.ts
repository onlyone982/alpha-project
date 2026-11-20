import { LEVELS, type Level } from '../content/levels'

export type LevelInfo = {
  level: Level
  /** LEVELS 안에서의 순서 (0 = 첫 레벨). 화면에는 안 보이고 레벨업 판단에만 씀 */
  index: number
  next: Level | null
  daysToNext: number | null
}

/** 연속 기록일 → 레벨 */
export function levelFor(streakDays: number, levels: readonly Level[] = LEVELS): LevelInfo {
  const days = Math.max(0, streakDays)
  let index = 0
  for (let i = 0; i < levels.length; i++) if (days >= levels[i].minDays) index = i
  const next = levels[index + 1] ?? null
  return { level: levels[index], index, next, daysToNext: next ? next.minDays - days : null }
}
