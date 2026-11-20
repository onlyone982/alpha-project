import { weekdayOfKey } from '../lib/calendar'
import { addDaysToKey } from '../lib/date'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** ‹ 11월 20일 (금) › 날짜 이동 */
export function DateNav({ dateKey, todayKey, onChange }: { dateKey: string; todayKey: string; onChange: (key: string) => void }) {
  const [, m, d] = dateKey.split('-').map(Number)
  return (
    <div className="flex items-center gap-1 text-sm">
      <button type="button" aria-label="전날" className="px-1.5 text-muted hover:text-text" onClick={() => onChange(addDaysToKey(dateKey, -1))}>
        ‹
      </button>
      <span className="tabular-nums">
        {m}월 {d}일 ({WEEKDAYS[weekdayOfKey(dateKey)]})
      </span>
      <button
        type="button"
        aria-label="다음날"
        className="px-1.5 text-muted hover:text-text disabled:opacity-30"
        disabled={dateKey >= todayKey}
        onClick={() => onChange(addDaysToKey(dateKey, 1))}
      >
        ›
      </button>
      {dateKey !== todayKey && (
        <button type="button" className="ml-1 text-xs text-accent hover:underline" onClick={() => onChange(todayKey)}>
          오늘
        </button>
      )}
    </div>
  )
}
