import { lastNDays, weekdayOfKey } from '../../lib/calendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 최근 7일 기록 현황 (🔥 기록 / 🧊 프리즈 / · 없음) */
export function WeekStrip({
  todayKey,
  recordedDays,
  frozenDays,
}: {
  todayKey: string
  recordedDays: ReadonlySet<string>
  frozenDays: ReadonlySet<string>
}) {
  return (
    <ol className="grid grid-cols-7 gap-1 text-center" aria-label="최근 7일 기록">
      {lastNDays(todayKey, 7).map((key) => {
        const recorded = recordedDays.has(key)
        const frozen = frozenDays.has(key)
        const isToday = key === todayKey
        return (
          <li
            key={key}
            className={`rounded-lg py-1 ${isToday ? 'bg-surface-2 ring-1 ring-line' : ''}`}
            aria-label={`${key} ${recorded ? '기록함' : frozen ? '프리즈' : '기록 없음'}`}
          >
            <span className="block text-[10px] text-muted">{WEEKDAYS[weekdayOfKey(key)]}</span>
            <span className={`block text-base ${recorded || frozen ? '' : 'text-muted'}`} aria-hidden>
              {recorded ? '🔥' : frozen ? '🧊' : '·'}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
