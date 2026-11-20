import { ProgressBar } from '../components/ProgressBar'
import { formatSeoul } from '../lib/date'
import { remainingText, type BadgeStatus } from '../lib/badges'
import { Sensitive } from '../privacy/Sensitive'

/** 배지 한 칸. 받은 배지는 색, 못 받은 배지는 실루엣 + 진행률 */
export function BadgeTile({ status, earnedAt }: { status: BadgeStatus; earnedAt: Date | null }) {
  const earned = earnedAt !== null
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center ${
        earned ? 'border-accent/40 bg-accent/5' : 'border-line bg-surface'
      }`}
    >
      <span className={`text-3xl ${earned ? '' : 'opacity-25 brightness-0 invert'}`} aria-hidden>
        {status.def.emoji}
      </span>
      <span className={`text-xs font-semibold ${earned ? '' : 'text-muted'}`}>
        <Sensitive when={status.habit?.isSensitive ?? false}>{status.title}</Sensitive>
      </span>
      {earned ? (
        <span className="text-[10px] text-muted tabular-nums">{formatSeoul(earnedAt, 'yyyy.MM.dd')}</span>
      ) : (
        <span className="flex w-full flex-col gap-1">
          <ProgressBar value={status.current / status.target} label={`${status.title} 진행률`} />
          <span className="text-[10px] text-muted">{remainingText(status)}</span>
        </span>
      )}
    </div>
  )
}
