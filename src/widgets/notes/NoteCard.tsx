import { useState } from 'react'
import { NOTE_COLORS, noteBg } from '../../content/noteColors'
import { useStore } from '../../data/DataStoreContext'
import { removeNote, updateNote, type Note } from '../../data/notesRepo'

/** 포스트잇 한 장. 누르면 편집 */
export function NoteCard({ note, compact = false }: { note: Note; compact?: boolean }) {
  const store = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note.text)

  if (!store) return null

  const style = { backgroundColor: noteBg(note.color) }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg p-2 text-black shadow" style={style}>
        <textarea
          className="min-h-24 w-full resize-y rounded bg-white/40 p-2 text-sm text-black placeholder:text-black/50 focus:outline-none"
          value={draft}
          autoFocus
          aria-label="메모 내용"
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-1">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-label={`${c.label}색`}
              aria-pressed={note.color === c.key}
              className={`size-5 rounded-full border ${note.color === c.key ? 'border-black' : 'border-black/20'}`}
              style={{ backgroundColor: c.bg }}
              onClick={() => updateNote(store, note.id, { color: c.key })}
            />
          ))}
          <span className="ml-auto flex gap-1 text-xs">
            <button
              type="button"
              className="rounded px-1.5 py-0.5 hover:bg-black/10"
              onClick={() => {
                if (window.confirm('이 메모를 지울까요?')) removeNote(store, note.id)
              }}
            >
              삭제
            </button>
            <button
              type="button"
              className="rounded bg-black/80 px-2 py-0.5 font-semibold text-white"
              onClick={async () => {
                if (draft.trim() !== note.text) await updateNote(store, note.id, { text: draft.trim() })
                setEditing(false)
              }}
            >
              완료
            </button>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-lg p-3 text-black shadow" style={style}>
      <button
        type="button"
        className={`w-full whitespace-pre-wrap break-words pr-5 text-left text-sm leading-snug ${compact ? 'line-clamp-4' : ''}`}
        onClick={() => {
          setDraft(note.text)
          setEditing(true)
        }}
        aria-label="메모 편집"
      >
        {note.text || <span className="text-black/50">(빈 메모)</span>}
      </button>
      <button
        type="button"
        className={`absolute right-1.5 top-1.5 rounded px-1 text-xs transition-opacity ${
          note.pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 focus:opacity-100'
        }`}
        aria-label={note.pinned ? '고정 해제' : '고정'}
        aria-pressed={note.pinned}
        onClick={() => updateNote(store, note.id, { pinned: !note.pinned })}
      >
        📌
      </button>
    </div>
  )
}
