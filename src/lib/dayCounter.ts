import { DAY_MS, dayKeyDiff, toDayKey } from './date'

/** 시작한 날(서울 기준)을 DAY 1 로 보고 오늘이 며칠째인지. 시작 전이면 0 */
export function dayNumber(startAt: Date, now: Date): number {
  if (now < startAt) return 0
  return dayKeyDiff(toDayKey(startAt), toDayKey(now)) + 1
}

export type ElapsedParts = { days: number; hours: number; minutes: number; seconds: number }

/** 경과 시간을 일/시/분/초로 나눔. 음수면 0 */
export function elapsedParts(from: Date, to: Date): ElapsedParts {
  const ms = Math.max(0, to.getTime() - from.getTime())
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(ms / DAY_MS),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  }
}
