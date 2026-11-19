import { useState } from 'react'
import { ui } from '../../components/ui'
import { longestKept, pickRandom, relapseComfort } from '../../content/memes'
import { useStore } from '../../data/DataStoreContext'
import { addRelapse, removeRelapse, updateHabit } from '../../data/habitsRepo'
import type { HabitView } from '../../data/useQuitData'
import { formatSeoul } from '../../lib/date'
import { formatDuration, formatMinutes, formatWon } from '../../lib/format'
import { Sensitive } from '../../privacy/Sensitive'
import { HabitForm } from './HabitForm'
import { RelapseForm } from './RelapseForm'

type Mode = 'view' | 'relapse' | 'edit'

export function HabitCard({ view }: { view: HabitView }) {
  const store = useStore()
  const { habit, relapses, stats } = view
  const [mode, setMode] = useState<Mode>('view')
  const [comfort, setComfort] = useState<string | null>(null)

  if (!store) return null

  if (mode === 'edit') {
    return (
      <HabitForm
        initial={habit}
        submitLabel="저장"
        onCancel={() => setMode('view')}
        onSubmit={async (input) => {
          await updateHabit(store, habit.id, input)
          setMode('view')
        }}
      />
    )
  }

  return (
    <article className={ui.card}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">
            <Sensitive when={habit.isSensitive}>
              <span aria-hidden className="mr-1.5">
                {habit.emoji}
              </span>
              {habit.name}
            </Sensitive>
          </h3>
          <p className="text-xs text-muted">since {formatSeoul(habit.startAt, 'yyyy.MM.dd HH:mm')}</p>
        </div>
        <p className="text-right">
          <span className="text-3xl font-black tabular-nums">{stats.currentDayNumber}</span>
          <span className="text-muted">일차</span>
          <span className="block text-xs text-muted tabular-nums">{formatDuration(stats.currentStreakMs)} 째</span>
        </p>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        <Stat label="🏆 최장 기록" value={`${stats.longestDayNumber}일차`} sub={formatDuration(stats.longestStreakMs)} />
        <Stat label="✅ 누적 성공" value={`${stats.cleanDays}일`} sub="실패 없던 날 (어제까지)" />
        <Stat label="🔁 시도" value={`${stats.attempts}번째`} />
        <Stat label="💸 아낀 돈" value={formatWon(stats.savedMoney)} sub={`하루 ${formatWon(habit.dailyCost)}`} />
        <Stat label="⏳ 아낀 시간" value={formatMinutes(stats.savedMinutes)} sub={`하루 ${formatMinutes(habit.dailyMinutes)}`} />
      </dl>

      {habit.reason && (
        <p className="mt-3 rounded-lg border-l-2 border-accent bg-surface-2 px-3 py-2 text-sm">
          <Sensitive when={habit.isSensitive}>“{habit.reason}”</Sensitive>
        </p>
      )}

      {comfort && (
        <div className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm" role="status">
          <p className="font-semibold">{comfort}</p>
          <p className="mt-1 text-muted">{longestKept(stats.longestDayNumber)}</p>
          <button type="button" className="mt-2 text-xs text-muted hover:text-text" onClick={() => setComfort(null)}>
            닫기
          </button>
        </div>
      )}

      {mode === 'relapse' ? (
        <RelapseForm
          habit={habit}
          onCancel={() => setMode('view')}
          onSubmit={async (at, note) => {
            await addRelapse(store, habit.id, at, note)
            setMode('view')
            setComfort(pickRandom(relapseComfort))
          }}
        />
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={ui.buttonDanger} onClick={() => setMode('relapse')}>
            실패 기록
          </button>
          <button type="button" className={ui.button} onClick={() => setMode('edit')}>
            수정
          </button>
          <button
            type="button"
            className={ui.button}
            onClick={() => updateHabit(store, habit.id, { archived: !habit.archived })}
          >
            {habit.archived ? '다시 시작 (보관 해제)' : '보관'}
          </button>
        </div>
      )}

      {relapses.length > 0 && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-muted">실패 기록 {relapses.length}개</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {relapses.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-surface-2">
                <span>
                  <span className="tabular-nums text-muted">{formatSeoul(r.at, 'yyyy.MM.dd HH:mm')}</span>
                  {r.note && <span className="ml-2">{r.note}</span>}
                </span>
                <button
                  type="button"
                  className="text-xs text-muted hover:text-danger"
                  onClick={() => {
                    if (window.confirm('이 실패 기록을 지울까요? (잘못 누른 경우에만)')) removeRelapse(store, habit.id, r.id)
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-bold tabular-nums">{value}</dd>
      {sub && <dd className="text-xs text-muted">{sub}</dd>}
    </div>
  )
}
