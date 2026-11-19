import type { ReactNode } from 'react'

/** 아직 구현 전인 위젯 자리 표시. 각 단계에서 실제 위젯으로 교체됩니다. */
export function WidgetPlaceholder({ step, children }: { step: number; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <p className="text-sm leading-relaxed text-muted">{children}</p>
      <span className="self-start rounded-full border border-line px-2 py-0.5 text-xs text-muted">
        {step}단계에서 구현
      </span>
    </div>
  )
}
