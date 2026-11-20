/**
 * 스톱워치·타이머 상태. 시작 시각을 저장해두고 매번 "지금 - 시작"으로 계산하므로
 * 새로고침하거나 탭을 오래 비워도 시간이 정확합니다.
 */
export type StopwatchState = {
  /** 멈춰 있을 때까지 쌓인 시간 */
  accumulatedMs: number
  /** 달리는 중이면 시작 시각(ms), 멈췄으면 null */
  runningSince: number | null
  laps: number[]
}

export type CountdownState = {
  durationMs: number
  /** 남은 시간 (멈춘 시점 기준) */
  remainingMs: number
  /** 달리는 중이면 이번에 다시 시작한 시각 */
  runningSince: number | null
}

export const newStopwatch = (): StopwatchState => ({ accumulatedMs: 0, runningSince: null, laps: [] })

export function stopwatchElapsed(s: StopwatchState, now: number): number {
  return s.accumulatedMs + (s.runningSince !== null ? Math.max(0, now - s.runningSince) : 0)
}

export const startStopwatch = (s: StopwatchState, now: number): StopwatchState =>
  s.runningSince !== null ? s : { ...s, runningSince: now }

export const pauseStopwatch = (s: StopwatchState, now: number): StopwatchState =>
  s.runningSince === null ? s : { ...s, accumulatedMs: stopwatchElapsed(s, now), runningSince: null }

export const lapStopwatch = (s: StopwatchState, now: number): StopwatchState => ({ ...s, laps: [stopwatchElapsed(s, now), ...s.laps] })

export const newCountdown = (durationMs: number): CountdownState => ({ durationMs, remainingMs: durationMs, runningSince: null })

export function countdownRemaining(s: CountdownState, now: number): number {
  return Math.max(0, s.remainingMs - (s.runningSince !== null ? Math.max(0, now - s.runningSince) : 0))
}

export const startCountdown = (s: CountdownState, now: number): CountdownState =>
  s.runningSince !== null || s.remainingMs <= 0 ? s : { ...s, runningSince: now }

export const pauseCountdown = (s: CountdownState, now: number): CountdownState =>
  s.runningSince === null ? s : { ...s, remainingMs: countdownRemaining(s, now), runningSince: null }

/** 화면 표시: 시간이 있으면 H:MM:SS, 없으면 MM:SS. withTenths 면 .1초 단위 */
export function formatClock(ms: number, withTenths = false): string {
  const total = Math.max(0, ms)
  const tenths = Math.floor((total % 1000) / 100)
  const seconds = Math.floor(total / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
  return withTenths ? `${main}.${tenths}` : main
}

/** 카운트다운 표시는 남은 초를 올림 (1.2초 남음 → 00:02) */
export const formatCountdown = (ms: number) => formatClock(Math.ceil(Math.max(0, ms) / 1000) * 1000)
