import { describe, expect, it } from 'vitest'
import {
  countdownRemaining,
  formatClock,
  formatCountdown,
  lapStopwatch,
  newCountdown,
  newStopwatch,
  pauseCountdown,
  pauseStopwatch,
  startCountdown,
  startStopwatch,
  stopwatchElapsed,
} from './timer'

describe('스톱워치', () => {
  it('시작 → 멈춤 → 다시 시작해도 시간이 이어진다', () => {
    let s = startStopwatch(newStopwatch(), 1000)
    expect(stopwatchElapsed(s, 4000)).toBe(3000)
    s = pauseStopwatch(s, 4000)
    expect(stopwatchElapsed(s, 99_000)).toBe(3000)
    s = startStopwatch(s, 10_000)
    expect(stopwatchElapsed(s, 12_500)).toBe(5500)
  })

  it('랩은 최신이 위로', () => {
    let s = startStopwatch(newStopwatch(), 0)
    s = lapStopwatch(s, 1000)
    s = lapStopwatch(s, 2500)
    expect(s.laps).toEqual([2500, 1000])
  })
})

describe('타이머(카운트다운)', () => {
  it('남은 시간이 줄고, 0 아래로 내려가지 않는다', () => {
    const s = startCountdown(newCountdown(60_000), 0)
    expect(countdownRemaining(s, 15_000)).toBe(45_000)
    expect(countdownRemaining(s, 90_000)).toBe(0)
  })

  it('멈췄다 다시 시작', () => {
    let s = startCountdown(newCountdown(60_000), 0)
    s = pauseCountdown(s, 20_000)
    expect(countdownRemaining(s, 50_000)).toBe(40_000)
    s = startCountdown(s, 50_000)
    expect(countdownRemaining(s, 60_000)).toBe(30_000)
  })

  it('다 끝난 타이머는 다시 시작되지 않는다', () => {
    const done = pauseCountdown(startCountdown(newCountdown(1000), 0), 5000)
    expect(startCountdown(done, 6000).runningSince).toBeNull()
  })
})

describe('표시', () => {
  it.each([
    [0, '00:00'],
    [65_000, '01:05'],
    [3_725_000, '1:02:05'],
  ])('%i → %s', (ms, text) => expect(formatClock(ms)).toBe(text))

  it('1/10초', () => expect(formatClock(1_234, true)).toBe('00:01.2'))
  it('카운트다운은 올림', () => expect(formatCountdown(1_200)).toBe('00:02'))
})
