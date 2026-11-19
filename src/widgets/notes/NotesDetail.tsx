import { emptyNotes } from '../../content/memes'
import { useNotes } from '../../data/notesRepo'
import { NoteCard } from './NoteCard'
import { QuickNoteForm } from './QuickNoteForm'

/** 스티커 메모 전체 */
export function NotesDetail() {
  const { notes, loading } = useNotes()
  if (loading) return <p className="text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col gap-4">
      <QuickNoteForm count={notes.length} />
      <p className="text-xs text-muted">메모를 누르면 편집 · 색 변경 · 삭제, 📌로 고정 (고정한 메모가 메인에 먼저 나와요)</p>
      {notes.length === 0 && <p className="text-sm text-muted">{emptyNotes}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
