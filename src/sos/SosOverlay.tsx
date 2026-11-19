import { useCallback, useEffect, useState } from 'react'
import { YouTubeEmbed } from '../components/YouTubeEmbed'
import { ui } from '../components/ui'
import { longestKept, pickRandom, relapseComfort, sosIntro, sosResisted } from '../content/memes'
import { useStore } from '../data/DataStoreContext'
import { addRelapse } from '../data/habitsRepo'
import { addSosEvent } from '../data/sosRepo'
import { useQuitData, type HabitView } from '../data/useQuitData'
import { sosVideo, useVideos, type Video } from '../data/videosRepo'
import { useNow } from '../hooks/useNow'
import { Sensitive } from '../privacy/Sensitive'
import { RelapseForm } from '../widgets/quit/RelapseForm'
import { BreathingTimer } from './BreathingTimer'

type Step =
  | { kind: 'pick' }
  | { kind: 'breathe'; startedAt: number; timerDone: boolean }
  | { kind: 'resisted'; message: string }
  | { kind: 'relapse-pick' }
  | { kind: 'relapse'; habitId: string }
  | { kind: 'relapsed'; message: string; longestDayNumber: number }

/**
 * SOS 전체 화면.
 * 항목 고르기 → 이유 + 기록 + 영상 + 60초 호흡 → "버텼다" / "졌다…"
 */
export function SosOverlay({ initialHabitId, onClose }: { initialHabitId?: string; onClose: () => void }) {
  const store = useStore()
  const now = useNow(30_000)
  const { active } = useQuitData(now)
  const { videos } = useVideos()
  const [habitId, setHabitId] = useState<string | null>(initialHabitId ?? null)
  const [step, setStep] = useState<Step>(() =>
    initialHabitId ? { kind: 'breathe', startedAt: Date.now(), timerDone: false } : { kind: 'pick' },
  )
  const [video, setVideo] = useState<Video | null>(null)

  const view = active.find((v) => v.habit.id === habitId) ?? null

  // Esc 로 닫기 + 뒤 화면 스크롤 막기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const start = (id: string | null) => {
    setHabitId(id)
    setVideo(sosVideo(videos))
    setStep({ kind: 'breathe', startedAt: Date.now(), timerDone: false })
  }

  const onTimerDone = useCallback(() => {
    setStep((s) => (s.kind === 'breathe' && !s.timerDone ? { ...s, timerDone: true } : s))
  }, [])

  const shownVideo = video ?? (step.kind === 'breathe' ? sosVideo(videos, () => 0) : null)

  async function resisted() {
    if (store) await addSosEvent(store, habitId, 'resisted')
    setStep({ kind: 'resisted', message: pickRandom(sosResisted) })
  }

  async function lost() {
    if (store) await addSosEvent(store, habitId, 'relapsed')
    setStep(habitId ? { kind: 'relapse', habitId } : { kind: 'relapse-pick' })
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 px-4 py-6 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label="SOS"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-danger">🆘 SOS</p>
          <button type="button" className={ui.button} onClick={onClose} aria-label="닫기">
            ✕ 닫기
          </button>
        </div>

        {step.kind === 'pick' && (
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">{sosIntro}</h2>
            <p className="text-muted">뭐 때문에 흔들려?</p>
            <div className="grid gap-2">
              {active.map((v) => (
                <button key={v.habit.id} type="button" className={`${ui.button} justify-start py-3 text-base`} onClick={() => start(v.habit.id)}>
                  <Sensitive when={v.habit.isSensitive}>
                    {v.habit.emoji} {v.habit.name}
                  </Sensitive>
                  <span className="ml-auto text-sm text-muted">{v.stats.currentDayNumber}일차</span>
                </button>
              ))}
              <button type="button" className={`${ui.button} justify-start py-3 text-base`} onClick={() => start(null)}>
                😮‍💨 그냥 다 힘들어
              </button>
            </div>
          </section>
        )}

        {step.kind === 'breathe' && (
          <section className="flex flex-col gap-6">
            {view ? <Reason view={view} /> : <h2 className="text-2xl font-bold">{sosIntro}</h2>}
            {shownVideo && <YouTubeEmbed youtubeId={shownVideo.youtubeId} title={shownVideo.title} />}
            <BreathingTimer startedAt={step.startedAt} onDone={onTimerDone} />
            {step.timerDone ? (
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`${ui.buttonPrimary} py-4 text-lg`} onClick={resisted}>
                  버텼다 💪
                </button>
                <button type="button" className={`${ui.button} py-4 text-lg`} onClick={lost}>
                  졌다…
                </button>
              </div>
            ) : (
              <p className="text-center text-sm text-muted">타이머가 끝나면 결과를 고를 수 있어요.</p>
            )}
          </section>
        )}

        {step.kind === 'resisted' && (
          <Result title={step.message} onClose={onClose}>
            {view && (
              <p className="text-muted">
                {view.habit.emoji} {view.habit.name} {view.stats.currentDayNumber}일차, 계속 간다.
              </p>
            )}
          </Result>
        )}

        {step.kind === 'relapse-pick' && (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">괜찮아. 어떤 걸 기록할까?</h2>
            {active.map((v) => (
              <button key={v.habit.id} type="button" className={`${ui.button} justify-start py-3`} onClick={() => setStep({ kind: 'relapse', habitId: v.habit.id })}>
                <Sensitive when={v.habit.isSensitive}>
                  {v.habit.emoji} {v.habit.name}
                </Sensitive>
              </button>
            ))}
            <button type="button" className="self-start text-sm text-muted hover:text-text" onClick={onClose}>
              기록하지 않고 닫기
            </button>
          </section>
        )}

        {step.kind === 'relapse' && (() => {
          const target = active.find((v) => v.habit.id === step.habitId)
          if (!target || !store) return null
          return (
            <RelapseForm
              habit={target.habit}
              onCancel={onClose}
              onSubmit={async (at, note) => {
                await addRelapse(store, target.habit.id, at, note)
                setStep({ kind: 'relapsed', message: pickRandom(relapseComfort), longestDayNumber: target.stats.longestDayNumber })
              }}
            />
          )
        })()}

        {step.kind === 'relapsed' && (
          <Result title={step.message} onClose={onClose}>
            <p className="text-muted">{longestKept(step.longestDayNumber)}</p>
          </Result>
        )}
      </div>
    </div>
  )
}

function Reason({ view }: { view: HabitView }) {
  const { habit, stats } = view
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        <Sensitive when={habit.isSensitive}>
          {habit.emoji} {habit.name}
        </Sensitive>
      </p>
      <p className="text-2xl font-bold leading-snug sm:text-3xl">
        <Sensitive when={habit.isSensitive}>“{habit.reason || '왜 시작했는지 기억해.'}”</Sensitive>
      </p>
      <p className="text-muted">
        지금 <strong className="text-text tabular-nums">{stats.currentDayNumber}일차</strong> · 최고{' '}
        <strong className="text-text tabular-nums">{stats.longestDayNumber}일차</strong>
      </p>
    </div>
  )
}

function Result({ title, onClose, children }: { title: string; onClose: () => void; children?: React.ReactNode }) {
  return (
    <section className="flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold leading-snug">{title}</h2>
      {children}
      <button type="button" className={ui.buttonPrimary} onClick={onClose}>
        닫기
      </button>
    </section>
  )
}
