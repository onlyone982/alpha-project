import { addDaysToKey } from './date'
import { weekdayOfKey } from './calendar'

/** 이번 주(월~일) 날짜 키 */
export function weekDays(todayKey: string): string[] {
  const mondayOffset = (weekdayOfKey(todayKey) + 6) % 7
  const monday = addDaysToKey(todayKey, -mondayOffset)
  return Array.from({ length: 7 }, (_, i) => addDaysToKey(monday, i))
}

export type WeekSummary = {
  /** 이번 주 지나온 날 수 (월요일 ~ 오늘) */
  daysSoFar: number
  recordedDays: number
  todoDone: number
  todoTotal: number
  /** 이번 주 끊기 실패 횟수 */
  relapses: number
}

export function summarizeWeek(input: {
  todayKey: string
  recordedDays: ReadonlySet<string>
  /** 이번 주 할일 (날짜 상관없이 모아서) */
  todos: readonly { date: string; done: boolean }[]
  /** 끊기 실패 기록 날짜 키들 */
  relapseDays: readonly string[]
}): WeekSummary {
  const days = weekDays(input.todayKey)
  const soFar = days.filter((d) => d <= input.todayKey)
  const inWeek = new Set(days)
  const todos = input.todos.filter((t) => inWeek.has(t.date))
  return {
    daysSoFar: soFar.length,
    recordedDays: soFar.filter((d) => input.recordedDays.has(d)).length,
    todoDone: todos.filter((t) => t.done).length,
    todoTotal: todos.length,
    relapses: input.relapseDays.filter((d) => inWeek.has(d)).length,
  }
}
