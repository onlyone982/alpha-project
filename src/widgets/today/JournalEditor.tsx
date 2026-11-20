import { useState } from 'react'
import { ui } from '../../components/ui'
import { journalPlaceholder } from '../../content/memes'
import { MOODS } from '../../content/moods'
import { useStore } from '../../data/DataStoreContext'
import { JOURNAL_MAX_LENGTH, saveJournal, useJournal, type JournalEntry } from '../../data/journalRepo'

/** 하루 한 줄 일지 + 기분 */
export function JournalEditor({ dateKey }: { dateKey: string }) {
  const { entry, loading } = useJournal(dateKey)
  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>
  // 날짜나 저장된 내용이 바뀌면 입력칸을 새로 시작
  return <JournalForm key={`${dateKey}:${entry?.updatedAt?.getTime() ?? 0}`} dateKey={dateKey} entry={entry} />
}

function JournalForm({ dateKey, entry }: { dateKey: string; entry: JournalEntry | null }) {
  const store = useStore()
  const [text, setText] = useState(entry?.text ?? '')
  const [mood, setMood] = useState<number | null>(entry?.mood ?? null)
  const [saving, setSaving] = useState(false)

  const changed = text.trim() !== (entry?.text ?? '') || mood !== (entry?.mood ?? null)

  async function save(nextMood = mood) {
    if (!store) return
    setSaving(true)
    await saveJournal(store, dateKey, text, nextMood, new Date())
    setSaving(false)
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <div className="flex flex-wrap items-center gap-1 @max-3xs:gap-0" role="radiogroup" aria-label="오늘 기분">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={mood === m.value}
            aria-label={m.label}
            title={m.label}
            onClick={() => setMood(mood === m.value ? null : m.value)}
            className={`rounded-lg px-1.5 py-0.5 text-xl transition @max-3xs:px-1 @max-3xs:text-lg ${
              mood === m.value ? 'bg-surface-2 ring-1 ring-accent' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      <div className="flex gap-2 @max-3xs:flex-col">
        <input
          className={ui.input}
          value={text}
          maxLength={JOURNAL_MAX_LENGTH}
          placeholder={journalPlaceholder}
          aria-label="한 줄 일지"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={ui.buttonPrimary} disabled={saving || !changed}>
          {entry && !changed ? '저장됨' : '저장'}
        </button>
      </div>
    </form>
  )
}
