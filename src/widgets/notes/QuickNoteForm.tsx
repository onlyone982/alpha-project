import { useState } from 'react'
import { ui } from '../../components/ui'
import { NOTE_COLORS } from '../../content/noteColors'
import { useStore } from '../../data/DataStoreContext'
import { addNote } from '../../data/notesRepo'

/** 메모 빠르게 붙이기 (색은 돌아가면서) */
export function QuickNoteForm({ count }: { count: number }) {
  const store = useStore()
  const [text, setText] = useState('')
  if (!store) return null

  return (
    <form
      className="flex gap-2 @max-3xs:flex-col"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!text.trim()) return
        const color = NOTE_COLORS[count % NOTE_COLORS.length].key
        await addNote(store, text.trim(), color)
        setText('')
      }}
    >
      <input className={ui.input} value={text} placeholder="+ 메모 붙이기" aria-label="새 메모" onChange={(e) => setText(e.target.value)} />
      <button type="submit" className={ui.button} disabled={!text.trim()}>
        붙이기
      </button>
    </form>
  )
}
