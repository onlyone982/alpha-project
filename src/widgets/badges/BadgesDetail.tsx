import { useBadges } from '../../badges/BadgeContext'
import { BadgeTile } from '../../badges/BadgeTile'
import { CATEGORY_INFO, type BadgeCategory } from '../../content/badges'
import type { BadgeStatus } from '../../lib/badges'
import { Sensitive } from '../../privacy/Sensitive'

const ORDER: BadgeCategory[] = ['record', 'quit', 'quitTotal', 'sos', 'journal', 'savings', 'special']

/** 전체 배지: 받은 것은 색, 못 받은 것은 잠금 + 진행률 */
export function BadgesDetail() {
  const { loading, statuses, earned } = useBadges()
  if (loading) return <p className="text-muted">불러오는 중…</p>

  // 보관한 항목은 받은 배지만 보여줌
  const visible = statuses.filter((s) => !s.habit?.archived || earned.has(s.key))
  const total = visible.length
  const earnedCount = visible.filter((s) => earned.has(s.key)).length

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted">
        받은 배지 <strong className="text-text tabular-nums">{earnedCount}</strong> / {total} · 한 번 받은 배지는 실패해도 사라지지 않아요.
      </p>
      {ORDER.map((category) => {
        const items = visible.filter((s) => s.def.category === category)
        if (items.length === 0) return null
        const info = CATEGORY_INFO[category]
        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">{info.label}</h2>
            {info.perHabit ? groupByHabit(items).map((group) => (
              <div key={group[0].habit!.id} className="flex flex-col gap-2">
                <h3 className="text-sm text-muted">
                  <Sensitive when={group[0].habit!.isSensitive}>
                    {group[0].habit!.emoji} {group[0].habit!.name}
                  </Sensitive>
                  {group[0].habit!.archived && ' (보관됨)'}
                </h3>
                <Grid items={group} earned={earned} />
              </div>
            )) : <Grid items={items} earned={earned} />}
          </section>
        )
      })}
    </div>
  )
}

function Grid({ items, earned }: { items: BadgeStatus[]; earned: Map<string, { earnedAt: Date }> }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {items.map((s) => (
        <BadgeTile key={s.key} status={s} earnedAt={earned.get(s.key)?.earnedAt ?? null} />
      ))}
    </div>
  )
}

function groupByHabit(items: BadgeStatus[]): BadgeStatus[][] {
  const groups = new Map<string, BadgeStatus[]>()
  for (const s of items) {
    const id = s.habit!.id
    groups.set(id, [...(groups.get(id) ?? []), s])
  }
  return [...groups.values()]
}
