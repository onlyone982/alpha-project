import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { streakHint } from '../content/memes'
import { useStreak } from '../data/activityRepo'
import { useNow } from '../hooks/useNow'
import { useUpdateStartAt, useUserProfile } from '../hooks/useUserProfile'
import { formatSeoul, toDayKey } from '../lib/date'
import { dayNumber, elapsedParts } from '../lib/dayCounter'
import { pad2 } from '../lib/format'
import { usePrivacy } from '../privacy/PrivacyContext'
import { StartAtEditor } from './StartAtEditor'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 최상단 히어로: DAY 카운터, 현재 시각, 기록 스트릭, 프라이버시 모드. (SOS는 4단계) */
export function Hero() {
  const now = useNow()
  const { isPreview, signOut } = useAuth()
  const { profile } = useUserProfile()
  const updateStartAt = useUpdateStartAt()
  const { privacy, toggle } = usePrivacy()
  const [editing, setEditing] = useState(false)
  const streak = useStreak(toDayKey(now))

  const startAt = profile?.startAt ?? null
  const day = startAt ? dayNumber(startAt, now) : null
  const parts = startAt ? elapsedParts(startAt, now) : null
  const weekday = WEEKDAYS[Number(formatSeoul(now, 'i')) % 7]

  return (
    <header className="mb-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <time dateTime={now.toISOString()} className="tabular-nums">
          {formatSeoul(now, 'yyyy.MM.dd')} ({weekday}) {formatSeoul(now, 'HH:mm:ss')}
        </time>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 tabular-nums ${
              streak.todayRecorded ? 'border-accent/60 text-text' : 'border-line'
            }`}
            title={streakHint(streak.current, streak.todayRecorded)}
          >
            <span className={streak.todayRecorded ? '' : 'grayscale'}>🔥</span> {streak.current} · 🧊 {streak.freezes}
            {!streak.todayRecorded && <span className="ml-1.5 hidden text-xs sm:inline">오늘 기록하면 {streak.current + 1}</span>}
          </span>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={privacy}
            className={`whitespace-nowrap rounded-full border px-2.5 py-1 transition-colors ${
              privacy ? 'border-accent text-accent' : 'border-line hover:bg-surface-2 hover:text-text'
            }`}
          >
            {privacy ? '🙈 가림 켜짐' : '👀 프라이버시'}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="whitespace-nowrap rounded-full border border-line px-2.5 py-1 transition-colors hover:bg-surface-2 hover:text-text"
          >
            {isPreview ? '미리보기 종료' : '로그아웃'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-black tracking-tight sm:text-7xl">
            <span aria-hidden>🔥 </span>DAY <span className="text-accent tabular-nums">{day ?? '—'}</span>
          </p>
          {parts && (
            <p className="mt-2 font-mono text-lg tabular-nums text-text sm:text-xl" aria-label="시작 후 경과 시간">
              {parts.days}일 {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
            </p>
          )}
          <p className="mt-1 text-sm text-muted">
            since {startAt ? formatSeoul(startAt, 'yyyy.MM.dd HH:mm') : '―'}
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="ml-2 rounded px-1.5 py-0.5 text-xs hover:bg-surface-2 hover:text-text"
            >
              ✎ 수정
            </button>
          </p>
          {editing && (
            <StartAtEditor
              value={startAt}
              onCancel={() => setEditing(false)}
              onSave={async (date) => {
                await updateStartAt(date)
                setEditing(false)
              }}
            />
          )}
        </div>
        <button
          type="button"
          disabled
          title="4단계에서 구현"
          className="rounded-xl bg-danger px-5 py-3 text-base font-bold text-white disabled:opacity-60"
        >
          🆘 SOS
        </button>
      </div>
    </header>
  )
}
