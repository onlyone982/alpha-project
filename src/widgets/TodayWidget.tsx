import { useStreak } from '../data/activityRepo'
import { useToday } from '../hooks/useToday'
import { JournalEditor } from './today/JournalEditor'
import { TodoList } from './today/TodoList'
import { WeekStrip } from './today/WeekStrip'

/** 메인 화면 가운데 상단: 최근 7일 + 오늘의 할일 + 한 줄 일지 */
export function TodayWidget() {
  const todayKey = useToday()
  const { recordedDays, frozenDays } = useStreak(todayKey)

  return (
    <div className="flex flex-col gap-4">
      <WeekStrip todayKey={todayKey} recordedDays={recordedDays} frozenDays={frozenDays} />
      <TodoList dateKey={todayKey} isToday compact />
      <div className="border-t border-line pt-3">
        <JournalEditor dateKey={todayKey} />
      </div>
    </div>
  )
}
