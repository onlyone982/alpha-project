/** 박스 호흡: 4초 들이쉬기 → 4초 참기 → 4초 내쉬기 → 4초 참기 반복 */
export const BREATH_PHASES = [
  { key: 'inhale', label: '들이쉬기', seconds: 4 },
  { key: 'hold-in', label: '참기', seconds: 4 },
  { key: 'exhale', label: '내쉬기', seconds: 4 },
  { key: 'hold-out', label: '참기', seconds: 4 },
] as const

export const BREATHING_TOTAL_SECONDS = 60

export type BreathState = {
  phase: (typeof BREATH_PHASES)[number]
  /** 현재 단계 남은 초 (올림) */
  phaseSecondsLeft: number
  /** 현재 단계 진행률 0~1 (애니메이션용) */
  phaseProgress: number
  totalSecondsLeft: number
  done: boolean
}

export function breathStateAt(elapsedMs: number, totalSeconds = BREATHING_TOTAL_SECONDS): BreathState {
  const elapsed = Math.max(0, elapsedMs) / 1000
  const cycle = BREATH_PHASES.reduce((sum, p) => sum + p.seconds, 0)
  const done = elapsed >= totalSeconds
  const t = done ? 0 : elapsed % cycle

  let start = 0
  let phase: (typeof BREATH_PHASES)[number] = BREATH_PHASES[0]
  for (const p of BREATH_PHASES) {
    if (t < start + p.seconds) {
      phase = p
      break
    }
    start += p.seconds
  }
  const inPhase = t - start

  return {
    phase,
    phaseSecondsLeft: done ? 0 : Math.ceil(phase.seconds - inPhase),
    phaseProgress: done ? 1 : inPhase / phase.seconds,
    totalSecondsLeft: Math.max(0, Math.ceil(totalSeconds - elapsed)),
    done,
  }
}
