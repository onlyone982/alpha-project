import { useState } from 'react'
import { ui } from '../../components/ui'
import { emptyQuit } from '../../content/memes'
import { useStore } from '../../data/DataStoreContext'
import { addHabit } from '../../data/habitsRepo'
import { useQuitData } from '../../data/useQuitData'
import { useNow } from '../../hooks/useNow'
import { formatMinutes, formatWon } from '../../lib/format'
import { HabitCard } from './HabitCard'
import { HabitForm } from './HabitForm'
import { WishlistSection } from './WishlistSection'

/** 끊기 카운터 상세: 항목 관리, 실패 기록, 아낀 돈, 위시리스트 */
export function QuitDetail() {
  const store = useStore()
  const now = useNow(30_000)
  const { loading, active, archived, totals, wishlist } = useQuitData(now)
  const [adding, setAdding] = useState(false)

  if (!store || loading) return <p className="text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col gap-8">
      <section className={`${ui.card} grid grid-cols-2 gap-3`}>
        <div>
          <p className="text-xs text-muted">💸 지금까지 아낀 돈</p>
          <p className="text-2xl font-black tabular-nums">{formatWon(totals.money)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">⏳ 지금까지 아낀 시간</p>
          <p className="text-2xl font-black tabular-nums">{formatMinutes(totals.minutes)}</p>
        </div>
        <p className="col-span-2 text-xs text-muted">실패가 없었던 날(어제까지) × 하루 평균값으로 계산해요. 실패해도 줄어들지 않아요.</p>
      </section>

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold">🚭 끊고 있는 것</h2>
          {!adding && (
            <button type="button" className={ui.button} onClick={() => setAdding(true)}>
              + 항목 추가
            </button>
          )}
        </header>

        {adding && (
          <HabitForm
            submitLabel="추가"
            onCancel={() => setAdding(false)}
            onSubmit={async (input) => {
              await addHabit(store, input)
              setAdding(false)
            }}
          />
        )}

        {active.length === 0 && !adding && <p className="text-sm text-muted">{emptyQuit}</p>}
        {active.map((view) => (
          <HabitCard key={view.habit.id} view={view} />
        ))}

        {archived.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm text-muted">보관한 항목 {archived.length}개</summary>
            <div className="mt-3 flex flex-col gap-3">
              {archived.map((view) => (
                <HabitCard key={view.habit.id} view={view} />
              ))}
            </div>
          </details>
        )}
      </section>

      <WishlistSection summary={wishlist} />
    </div>
  )
}
