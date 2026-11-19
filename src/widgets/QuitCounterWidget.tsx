import { Link } from 'react-router'
import { ProgressBar } from '../components/ProgressBar'
import { emptyQuit } from '../content/memes'
import { useQuitData } from '../data/useQuitData'
import { useNow } from '../hooks/useNow'
import { formatMinutes, formatWon } from '../lib/format'
import { Sensitive } from '../privacy/Sensitive'

/** 메인 화면 우측 상단: 끊기 항목별 N일차 + 아낀 돈 + 가장 가까운 위시 */
export function QuitCounterWidget() {
  const now = useNow(30_000)
  const { loading, active, totals, wishlist } = useQuitData(now)
  const nextWish = wishlist.pending[0]

  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>

  if (active.length === 0) {
    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <p className="text-sm text-muted">{emptyQuit}</p>
        <Link to="/w/quit" className="self-start text-sm text-accent hover:underline">
          + 끊을 것 추가하기
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {active.map(({ habit, stats }) => (
          <li key={habit.id} className="flex items-baseline justify-between gap-3">
            <Sensitive when={habit.isSensitive}>
              <span className="font-medium">
                <span aria-hidden className="mr-1.5">
                  {habit.emoji}
                </span>
                {habit.name}
              </span>
            </Sensitive>
            <span className="shrink-0 text-right">
              <span className="text-lg font-bold tabular-nums">{stats.currentDayNumber}</span>
              <span className="text-sm text-muted">일차</span>
              <span className="ml-2 text-xs text-muted tabular-nums">최고 {stats.longestDayNumber}일차</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-xl bg-surface-2 p-3 text-sm">
        <p>
          💸 아낀 돈 <strong className="tabular-nums">{formatWon(totals.money)}</strong>
          <span className="text-muted"> · ⏳ {formatMinutes(totals.minutes)}</span>
        </p>
        {nextWish && (
          <div className="mt-2">
            <p className="mb-1 flex justify-between gap-2 text-xs text-muted">
              <span className="truncate">{nextWish.canBuy ? '🎉 이제 살 수 있음: ' : '다음 목표: '}{nextWish.item.name}</span>
              <span className="tabular-nums">{Math.round(nextWish.progress * 100)}%</span>
            </p>
            <ProgressBar value={nextWish.progress} label={`${nextWish.item.name} 진행률`} />
          </div>
        )}
      </div>
    </div>
  )
}
