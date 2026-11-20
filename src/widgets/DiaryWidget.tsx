import { useState } from 'react'
import { DateNav } from '../components/DateNav'
import { ui } from '../components/ui'
import { useStore } from '../data/DataStoreContext'
import { saveDiary, useDiary } from '../data/diaryRepo'
import { useToday } from '../hooks/useToday'

/** 일기장: 날짜별로 길게 쓰는 글 */
export function DiaryWidget() {
  const todayKey = useToday()
  const [dateKey, setDateKey] = useState(todayKey)
  const { text, updatedAt, loading } = useDiary(dateKey)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <DateNav dateKey={dateKey} todayKey={todayKey} onChange={setDateKey} />
      </div>
      {loading ? (
        <p className="text-sm text-muted">불러오는 중…</p>
      ) : (
        <DiaryForm key={`${dateKey}:${updatedAt?.getTime() ?? 0}`} dateKey={dateKey} initial={text} />
      )}
    </div>
  )
}

function DiaryForm({ dateKey, initial }: { dateKey: string; initial: string }) {
  const store = useStore()
  const [text, setText] = useState(initial)
  const [saving, setSaving] = useState(false)
  const changed = text !== initial

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!store) return
        setSaving(true)
        await saveDiary(store, dateKey, text, new Date())
        setSaving(false)
      }}
    >
      <textarea
        className={ui.input + ' min-h-48 resize-y leading-relaxed'}
        value={text}
        placeholder="오늘 있었던 일, 생각, 아무거나."
        aria-label="일기"
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={`${ui.buttonPrimary} self-end`} disabled={!changed || saving}>
        {changed ? '저장' : '저장됨'}
      </button>
    </form>
  )
}
