import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { StartAtEditor } from '../components/StartAtEditor'
import { streakHint } from '../content/memes'
import { useStreak } from '../data/activityRepo'
import { useNow } from '../hooks/useNow'
import { useUpdateStartAt, useUserProfile } from '../hooks/useUserProfile'
import { formatSeoul, toDayKey } from '../lib/date'
import { dayNumber, elapsedParts } from '../lib/dayCounter'
import { pad2 } from '../lib/format'
import { levelFor } from '../lib/levels'
import { usePrivacy } from '../privacy/PrivacyContext'
import { SosButton } from '../sos/SosButton'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 가운데 위 (고정): LV: 이름 / DAY N / 시간·날짜 + 버튼 줄 */
export function HomeWidget() {
  const now = useNow()
  const { isPreview, signOut } = useAuth()
  const { profile } = useUserProfile()
  const updateStartAt = useUpdateStartAt()
  const { privacy, toggle } = usePrivacy()
  const streak = useStreak(toDayKey(now))
  const [editing, setEditing] = useState(false)

  const startAt = profile?.startAt ?? null
  const day = startAt ? dayNumber(startAt, now) : null
  const parts = startAt ? elapsedParts(startAt, now) : null
  const { level } = levelFor(streak.current)
  const weekday = WEEKDAYS[Number(formatSeoul(now, 'i')) % 7]

  const chip = 'whitespace-nowrap rounded-full border border-line px-2.5 py-1 transition-colors hover:text-text'

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4 text-center">
      <p className="text-lg font-bold tracking-wide text-accent" title={`연속 기록 ${streak.current}일`}>
        LV: {level.name}
      </p>

      <div>
        <p className="text-6xl font-black tracking-tight sm:text-7xl">
          Day <span className="tabular-nums">{day ?? '—'}</span>
        </p>
        {parts && (
          <p className="mt-1 font-mono text-sm tabular-nums text-muted" aria-label="시작 후 경과 시간">
            {parts.days}일 {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
          </p>
        )}
      </div>

      <div className="text-sm">
        <p className="tabular-nums">
          <time dateTime={now.toISOString()}>{formatSeoul(now, 'HH:mm:ss')}</time>
          <span className="text-muted"> / {formatSeoul(now, 'yyyy.MM.dd')} ({weekday})</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          since {startAt ? formatSeoul(startAt, 'yyyy.MM.dd HH:mm') : '―'}
          <button type="button" aria-label="시작 일시 수정" onClick={() => setEditing((v) => !v)} className="ml-1.5 hover:text-text">
            ✎
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

      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted">
        <span className={chip} title={streakHint(streak.current, streak.todayRecorded)}>
          <span className={streak.todayRecorded ? '' : 'grayscale'}>🔥</span> {streak.current} · 🧊 {streak.freezes}
        </span>
        <SosButton variant="small" />
        <button type="button" onClick={toggle} aria-pressed={privacy} className={`${chip} ${privacy ? 'border-accent text-accent' : ''}`}>
          {privacy ? '🙈 가림' : '👀 가리기'}
        </button>
        <button type="button" onClick={signOut} className={chip}>
          {isPreview ? '미리보기 종료' : '로그아웃'}
        </button>
      </div>
    </div>
  )
}
