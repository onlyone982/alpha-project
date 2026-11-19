import { useState } from 'react'
import { createPortal } from 'react-dom'
import { SosOverlay } from './SosOverlay'

/** SOS 버튼 + 전체 화면. habitId 를 주면 그 항목으로 바로 시작 */
export function SosButton({ variant = 'hero', habitId }: { variant?: 'hero' | 'small'; habitId?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'hero'
            ? 'whitespace-nowrap rounded-xl bg-danger px-5 py-3 text-base font-bold text-white transition-transform hover:scale-105 active:scale-95'
            : 'whitespace-nowrap rounded-lg border border-danger/50 px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger/10'
        }
      >
        🆘 SOS
      </button>
      {open && createPortal(<SosOverlay initialHabitId={habitId} onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}
