import { DAY_MS } from './date'

/** 22500 → '22,500원' */
export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

/** 200 → '3시간 20분', 1500 → '1일 1시간' */
export function formatMinutes(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  if (days > 0) return hours > 0 ? `${days}일 ${hours}시간` : `${days}일`
  if (hours > 0) return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
  return `${mins}분`
}

/** 경과 ms → '3일 4시간' / '5시간 12분' / '7분' */
export function formatDuration(ms: number): string {
  const safe = Math.max(0, ms)
  const days = Math.floor(safe / DAY_MS)
  const hours = Math.floor((safe % DAY_MS) / 3_600_000)
  const minutes = Math.floor((safe % 3_600_000) / 60_000)
  if (days > 0) return `${days}일 ${hours}시간`
  if (hours > 0) return `${hours}시간 ${minutes}분`
  return `${minutes}분`
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
