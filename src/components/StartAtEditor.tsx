import { useState } from 'react'
import { useNow } from '../hooks/useNow'
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
  const now = useNow(30_000)
  const parsed = fromSeoulInput(input)
  // 시작 일시는 지금보다 미래일 수 없음 (분 단위 입력이라 1분 여유)
  const isFuture = parsed !== null && parsed.getTime() > now.getTime() + 60_000

  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!parsed || isFuture) return
        setSaving(true)
        await onSave(parsed)
        setSaving(false)
      }}
    >
      <label className="min-w-56">
        <span className={ui.label}>변하기 시작한 날짜와 시간 (서울)</span>
        <input
          type="datetime-local"
          className={ui.input}
          value={input}
          max={toSeoulInput(now)}
          aria-invalid={isFuture}
          onChange={(e) => setInput(e.target.value)}
        />
      </label>
      <button type="submit" className={ui.buttonPrimary} disabled={!parsed || isFuture || saving}>
        저장
      </button>
      <button type="button" className={ui.button} onClick={onCancel}>
        취소
      </button>
      {isFuture && <p className="w-full text-xs text-danger">시작 일시는 지금보다 늦을 수 없어요.</p>}
    </form>
  )
}
