/** 0~1 진행률 막대 */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-surface-2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
    >
      <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${percent}%` }} />
    </div>
  )
}
