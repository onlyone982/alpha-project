import { addMonths, monthGrid } from '../../lib/calendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 월 달력. 기록한 날 🔥, 프리즈로 넘긴 날 🧊 */
export function MonthCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  todayKey,
  recordedDays,
  frozenDays,
}: {
  month: string
  onMonthChange: (month: string) => void
  selected: string
  onSelect: (key: string) => void
  todayKey: string
  recordedDays: ReadonlySet<string>
  frozenDays: ReadonlySet<string>
}) {
  const [year, mon] = month.split('-').map(Number)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className="rounded-lg px-2 py-1 hover:bg-surface-2" aria-label="이전 달" onClick={() => onMonthChange(addMonths(month, -1))}>
          ←
        </button>
        <p className="font-semibold tabular-nums">
          {year}년 {mon}월
        </p>
        <button type="button" className="rounded-lg px-2 py-1 hover:bg-surface-2" aria-label="다음 달" onClick={() => onMonthChange(addMonths(month, 1))}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 text-muted">
            {w}
          </span>
        ))}
        {monthGrid(month).map((key, i) => {
          if (!key) return <span key={`empty-${i}`} />
          const recorded = recordedDays.has(key)
          const frozen = frozenDays.has(key)
          const isSelected = key === selected
          const isToday = key === todayKey
          const isFuture = key > todayKey
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={`${key}${recorded ? ' 기록함' : frozen ? ' 프리즈' : ''}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                isSelected ? 'bg-accent font-bold text-black' : isToday ? 'ring-1 ring-accent' : 'hover:bg-surface-2'
              } ${isFuture && !isSelected ? 'text-muted/50' : ''}`}
            >
              <span className="tabular-nums">{Number(key.slice(8))}</span>
              <span className="h-4 text-[11px] leading-4" aria-hidden>
                {recorded ? '🔥' : frozen ? '🧊' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
