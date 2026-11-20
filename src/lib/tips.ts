import type { HabitTip, TipSlot } from '../content/habitTips'
import { hashString } from './daily'

/** 시각(0~23시) → 시간대. 새벽 0~4시는 저녁 시간대로 */
export function slotForHour(hour: number): TipSlot {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'lunch'
  return 'evening'
}

/** 이 시간대 추천을 이미 봤는지 확인할 키. 새벽 0~4시는 전날 저녁으로 묶음 */
export function slotKey(dayKey: string, hour: number, previousDayKey: string): string {
  const slot = slotForHour(hour)
  return `${hour < 5 ? previousDayKey : dayKey}:${slot}`
}

/**
 * 이 시간대에 보여줄 추천 순서.
 * - 숨긴 것(관심 없음)과 이미 받아들인 것은 빼고
 * - 내 끊기 항목과 관련된 추천을 맨 앞에
 * - 나머지는 날짜마다 다르게 섞되, 같은 날·같은 시간대에는 항상 같은 순서
 */
export function tipQueue(
  tips: readonly HabitTip[],
  slot: TipSlot,
  seed: string,
  exclude: ReadonlySet<string>,
  habitNames: readonly string[],
): HabitTip[] {
  const pool = tips.filter((t) => t.slot === slot && !exclude.has(t.id))
  const related = (t: HabitTip) => !!t.habit && habitNames.some((name) => name.includes(t.habit!))
  const score = (t: HabitTip) => hashString(`${seed}:${t.id}`)
  return [...pool].sort((a, b) => Number(related(b)) - Number(related(a)) || score(a) - score(b))
}
