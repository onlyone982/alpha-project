import { useMemo } from 'react'
import { useStreak } from '../data/activityRepo'
import { useCollection } from '../data/hooks'
import { useQuitData } from '../data/useQuitData'
import { useNow } from '../hooks/useNow'
import { toDayKey } from '../lib/date'
import { summarizeWeek, weekDays } from '../lib/week'
import { JournalEditor } from './today/JournalEditor'
import { TodoList } from './today/TodoList'

/** 왼쪽 위: 이번 주 요약 + 오늘 해야 할 일 + 한 줄 일지 */
export function TodayWidget() {
  const now = useNow(60_000)
  const todayKey = toDayKey(now)
  const streak = useStreak(todayKey)
  const quit = useQuitData(now)
  const { docs: todoDocs } = useCollection('todos')

  const summary = useMemo(() => {
    const week = new Set(weekDays(todayKey))
    return summarizeWeek({
      todayKey,
      recordedDays: streak.recordedDays,
      todos: todoDocs
        .filter((d) => typeof d.date === 'string' && week.has(d.date))
        .map((d) => ({ date: d.date as string, done: d.done === true })),
      relapseDays: [...quit.active, ...quit.archived].flatMap((v) => v.relapses.map((r) => toDayKey(r.at))),
    })
  }, [todayKey, streak.recordedDays, todoDocs, quit])

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-2 text-sm font-semibold">이번 주 요약</h3>
        <dl className="grid grid-cols-3 gap-px border border-line bg-line text-center">
          <Stat label="기록한 날" value={`${summary.recordedDays}/${summary.daysSoFar}`} />
          <Stat label="할일 완료" value={`${summary.todoDone}/${summary.todoTotal}`} />
          <Stat label="끊기 실패" value={`${summary.relapses}회`} />
        </dl>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">오늘 해야 할 일</h3>
        <TodoList dateKey={todayKey} isToday compact />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold">한 줄 일지</h3>
        <JournalEditor dateKey={todayKey} />
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg px-2 py-2">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="font-bold tabular-nums">{value}</dd>
    </div>
  )
}
