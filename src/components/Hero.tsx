import { useAuth } from '../auth/AuthContext'
import { useNow } from '../hooks/useNow'
import { formatSeoul } from '../lib/date'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

/**
 * 최상단 히어로.
 * DAY 카운터, SOS, 프라이버시 모드는 2단계 / 스트릭은 3단계에서 실제로 연결됩니다.
 */
export function Hero() {
  const now = useNow()
  const { user, isPreview, signOut } = useAuth()
  const weekday = WEEKDAYS[Number(formatSeoul(now, 'i')) % 7]

  return (
    <header className="mb-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <time dateTime={now.toISOString()} className="tabular-nums">
          {formatSeoul(now, 'yyyy.MM.dd')} ({weekday}) {formatSeoul(now, 'HH:mm:ss')}
        </time>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line px-2.5 py-1 tabular-nums" title="연속 기록 (3단계)">
            🔥 0 · 🧊 0
          </span>
          <button
            type="button"
            disabled
            title="2단계에서 구현"
            className="rounded-full border border-line px-2.5 py-1 disabled:opacity-50"
          >
            🙈 프라이버시
          </button>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-line px-2.5 py-1 transition-colors hover:bg-surface-2 hover:text-text"
          >
            {isPreview ? '미리보기 종료' : '로그아웃'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-black tracking-tight sm:text-7xl">
            <span aria-hidden>🔥 </span>DAY <span className="text-accent">—</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            since ― · 시작 일시와 경과 시간은 2단계에서 연결돼요
            {user?.displayName ? ` · ${user.displayName}` : ''}
          </p>
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
