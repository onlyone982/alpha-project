import { useState } from 'react'
import { ui } from '../../components/ui'
import { SEED_QUOTES } from '../../content/quotes'
import { useStore } from '../../data/DataStoreContext'
import { addQuote, removeQuote, updateMotto, useDailyQuote, useUserQuotes } from '../../data/quotesRepo'
import { useToday } from '../../hooks/useToday'
import { useUserProfile } from '../../hooks/useUserProfile'

/** 좌우명 수정 + 내 명언 관리 */
export function QuoteDetail() {
  const store = useStore()
  const todayKey = useToday()
  const { profile, loading } = useUserProfile()
  const { quotes } = useUserQuotes()
  const today = useDailyQuote(todayKey)

  if (!store || loading) return <p className="text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col gap-6">
      <MottoForm key={profile?.motto ?? ''} initial={profile?.motto ?? ''} onSave={(m) => updateMotto(store, m)} />

      {today && (
        <section className={ui.card}>
          <p className="text-xs text-muted">오늘의 명언</p>
          <p className="mt-1 leading-relaxed">“{today.text}”</p>
          <p className="mt-1 text-xs text-muted">— {today.author}</p>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">💬 내가 추가한 명언</h2>
        <AddQuoteForm onAdd={(text, author) => addQuote(store, text, author)} />
        {quotes.length === 0 && <p className="text-sm text-muted">기본 명언 {SEED_QUOTES.length}개와 섞여서 하루 1개씩 나와요.</p>}
        <ul className="flex flex-col gap-2">
          {quotes.map((q) => (
            <li key={q.id} className={`${ui.card} flex items-start justify-between gap-3 p-3`}>
              <div>
                <p className="text-sm">“{q.text}”</p>
                {q.author && <p className="mt-0.5 text-xs text-muted">— {q.author}</p>}
              </div>
              <button
                type="button"
                className="shrink-0 text-xs text-muted hover:text-danger"
                onClick={() => {
                  if (window.confirm('이 명언을 지울까요?')) removeQuote(store, q.id)
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function MottoForm({ initial, onSave }: { initial: string; onSave: (motto: string) => Promise<void> }) {
  const [motto, setMotto] = useState(initial)
  const [saving, setSaving] = useState(false)
  const changed = motto.trim() !== initial

  return (
    <form
      className={`${ui.card} flex flex-col gap-2`}
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        await onSave(motto.trim())
        setSaving(false)
      }}
    >
      <label>
        <span className={ui.label}>내 좌우명 (메인에 항상 보여요)</span>
        <input className={ui.input} value={motto} maxLength={80} placeholder="예: 조용히 하고, 결과로 말하자." onChange={(e) => setMotto(e.target.value)} />
      </label>
      <button type="submit" className={`${ui.buttonPrimary} self-start`} disabled={!changed || saving}>
        {changed ? '저장' : '저장됨'}
      </button>
    </form>
  )
}

function AddQuoteForm({ onAdd }: { onAdd: (text: string, author: string) => Promise<unknown> }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  return (
    <form
      className={`${ui.card} grid gap-2 sm:grid-cols-[1fr_10rem_auto] sm:items-end`}
      onSubmit={async (e) => {
        e.preventDefault()
        if (!text.trim()) return
        await onAdd(text.trim(), author.trim())
        setText('')
        setAuthor('')
      }}
    >
      <label>
        <span className={ui.label}>명언</span>
        <input className={ui.input} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        <span className={ui.label}>누가 (선택)</span>
        <input className={ui.input} value={author} onChange={(e) => setAuthor(e.target.value)} />
      </label>
      <button type="submit" className={ui.button} disabled={!text.trim()}>
        추가
      </button>
    </form>
  )
}
