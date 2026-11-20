import { useEffect, useMemo, useState } from 'react'
import { useStreak } from '../../data/activityRepo'
import { useQuitData } from '../../data/useQuitData'
import { useNow } from '../../hooks/useNow'
import { recentAchievements } from '../../lib/achievements'
import { toDayKey } from '../../lib/date'
import { usePrivacy } from '../../privacy/PrivacyContext'

/**
 * 하단 가운데 달성 소식 한 줄. 최근 7일 소식을 5초마다 돌아가며 보여줌.
 * (나중에 커뮤니티가 생기면 다른 사람 소식이 여기에 실시간으로 올라올 자리)
 */
export function AchievementTicker() {
  const now = useNow(60_000)
  const todayKey = toDayKey(now)
  const quit = useQuitData(now)
  const { current: streakCurrent, todayRecorded } = useStreak(todayKey)
  const { privacy } = usePrivacy()
  const [index, setIndex] = useState(0)

  const items = useMemo(() => {
    const list = recentAchievements({
      todayKey,
      habits: quit.active.map(({ habit, stats }) => ({
        id: habit.id,
        name: habit.name,
        emoji: habit.emoji,
        isSensitive: habit.isSensitive,
        since: new Date(now.getTime() - stats.currentStreakMs),
        currentStreakDays: stats.currentStreakDays,
      })),
      recordStreak: { current: streakCurrent, todayRecorded },
    })
    return privacy ? list.filter((a) => !a.sensitive) : list
  }, [todayKey, quit.active, streakCurrent, todayRecorded, privacy, now])

  useEffect(() => {
    if (items.length < 2) return
    const id = window.setInterval(() => setIndex((i) => i + 1), 5000)
    return () => window.clearInterval(id)
  }, [items.length])

  const item = items.length ? items[index % items.length] : null

  return (
    <p className="w-full truncate border border-line px-3 py-2 text-center text-sm" aria-live="polite">
      {item ? <span key={item.key} className="ticker-in inline-block">나: {item.text}</span> : <span className="text-muted">이번 주 달성 소식이 여기에 올라와요.</span>}
    </p>
  )
}
