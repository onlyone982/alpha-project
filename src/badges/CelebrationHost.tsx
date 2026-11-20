import confetti from 'canvas-confetti'
import { useEffect, useMemo } from 'react'
import { ui } from '../components/ui'
import { useStore } from '../data/DataStoreContext'
import { markBadgesSeen } from '../data/badgesRepo'
import { Sensitive } from '../privacy/Sensitive'
import { useBadges } from './BadgeContext'

/** 새로 받은 배지(아직 안 본 것)를 하나씩 전체 화면으로 축하 */
export function CelebrationHost() {
  const store = useStore()
  const { statuses, earned } = useBadges()

  const queue = useMemo(() => {
    const byKey = new Map(statuses.map((s) => [s.key, s]))
    return [...earned.values()]
      .filter((e) => !e.seen)
      .sort((a, b) => a.earnedAt.getTime() - b.earnedAt.getTime())
      .map((e) => ({ earned: e, status: byKey.get(e.key) ?? null }))
  }, [statuses, earned])

  const current = queue[0] ?? null
  const currentKey = current?.earned.key

  // 정의가 사라진 배지 등 보여줄 수 없는 건 조용히 확인 처리
  useEffect(() => {
    if (store && current && !current.status) markBadgesSeen(store, [current.earned.key])
  }, [store, current])

  useEffect(() => {
    if (!currentKey) return
    confetti({ particleCount: 140, spread: 85, origin: { y: 0.55 }, disableForReducedMotion: true, zIndex: 60 })
  }, [currentKey])

  if (!store || !current?.status) return null
  const { status } = current
  const remaining = queue.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="배지 획득">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold tracking-widest text-accent">BADGE UNLOCKED</p>
        <span className="badge-pop text-8xl" aria-hidden>
          {status.def.emoji}
        </span>
        <h2 className="text-3xl font-black">
          <Sensitive when={status.habit?.isSensitive ?? false}>{status.title}</Sensitive>
        </h2>
        <p className="text-muted">{status.def.meme}</p>
        <div className="mt-2 flex flex-col items-center gap-2">
          <button type="button" className={`${ui.buttonPrimary} px-8 py-3 text-base`} autoFocus onClick={() => markBadgesSeen(store, [current.earned.key])}>
            {remaining > 0 ? `계속하기 (${remaining}개 더)` : '계속하기'}
          </button>
          {remaining > 0 && (
            <button type="button" className="text-sm text-muted hover:text-text" onClick={() => markBadgesSeen(store, queue.map((q) => q.earned.key))}>
              나머지 한 번에 확인
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
