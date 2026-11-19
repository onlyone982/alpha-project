import { useState } from 'react'
import { fromSeoulInput, toSeoulInput } from '../lib/date'
import { ui } from './ui'

/** 변하기 시작한 날짜/시간 수정 폼 */
export function StartAtEditor({
  value,
  onSave,
  onCancel,
}: {
  value: Date | null
  onSave: (date: Date) => Promise<void> | void
  onCancel: () => void
}) {
  const [input, setInput] = useState(() => toSeoulInput(value ?? new Date()))
  const [saving, setSaving] = useState(false)
  const parsed = fromSeoulInput(input)

  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!parsed) return
        setSaving(true)
        await onSave(parsed)
        setSaving(false)
      }}
    >
      <label className="min-w-56">
        <span className={ui.label}>변하기 시작한 날짜와 시간 (서울)</span>
        <input type="datetime-local" className={ui.input} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <button type="submit" className={ui.buttonPrimary} disabled={!parsed || saving}>
        저장
      </button>
      <button type="button" className={ui.button} onClick={onCancel}>
        취소
      </button>
    </form>
  )
}
