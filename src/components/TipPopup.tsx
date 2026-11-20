import { useEffect, useMemo, useState } from 'react'
import { HABIT_TIPS, SLOT_INFO } from '../content/habitTips'
import { NOTE_COLORS } from '../content/noteColors'
import { useStore } from '../data/DataStoreContext'
import { useHabits } from '../data/habitsRepo'
import { addNote } from '../data/notesRepo'
import { acceptTip, hideTip, markTipSlotSeen, useTipState } from '../data/tipsRepo'
import { useNow } from '../hooks/useNow'
import { addDaysToKey, formatSeoul, toDayKey } from '../lib/date'
import { slotForHour, slotKey, tipQueue } from '../lib/tips'
import { ui } from './ui'

/**
 * "이런 건 어떠세요?" 화면 가운데 팝업.
 * 아침(05~11시)·점심(11~17시)·저녁(17시~새벽 5시)마다 그 시간대 처음 접속할 때 한 번.
 */
export function TipPopup() {
  const store = useStore()
  const now = useNow(60_000)
  const { state, loading } = useTipState()
  const { habits, loading: habitsLoading } = useHabits()
  const [offset, setOffset] = useState(0)
  const [closedKey, setClosedKey] = useState<string | null>(null)

  const hour = Number(formatSeoul(now, 'H'))
  const dayKey = toDayKey(now)
  const key = slotKey(dayKey, hour, addDaysToKey(dayKey, -1))
  const slot = slotForHour(hour)

  const queue = useMemo(
    () =>
      tipQueue(
        HABIT_TIPS,
        slot,
        key,
        new Set([...state.hidden, ...state.accepted]),
        habits.filter((h) => !h.archived).map((h) => h.name),
      ),
    [slot, key, state.hidden, state.accepted, habits],
  )

  const open = !!store && !loading && !habitsLoading && !state.seen[key] && closedKey !== key && queue.length > 0
  const tip = open ? queue[offset % queue.length] : null

  const close = () => {
    setClosedKey(key)
    if (store) markTipSlotSeen(store, key)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setClosedKey(key)
      if (store) markTipSlotSeen(store, key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, key, store])

  if (!tip || !store) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="이런 건 어떠세요?"
        className="ticker-in glow-soft relative w-full max-w-sm rounded-3xl border border-line bg-bg p-6 text-center"
      >
        <button type="button" onClick={close} aria-label="닫기" className="absolute right-4 top-3 px-1 text-muted hover:text-text">
          ✕
        </button>
        <p className="text-xs text-muted">
          {SLOT_INFO[slot].greeting} · {SLOT_INFO[slot].label} 추천
        </p>
        <p className="mt-1 text-sm font-semibold text-accent">💡 이런 건 어떠세요?</p>
        <p className="mt-5 text-5xl" aria-hidden>
          {tip.emoji}
        </p>
        <p key={tip.id} className="ticker-in mt-4 text-lg font-bold leading-snug">
          {tip.text}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={ui.buttonPrimary + ' py-3'}
            onClick={async () => {
              const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].key
              await addNote(store, `${tip.emoji} ${tip.note}`, color)
              await acceptTip(store, state, tip.id)
              close()
            }}
          >
            좋아요, 메모에 붙일게
          </button>
          <button type="button" className={ui.button + ' py-3'} onClick={() => setOffset((o) => o + 1)} disabled={queue.length < 2}>
            다른 거
          </button>
        </div>
        <button
          type="button"
          className="mt-3 text-xs text-muted hover:text-text"
          onClick={async () => {
            await hideTip(store, state, tip.id)
            // 숨긴 추천이 빠지면 같은 자리에 다음 추천이 오므로 offset 은 그대로
          }}
        >
          이건 관심 없음 (다시 추천 안 함)
        </button>
      </div>
    </div>
  )
}
