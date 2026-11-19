import { useState } from 'react'
import { ui } from '../../components/ui'
import { useStreak } from '../../data/activityRepo'
import { useToday } from '../../hooks/useToday'
import { formatSeoul } from '../../lib/date'
import { STREAK_RULES } from '../../lib/streak'
import { JournalEditor } from './JournalEditor'
import { MonthCalendar } from './MonthCalendar'
import { TodoList } from './TodoList'

/** 오늘 상세: 월 달력 + 고른 날의 할일과 일지 */
export function TodayDetail() {
  const todayKey = useToday()
  const streak = useStreak(todayKey)
  const [selected, setSelected] = useState(todayKey)
  const [month, setMonth] = useState(todayKey.slice(0, 7))
  const isToday = selected === todayKey
  const selectedDate = new Date(`${selected}T12:00:00+09:00`)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="flex flex-col gap-4">
        <section className={`${ui.card} grid grid-cols-3 gap-2 text-center`}>
          <Stat label="🔥 연속 기록" value={`${streak.current}일`} />
          <Stat label="🏆 최장" value={`${streak.longest}일`} />
          <Stat label="🧊 프리즈" value={`${streak.freezes}/${STREAK_RULES.maxFreezes}`} />
          <p className="col-span-3 text-xs text-muted">
            일지 쓰기 · 할일 완료 · 착장 · 운동 중 하나만 해도 기록한 날. {STREAK_RULES.freezeEvery}일 연속마다 프리즈 1개.
          </p>
        </section>
        <section className={ui.card}>
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={setSelected}
            todayKey={todayKey}
            recordedDays={streak.recordedDays}
            frozenDays={streak.frozenDays}
          />
        </section>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">
          {formatSeoul(selectedDate, 'M월 d일')} {isToday && <span className="text-accent">오늘</span>}
          {streak.recordedDays.has(selected) && <span className="ml-2 text-sm">🔥 기록함</span>}
          {streak.frozenDays.has(selected) && <span className="ml-2 text-sm">🧊 프리즈로 넘김</span>}
        </h2>
        <section className={ui.card}>
          <h3 className="mb-2 text-sm font-semibold">📝 한 줄 일지</h3>
          <JournalEditor dateKey={selected} />
        </section>
        <section className={ui.card}>
          <h3 className="mb-2 text-sm font-semibold">✅ 할일</h3>
          <TodoList dateKey={selected} isToday={isToday} />
        </section>
        <p className="text-xs text-muted">착장과 운동 기록은 6단계에서 이 화면에 함께 나와요.</p>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-black tabular-nums">{value}</p>
    </div>
  )
}
