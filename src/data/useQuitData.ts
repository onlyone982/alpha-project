import { useMemo } from 'react'
import { computeHabitStats, sumSavings, type Habit, type HabitStats, type Relapse } from '../lib/habits'
import { summarizeWishlist, type WishlistSummary } from '../lib/wishlist'
import { useHabits, useRelapses } from './habitsRepo'
import { useWishlist } from './wishlistRepo'

export type HabitView = { habit: Habit; relapses: Relapse[]; stats: HabitStats }

export type QuitData = {
  loading: boolean
  active: HabitView[]
  archived: HabitView[]
  /** 보관한 항목 포함 전체 아낀 돈/시간 */
  totals: { money: number; minutes: number }
  wishlist: WishlistSummary
}

/** 끊기 카운터 화면에 필요한 모든 값. now 가 바뀌면 다시 계산 */
export function useQuitData(now: Date): QuitData {
  const { habits, loading: habitsLoading } = useHabits()
  const relapseMap = useRelapses(habits.map((h) => h.id))
  const { items, loading: wishLoading } = useWishlist()

  return useMemo(() => {
    const views = habits.map((habit) => {
      const relapses = relapseMap[habit.id] ?? []
      return { habit, relapses, stats: computeHabitStats(habit, relapses, now) }
    })
    const totals = sumSavings(views.map((v) => v.stats))
    // 실패 기록이 아직 안 들어온 항목이 있으면 로딩 중 (없는 채로 계산하면 최장 기록이 부풀려짐)
    const relapsesLoading = habits.some((h) => !(h.id in relapseMap))
    return {
      loading: habitsLoading || wishLoading || relapsesLoading,
      active: views.filter((v) => !v.habit.archived),
      archived: views.filter((v) => v.habit.archived),
      totals,
      wishlist: summarizeWishlist(items, totals.money),
    }
  }, [habits, relapseMap, items, now, habitsLoading, wishLoading])
}
