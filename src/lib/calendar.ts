import { addDaysToKey } from './date'

/** 'YYYY-MM-DD' 의 요일 (0=일 ... 6=토) */
export function weekdayOfKey(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** 'YYYY-MM' 의 달력 칸. 일요일 시작, 앞뒤는 null 로 채워 7의 배수 */
export function monthGrid(month: string): (string | null)[] {
  const [y, m] = month.split('-').map(Number)
  const first = `${month}-01`
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const cells: (string | null)[] = Array(weekdayOfKey(first)).fill(null)
  for (let i = 0; i < daysInMonth; i++) cells.push(addDaysToKey(first, i))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** 'YYYY-MM' 에 n개월 더하기 */
export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + n, 1))
  return date.toISOString().slice(0, 7)
}

/** 오늘을 포함해 최근 n일 키 (오래된 것부터) */
export function lastNDays(todayKey: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDaysToKey(todayKey, i - n + 1))
}
