import { describe, expect, it } from 'vitest'
import { breathStateAt } from './breathing'

describe('breathStateAt', () => {
  it('시작은 들이쉬기 4초', () => {
    const s = breathStateAt(0)
    expect(s.phase.key).toBe('inhale')
    expect(s.phaseSecondsLeft).toBe(4)
    expect(s.totalSecondsLeft).toBe(60)
    expect(s.done).toBe(false)
  })

  it('5초 → 참기, 9초 → 내쉬기, 13초 → 참기, 16초 → 다시 들이쉬기', () => {
    expect(breathStateAt(5000).phase.key).toBe('hold-in')
    expect(breathStateAt(9000).phase.key).toBe('exhale')
    expect(breathStateAt(13000).phase.key).toBe('hold-out')
    expect(breathStateAt(16000).phase.key).toBe('inhale')
  })

  it('단계 진행률', () => {
    expect(breathStateAt(2000).phaseProgress).toBeCloseTo(0.5)
  })

  it('60초가 지나면 끝', () => {
    const s = breathStateAt(60_000)
    expect(s.done).toBe(true)
    expect(s.totalSecondsLeft).toBe(0)
  })
})
