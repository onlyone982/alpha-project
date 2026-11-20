import { useMemo } from 'react'
import { useNow } from '../hooks/useNow'
import { useUserProfile } from '../hooks/useUserProfile'
import { evaluateBadges, type BadgeInputs, type BadgeStatus } from '../lib/badges'
import { toDayKey } from '../lib/date'
import { dayNumber } from '../lib/dayCounter'
import { useStreak } from './activityRepo'
import { useEarnedBadges, type EarnedBadge } from './badgesRepo'
import { useCollection } from './hooks'
import { useSosWins } from './sosRepo'
import { asString } from './store'
import { useQuitData } from './useQuitData'

export type BadgeState = {
  /** 하나라도 아직 불러오는 중이면 true → 이때는 판정하지 않음 */
  loading: boolean
  statuses: BadgeStatus[]
  earned: Map<string, EarnedBadge>
}

/** 모든 배지의 현재 상태 + 받은 배지. 1분마다 다시 계산 (시간이 지나면 받는 끊기 배지 때문) */
export function useBadgeStatus(): BadgeState {
  const now = useNow(60_000)
  const todayKey = toDayKey(now)
  const quit = useQuitData(now)
  const streak = useStreak(todayKey)
  const { current: streakCurrent, longest: streakLongest } = streak
  const sos = useSosWins()
  const journal = useCollection('journal')
  const { profile, loading: profileLoading } = useUserProfile()
  const { earned, loading: earnedLoading } = useEarnedBadges()

  const loading = quit.loading || streak.loading || sos.loading || journal.loading || profileLoading || earnedLoading

  const statuses = useMemo(() => {
    const inputs: BadgeInputs = {
      recordStreak: { current: streakCurrent, longest: streakLongest },
      habits: [...quit.active, ...quit.archived].map(({ habit, stats }) => ({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        isSensitive: habit.isSensitive,
        archived: habit.archived,
        currentStreakDays: stats.currentStreakDays,
        longestStreakDays: stats.longestStreakDays,
        cleanDays: stats.cleanDays,
      })),
      sosWins: sos.wins,
      journalCount: journal.docs.filter((d) => asString(d.text).trim() || d.mood).length,
      totalSaved: quit.totals.money,
      purchasedWishes: quit.wishlist.purchased.length,
      dayNumber: profile?.startAt ? dayNumber(profile.startAt, now) : 0,
    }
    return evaluateBadges(inputs)
  }, [quit, streakCurrent, streakLongest, sos.wins, journal.docs, profile, now])

  return { loading, statuses, earned }
}
