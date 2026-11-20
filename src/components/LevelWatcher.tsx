import { useEffect, useState } from 'react'
import { useStreak } from '../data/activityRepo'
import { useStore } from '../data/DataStoreContext'
import { saveLevelSeen } from '../data/profileRepo'
import { useToday } from '../hooks/useToday'
import { useUserProfile } from '../hooks/useUserProfile'
import { levelFor } from '../lib/levels'

/**
 * 레벨이 오르면 화면 위에 짧게 알림 (4초).
 * 처음 쓸 때와 레벨이 내려갈 때는 알림 없이 기록만 맞춰둠.
 */
export function LevelWatcher() {
  const store = useStore()
  const todayKey = useToday()
  const streak = useStreak(todayKey)
  const { profile, loading } = useUserProfile()
  const [toast, setToast] = useState<string | null>(null)
  const { index, level } = levelFor(streak.current)
  const seen = profile?.levelSeen

  useEffect(() => {
    if (!store || loading || streak.loading || !profile || seen === index) return
    if (seen !== null && seen !== undefined && index > seen) {
      const name = level.name
      window.setTimeout(() => setToast(name), 0)
      window.setTimeout(() => setToast(null), 4000)
    }
    saveLevelSeen(store, index)
  }, [store, loading, streak.loading, profile, seen, index, level.name])

  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4" role="status" aria-live="polite">
      <p className="ticker-in border border-accent bg-bg px-5 py-3 text-center shadow-lg">
        <span className="block text-xs tracking-widest text-accent">LEVEL UP</span>
        <span className="text-lg font-black">LV: {toast}</span>
      </p>
    </div>
  )
}
