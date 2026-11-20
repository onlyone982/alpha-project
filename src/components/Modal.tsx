import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** 화면 가운데 창. Esc 나 바깥을 누르면 닫힘 */
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-bg p-5 glow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="px-2 text-muted hover:text-text">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
