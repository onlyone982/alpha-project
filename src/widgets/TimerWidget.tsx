import { useCallback, useEffect, useRef, useState } from 'react'
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
  type CountdownState,
  type StopwatchState,
} from '../lib/timer'

type Mode = 'stopwatch' | 'countdown'
type Saved = { mode: Mode; stopwatch: StopwatchState; countdown: CountdownState }

const STORAGE_KEY = 'arc.timer'
const PRESETS = [5, 10, 25, 50]

/** 이 기기에서만 기억 (새로고침해도 이어서). 저장이 막힌 브라우저면 그냥 처음부터 */
function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Saved
  } catch {
    /* 저장소를 못 쓰는 환경 */
  }
  return { mode: 'countdown', stopwatch: newStopwatch(), countdown: newCountdown(25 * 60_000) }
}

function save(state: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* 무시 */
  }
}

/** 끝났을 때 삐-삐-삐 */
function beep() {
  try {
    const ctx = new AudioContext()
    ;[0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + t)
      osc.stop(ctx.currentTime + t + 0.26)
    })
  } catch {
    /* 소리를 못 내는 환경 */
  }
}

/** 타이머: 스톱워치 + 시간 제한 타이머, 디지털 시계 스타일, 전체화면 */
export function TimerWidget() {
  const [state, setState] = useState<Saved>(load)
  const [now, setNow] = useState(() => Date.now())
  const [fullscreen, setFullscreen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const { mode, stopwatch, countdown } = state
  const running = mode === 'stopwatch' ? stopwatch.runningSince !== null : countdown.runningSince !== null

  const update = useCallback((next: Saved) => {
    setState(next)
    save(next)
  }, [])

  // 달리는 동안 0.1초마다 화면 갱신
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [running])

  const remaining = countdownRemaining(countdown, now)

  // 타이머가 0이 되면 멈추고 소리
  useEffect(() => {
    if (mode !== 'countdown' || countdown.runningSince === null || remaining > 0) return
    const id = window.setTimeout(() => {
      beep()
      update({ ...state, countdown: { ...countdown, remainingMs: 0, runningSince: null } })
    }, 0)
    return () => window.clearTimeout(id)
  }, [mode, countdown, remaining, state, update])

  // 전체화면에서 Esc 등으로 나가면 상태 맞추기
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === boxRef.current && !!boxRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // 전체화면 API 가 없는 기기(아이폰 등)용 가짜 전체화면은 Esc 로 닫기
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  async function enterFullscreen() {
    const el = boxRef.current
    if (el?.requestFullscreen) {
      try {
        await el.requestFullscreen()
        return
      } catch {
        /* 실패하면 아래 가짜 전체화면 */
      }
    }
    setFullscreen(true)
  }

  function exitFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    setFullscreen(false)
  }

  const display =
    mode === 'stopwatch' ? formatClock(stopwatchElapsed(stopwatch, now), true) : formatCountdown(remaining)
  const finished = mode === 'countdown' && countdown.runningSince === null && countdown.remainingMs <= 0
  const pristine = mode === 'countdown' && countdown.runningSince === null && countdown.remainingMs === countdown.durationMs

  const toggle = () => {
    const t = Date.now()
    if (mode === 'stopwatch') {
      update({ ...state, stopwatch: running ? pauseStopwatch(stopwatch, t) : startStopwatch(stopwatch, t) })
    } else {
      update({ ...state, countdown: running ? pauseCountdown(countdown, t) : startCountdown(countdown, t) })
    }
    setNow(t)
  }

  const reset = () => {
    const t = Date.now()
    update(mode === 'stopwatch' ? { ...state, stopwatch: newStopwatch() } : { ...state, countdown: newCountdown(countdown.durationMs) })
    setNow(t)
  }

  const btn = 'rounded-full border border-white/25 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex rounded-full border border-white/20 p-0.5 text-xs" role="tablist" aria-label="타이머 종류">
        {(['countdown', 'stopwatch'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => update({ ...state, mode: m })}
            className={`rounded-full px-3 py-1 ${mode === m ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}
          >
            {m === 'countdown' ? '타이머' : '스톱워치'}
          </button>
        ))}
      </div>

      {/* 시간 표시 (전체화면이 되는 부분) */}
      <div
        ref={boxRef}
        onDoubleClick={fullscreen ? exitFullscreen : undefined}
        className={
          fullscreen
            ? 'fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black text-white'
            : 'flex w-full items-center justify-center rounded-2xl bg-black py-4 text-white [&:fullscreen]:rounded-none'
        }
      >
        <p
          className={`font-mono font-light tabular-nums tracking-tight ${finished ? 'animate-pulse' : ''} ${
            fullscreen ? 'text-[18vw] leading-none' : 'text-5xl [:fullscreen_&]:text-[18vw]'
          }`}
          aria-live="off"
          role="timer"
        >
          {display}
        </p>
        {fullscreen && <p className="mt-6 text-xs text-white/40">Esc 또는 두 번 탭해서 나가기</p>}
      </div>

      {mode === 'countdown' && pristine && (
        <CountdownSetup
          durationMs={countdown.durationMs}
          onSet={(ms) => update({ ...state, countdown: newCountdown(ms) })}
        />
      )}
      {finished && <p className="text-sm text-white">⏰ 끝! 수고했어.</p>}

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className={btn} onClick={toggle} disabled={finished || (mode === 'countdown' && countdown.durationMs <= 0)}>
          {running ? '일시정지' : pristine || (mode === 'stopwatch' && stopwatch.accumulatedMs === 0) ? '시작' : '계속'}
        </button>
        {mode === 'stopwatch' && running && (
          <button type="button" className={btn} onClick={() => update({ ...state, stopwatch: lapStopwatch(stopwatch, Date.now()) })}>
            랩
          </button>
        )}
        <button type="button" className={btn} onClick={reset}>
          초기화
        </button>
        <button type="button" className={btn} onClick={enterFullscreen} aria-label="전체화면">
          ⛶ 전체화면
        </button>
      </div>

      {mode === 'stopwatch' && stopwatch.laps.length > 0 && (
        <ol className="w-full max-w-56 text-sm tabular-nums">
          {stopwatch.laps.map((lap, i) => (
            <li key={i} className="flex justify-between border-b border-white/10 py-1 text-white/80">
              <span>랩 {stopwatch.laps.length - i}</span>
              <span className="font-mono">{formatClock(lap, true)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function CountdownSetup({ durationMs, onSet }: { durationMs: number; onSet: (ms: number) => void }) {
  const minutes = Math.floor(durationMs / 60_000)
  const seconds = Math.floor((durationMs % 60_000) / 1000)
  const field = 'w-16 rounded-lg border border-white/25 bg-black px-2 py-1 text-center text-white tabular-nums focus:border-white focus:outline-none'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-1.5">
        {PRESETS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onSet(m * 60_000)}
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              durationMs === m * 60_000 ? 'border-white bg-white text-black' : 'border-white/25 text-white/80 hover:text-white'
            }`}
          >
            {m}분
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm text-white/70">
        <input
          type="number"
          min={0}
          max={600}
          inputMode="numeric"
          aria-label="분"
          className={field}
          value={minutes}
          onChange={(e) => onSet(Math.max(0, Math.min(600, Number(e.target.value) || 0)) * 60_000 + seconds * 1000)}
        />
        분
        <input
          type="number"
          min={0}
          max={59}
          inputMode="numeric"
          aria-label="초"
          className={field}
          value={seconds}
          onChange={(e) => onSet(minutes * 60_000 + Math.max(0, Math.min(59, Number(e.target.value) || 0)) * 1000)}
        />
        초
      </div>
    </div>
  )
}
