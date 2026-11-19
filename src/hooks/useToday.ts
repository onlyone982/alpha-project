import { toDayKey } from '../lib/date'
import { useNow } from './useNow'

/** 서울 기준 오늘 날짜 키. 자정이 지나면 1분 안에 바뀝니다. */
export function useToday(): string {
  return toDayKey(useNow(60_000))
}
