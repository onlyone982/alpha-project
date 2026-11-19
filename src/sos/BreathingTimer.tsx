import { useEffect, useState } from 'react'
import { breathStateAt } from '../lib/breathing'

/** 60초 박스 호흡 타이머. 끝나면 onDone 한 번 호출 */
export function BreathingTimer({ startedAt, onDone }: { startedAt: number; onDone: () => void }) {
  const [now, setNow] = useState(startedAt)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200)
    return () => window.clearInterval(id)
  }, [])

  const state = breathStateAt(now - startedAt)

  useEffect(() => {
    if (state.done) onDone()
  }, [state.done, onDone])

  // 들이쉬면 커지고, 내쉬면 작아짐
  const small = 0.55
  const scale =
    state.phase.key === 'inhale'
      ? small + (1 - small) * state.phaseProgress
      : state.phase.key === 'hold-in'
        ? 1
        : state.phase.key === 'exhale'
          ? 1 - (1 - small) * state.phaseProgress
          : small

  return (
    <div className="flex flex-col items-center gap-4" role="timer" aria-live="polite">
      <div className="flex size-44 items-center justify-center">
        <div
          className="flex size-44 items-center justify-center rounded-3xl border-2 border-accent bg-accent/10 transition-transform duration-200 ease-linear"
          style={{ transform: `scale(${scale})` }}
        >
          <span className="text-4xl font-black tabular-nums">{state.done ? '✓' : state.phaseSecondsLeft}</span>
        </div>
      </div>
      <p className="text-xl font-bold">{state.done ? '60초 버텼다' : state.phase.label}</p>
      <p className="text-sm text-muted tabular-nums">남은 시간 {state.totalSecondsLeft}초</p>
    </div>
  )
}
