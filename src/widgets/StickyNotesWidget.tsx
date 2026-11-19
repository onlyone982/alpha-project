import { emptyNotes } from '../content/memes'
import { useNotes } from '../data/notesRepo'
import { NoteCard } from './notes/NoteCard'
import { QuickNoteForm } from './notes/QuickNoteForm'

const WIDGET_LIMIT = 4

/** 메인 화면 좌측 중간: 고정한 메모 + 최근 메모 */
export function StickyNotesWidget() {
  const { notes, loading } = useNotes()
  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>

  const shown = notes.slice(0, WIDGET_LIMIT)
  return (
    <div className="flex flex-col gap-3">
      {notes.length === 0 ? (
        <p className="text-sm text-muted">{emptyNotes}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {shown.map((note) => (
            <NoteCard key={note.id} note={note} compact />
          ))}
        </div>
      )}
      {notes.length > WIDGET_LIMIT && <p className="text-xs text-muted">+ {notes.length - WIDGET_LIMIT}개 더 (전체 보기)</p>}
      <QuickNoteForm count={notes.length} />
    </div>
  )
}
