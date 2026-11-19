import { formatInTimeZone } from 'date-fns-tz'

/** 앱의 모든 "하루" 경계는 서울 기준 자정입니다. */
export const APP_TIME_ZONE = 'Asia/Seoul'

/** 서울 기준 날짜 키 (YYYY-MM-DD). 일지 문서 id, 할일 날짜 등에 사용합니다. */
export function toDayKey(date: Date): string {
  return formatInTimeZone(date, APP_TIME_ZONE, 'yyyy-MM-dd')
}

/** 서울 기준으로 포맷합니다. 패턴은 date-fns 형식을 따릅니다. */
export function formatSeoul(date: Date, pattern: string): string {
  return formatInTimeZone(date, APP_TIME_ZONE, pattern)
}

const DAY_MS = 24 * 60 * 60 * 1000
export { DAY_MS }

/** 'YYYY-MM-DD' 두 개 사이의 일수 차이 (to - from) */
export function dayKeyDiff(fromKey: string, toKey: string): number {
  return Math.round((keyToUtc(toKey) - keyToUtc(fromKey)) / DAY_MS)
}

/** 'YYYY-MM-DD' 에 n일을 더한 날짜 키 */
export function addDaysToKey(key: string, days: number): string {
  return new Date(keyToUtc(key) + days * DAY_MS).toISOString().slice(0, 10)
}

function keyToUtc(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

/**
 * <input type="datetime-local"> 값('YYYY-MM-DDTHH:mm')을 서울 시각으로 해석해 Date 로.
 * 한국은 서머타임이 없어 항상 +09:00 입니다.
 */
export function fromSeoulInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const date = new Date(`${value}:00+09:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Date → <input type="datetime-local"> 값 (서울 시각) */
export function toSeoulInput(date: Date): string {
  return formatSeoul(date, "yyyy-MM-dd'T'HH:mm")
}
