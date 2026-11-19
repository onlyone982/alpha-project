import { useState } from 'react'
import { ui } from '../../components/ui'
import { fromSeoulInput, toSeoulInput } from '../../lib/date'
import { checkRelapseTime, type Habit } from '../../lib/habits'

/** 실패 기록 폼. 기존 기록은 지우지 않고 실패 로그만 추가합니다. */
export function RelapseForm({
  habit,
  onSubmit,
  onCancel,
}: {
  habit: Habit
  onSubmit: (at: Date, note: string) => Promise<void>
  onCancel: () => void
}) {
  const [at, setAt] = useState(() => toSeoulInput(new Date()))
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = fromSeoulInput(at)
    if (!parsed) return setError('시각을 확인해주세요.')
    const check = checkRelapseTime(habit, parsed, new Date())
    if (!check.ok) return setError(check.reason)
    setSaving(true)
    try {
      await onSubmit(parsed, note.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 rounded-xl bg-surface-2 p-3">
      <p className="text-sm">괜찮아. 기록만 남기자. 지금까지의 기록은 안 사라져.</p>
      <label>
        <span className={ui.label}>언제</span>
        <input type="datetime-local" className={ui.input} value={at} onChange={(e) => setAt(e.target.value)} />
      </label>
      <label>
        <span className={ui.label}>무엇이 계기였는지 (선택)</span>
        <input className={ui.input} value={note} placeholder="예: 회식, 스트레스, 심심해서" onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className={ui.buttonDanger} disabled={saving}>
          실패 기록하기
        </button>
        <button type="button" className={ui.button} onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  )
}
