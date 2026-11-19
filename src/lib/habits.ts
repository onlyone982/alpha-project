import { addDaysToKey, DAY_MS, dayKeyDiff, toDayKey } from './date'

/** 끊기 항목 */
export type Habit = {
  id: string
  name: string
  emoji: string
  startAt: Date
  /** 하루 평균 비용 (원) */
  dailyCost: number
  /** 하루 평균 소요 시간 (분) */
  dailyMinutes: number
  /** 내가 끊는 이유 (SOS 화면에 표시) */
  reason: string
  /** 민감 항목: 프라이버시 모드에서 블러 */
  isSensitive: boolean
  archived: boolean
  createdAt: Date
}

/** 실패 기록 */
export type Relapse = {
  id: string
  at: Date
  note: string
}

export type HabitStats = {
  /** 마지막 실패(없으면 시작) 이후 경과 ms */
  currentStreakMs: number
  /** 현재 연속을 "N일차"로 표시할 때의 N (첫 24시간이 1일차) */
  currentDayNumber: number
  /** 현재 연속에서 꽉 채운 일수 (배지 기준) */
  currentStreakDays: number
  /** 지금까지 가장 길게 버틴 기간 ms (현재 연속 포함) */
  longestStreakMs: number
  longestStreakDays: number
  /** 최장 기록을 "N일차" 단위로 (현재 연속의 currentDayNumber 와 같은 기준) */
  longestDayNumber: number
  /**
   * 누적 성공 일수: 시작한 날부터 어제까지(서울 기준) 중 실패가 없었던 날의 수.
   * 오늘은 아직 안 끝났으므로 내일부터 더해집니다.
   */
  cleanDays: number
  /** 시도 횟수 = 실패 횟수 + 1 */
  attempts: number
  /** 아낀 돈 = 누적 성공 일수 × 하루 평균 비용 */
  savedMoney: number
  /** 아낀 시간(분) = 누적 성공 일수 × 하루 평균 소요 시간 */
  savedMinutes: number
}

/** 시작 이후 ~ 지금 이전의 실패만, 시간 순으로 */
function validRelapses(habit: Habit, relapses: readonly Relapse[], now: Date): Relapse[] {
  return relapses
    .filter((r) => r.at >= habit.startAt && r.at <= now)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
}

export function computeHabitStats(habit: Habit, relapses: readonly Relapse[], now: Date): HabitStats {
  const sorted = validRelapses(habit, relapses, now)
  const lastPoint = sorted.length ? sorted[sorted.length - 1].at : habit.startAt
  const currentStreakMs = Math.max(0, now.getTime() - lastPoint.getTime())

  // 시작 → 실패1 → 실패2 → ... → 지금 구간 중 가장 긴 것
  const points = [habit.startAt, ...sorted.map((r) => r.at), now]
  let longestStreakMs = 0
  for (let i = 1; i < points.length; i++) {
    longestStreakMs = Math.max(longestStreakMs, points[i].getTime() - points[i - 1].getTime())
  }

  const cleanDays = countCleanDays(habit.startAt, sorted, now)

  return {
    currentStreakMs,
    currentDayNumber: Math.floor(currentStreakMs / DAY_MS) + 1,
    currentStreakDays: Math.floor(currentStreakMs / DAY_MS),
    longestStreakMs,
    longestStreakDays: Math.floor(longestStreakMs / DAY_MS),
    longestDayNumber: Math.floor(longestStreakMs / DAY_MS) + 1,
    cleanDays,
    attempts: sorted.length + 1,
    savedMoney: cleanDays * Math.max(0, habit.dailyCost),
    savedMinutes: cleanDays * Math.max(0, habit.dailyMinutes),
  }
}

function countCleanDays(startAt: Date, sortedRelapses: readonly Relapse[], now: Date): number {
  if (now < startAt) return 0
  const startKey = toDayKey(startAt)
  const yesterdayKey = addDaysToKey(toDayKey(now), -1)
  const completedDays = dayKeyDiff(startKey, yesterdayKey) + 1
  if (completedDays <= 0) return 0

  const relapseDays = new Set(
    sortedRelapses.map((r) => toDayKey(r.at)).filter((key) => key >= startKey && key <= yesterdayKey),
  )
  return completedDays - relapseDays.size
}

export type RelapseCheck = { ok: true } | { ok: false; reason: string }

/** 실패 기록 시각이 올바른지 */
export function checkRelapseTime(habit: Habit, at: Date, now: Date): RelapseCheck {
  if (at < habit.startAt) return { ok: false, reason: '시작하기 전 시각은 기록할 수 없어요.' }
  if (at.getTime() > now.getTime() + 60_000) return { ok: false, reason: '미래 시각은 기록할 수 없어요.' }
  return { ok: true }
}

/** 여러 항목의 아낀 돈/시간 합계 */
export function sumSavings(stats: readonly HabitStats[]): { money: number; minutes: number } {
  return stats.reduce(
    (acc, s) => ({ money: acc.money + s.savedMoney, minutes: acc.minutes + s.savedMinutes }),
    { money: 0, minutes: 0 },
  )
}
