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
