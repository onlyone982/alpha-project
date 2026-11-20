import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Modal } from '../components/Modal'
import { ui } from '../components/ui'
import { useLayout } from '../hooks/useLayout'
import { isFixedSlot, libraryIds, placeWidget, SLOT_INFO, SLOTS, type SlotId } from '../lib/layout'
import { getWidget, WIDGETS } from './registry'
import type { WidgetDefinition } from './types'

/**
 * 오른쪽 아래 (고정): 위젯 라이브러리.
 * 화면에 안 놓인 위젯이 아이콘으로 모여 있고, 눌러서 열거나 원하는 칸에 넣을 수 있음.
 */
export function LibraryWidget() {
  const { layout } = useLayout()
  const [selected, setSelected] = useState<WidgetDefinition | null>(null)
  const items = libraryIds(layout, WIDGETS.map((w) => w.id))
    .map(getWidget)
    .filter((w) => w !== undefined)

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted">모든 위젯이 화면에 나와 있어요.</p>
      ) : (
        <ul className="grid grid-cols-4 gap-3">
          {items.map((w) => (
            <li key={w.id}>
              <button type="button" onClick={() => setSelected(w)} className="group flex w-full flex-col items-center gap-1">
                <span className="flex aspect-square w-full max-w-14 items-center justify-center rounded-2xl border border-line bg-surface text-2xl transition-colors group-hover:border-accent">
                  {w.emoji}
                </span>
                <span className="w-full truncate text-center text-[11px] text-muted group-hover:text-text">{w.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && <LibrarySheet widget={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function LibrarySheet({ widget, onClose }: { widget: WidgetDefinition; onClose: () => void }) {
  const navigate = useNavigate()
  const { layout, save } = useLayout()
  const [mode, setMode] = useState<'menu' | 'open' | 'place'>('menu')
  const Body = widget.component

  function open() {
    if (widget.open?.kind === 'link') {
      window.open(widget.open.url, '_blank', 'noopener,noreferrer')
      onClose()
    } else if (widget.open?.kind === 'modal' || !widget.detail) {
      setMode('open')
    } else {
      navigate(`/w/${widget.id}`)
    }
  }

  async function place(slot: SlotId) {
    await save(placeWidget(layout, widget.id, slot))
    onClose()
  }

  return (
    <Modal title={`${widget.emoji} ${widget.title}`} onClose={onClose}>
      {mode === 'menu' && (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={ui.button + ' py-3'} onClick={open}>
            열기
          </button>
          <button type="button" className={ui.buttonPrimary + ' py-3'} onClick={() => setMode('place')}>
            화면에 넣기
          </button>
        </div>
      )}

      {mode === 'open' && <Body />}

      {mode === 'place' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">넣을 칸을 고르세요. 원래 있던 위젯은 라이브러리로 돌아가요.</p>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {SLOTS.map((slot) => {
              const fixed = isFixedSlot(slot)
              const current = getWidget(layout[slot])
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={fixed}
                  onClick={() => place(slot)}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-0.5 bg-bg p-1 text-center transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`${SLOT_INFO[slot].label}${current ? ` (지금: ${current.title})` : ' (빈 칸)'}`}
                >
                  <span className="text-lg">{current?.emoji ?? '＋'}</span>
                  <span className="text-[10px] leading-tight text-muted">{fixed ? '고정' : (current?.title ?? '빈 칸')}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </Modal>
  )
}
