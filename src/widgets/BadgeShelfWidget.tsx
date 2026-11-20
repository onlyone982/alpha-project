import { useBadges } from '../badges/BadgeContext'
import { ProgressBar } from '../components/ProgressBar'
import { nextBadges, remainingText } from '../lib/badges'
import { Sensitive } from '../privacy/Sensitive'

/** 메인 화면 좌측 하단: 최근 받은 배지 + 다음 배지까지 */
export function BadgeShelfWidget() {
  const { loading, statuses, earned } = useBadges()
  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>

  const byKey = new Map(statuses.map((s) => [s.key, s]))
  const recent = [...earned.values()]
    .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
    .map((e) => byKey.get(e.key))
    .filter((s) => s !== undefined)
    .slice(0, 6)
  const next = nextBadges(statuses, new Set(earned.keys()), 2)

  return (
    <div className="flex flex-col gap-4">
      {recent.length === 0 ? (
        <p className="text-sm text-muted">첫 배지까지 얼마 안 남았다. 오늘 하나만 기록해보자.</p>
      ) : (
        <ul className="grid grid-cols-6 gap-1" aria-label="최근 받은 배지">
          {recent.map((s) => (
            <li key={s.key} className="flex aspect-square items-center justify-center rounded-lg bg-surface-2 text-2xl" title={s.title}>
              <Sensitive when={s.habit?.isSensitive ?? false}>{s.def.emoji}</Sensitive>
            </li>
          ))}
        </ul>
      )}

      {next.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted">다음 배지</p>
          {next.map((s) => (
            <div key={s.key}>
              <p className="mb-1 flex justify-between gap-2 text-sm">
                <span className="truncate">
                  <span aria-hidden className="mr-1">{s.def.emoji}</span>
                  <Sensitive when={s.habit?.isSensitive ?? false}>{s.title}</Sensitive>
                </span>
                <span className="shrink-0 text-xs text-muted">{remainingText(s)}</span>
              </p>
              <ProgressBar value={s.current / s.target} label={`${s.title} 진행률`} />
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted tabular-nums">받은 배지 {earned.size}개</p>
    </div>
  )
}
