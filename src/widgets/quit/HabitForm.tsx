import { useState } from 'react'
import { ui } from '../../components/ui'
import { HABIT_PRESETS } from '../../content/habitPresets'
import type { HabitInput } from '../../data/habitsRepo'
import { useNow } from '../../hooks/useNow'
import { fromSeoulInput, toSeoulInput } from '../../lib/date'

/** 끊기 항목 추가/수정 폼 */
export function HabitForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: HabitInput
  submitLabel: string
  onSubmit: (input: HabitInput) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🚫')
  const [startAt, setStartAt] = useState(() => toSeoulInput(initial?.startAt ?? new Date()))
  const [dailyCost, setDailyCost] = useState(String(initial?.dailyCost ?? ''))
  const [dailyMinutes, setDailyMinutes] = useState(String(initial?.dailyMinutes ?? ''))
  const [reason, setReason] = useState(initial?.reason ?? '')
  const [isSensitive, setIsSensitive] = useState(initial?.isSensitive ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const now = useNow(30_000)
  const parsedStart = fromSeoulInput(startAt)
  // 시작 일시는 지금보다 미래일 수 없음 (분 단위 입력이라 1분 여유)
  const startInFuture = parsedStart !== null && parsedStart.getTime() > now.getTime() + 60_000

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('이름을 적어주세요.')
    if (!parsedStart) return setError('시작 일시를 확인해주세요.')
    if (startInFuture) return setError('시작 일시는 지금보다 늦을 수 없어요.')
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        emoji: emoji.trim() || '🚫',
        startAt: parsedStart,
        dailyCost: Math.max(0, Number(dailyCost) || 0),
        dailyMinutes: Math.max(0, Number(dailyMinutes) || 0),
        reason: reason.trim(),
        isSensitive,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${ui.card} flex flex-col gap-3`}>
      {!initial && (
        <div className="flex flex-wrap gap-2">
          {HABIT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={ui.chip + ' hover:bg-surface-2'}
              onClick={() => {
                setName(preset.name)
                setEmoji(preset.emoji)
                setIsSensitive(preset.isSensitive)
              }}
            >
              {preset.emoji} {preset.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[4.5rem_1fr] gap-2">
        <label>
          <span className={ui.label}>이모지</span>
          <input className={ui.input + ' text-center'} value={emoji} maxLength={4} onChange={(e) => setEmoji(e.target.value)} />
        </label>
        <label>
          <span className={ui.label}>이름</span>
          <input className={ui.input} value={name} placeholder="예: 금연" onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <label>
        <span className={ui.label}>시작 일시 (서울)</span>
        <input
          type="datetime-local"
          className={ui.input}
          value={startAt}
          max={toSeoulInput(now)}
          aria-invalid={startInFuture}
          onChange={(e) => setStartAt(e.target.value)}
        />
        {startInFuture && <span className="mt-1 block text-xs text-danger">시작 일시는 지금보다 늦을 수 없어요.</span>}
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label>
          <span className={ui.label}>하루 평균 비용 (원)</span>
          <input type="number" inputMode="numeric" min={0} className={ui.input} value={dailyCost} placeholder="4500" onChange={(e) => setDailyCost(e.target.value)} />
        </label>
        <label>
          <span className={ui.label}>하루 평균 시간 (분)</span>
          <input type="number" inputMode="numeric" min={0} className={ui.input} value={dailyMinutes} placeholder="30" onChange={(e) => setDailyMinutes(e.target.value)} />
        </label>
      </div>

      <label>
        <span className={ui.label}>내가 끊는 이유 (힘들 때 SOS 화면에 크게 나와요)</span>
        <textarea className={ui.input + ' min-h-20'} value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isSensitive} onChange={(e) => setIsSensitive(e.target.checked)} />
        민감 항목 (프라이버시 모드에서 가리기)
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" className={ui.buttonPrimary} disabled={saving}>
          {submitLabel}
        </button>
        <button type="button" className={ui.button} onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  )
}
