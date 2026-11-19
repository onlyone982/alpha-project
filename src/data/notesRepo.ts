import { useMemo } from 'react'
import { useCollection } from './hooks'
import { asBool, asString, toDate, type DataStore, type StoredDoc } from './store'

export type Note = { id: string; text: string; color: string; pinned: boolean; updatedAt: Date }

export function parseNote(doc: StoredDoc): Note {
  return {
    id: doc.id,
    text: asString(doc.text),
    color: asString(doc.color, 'yellow'),
    pinned: asBool(doc.pinned),
    updatedAt: toDate(doc.updatedAt) ?? new Date(0),
  }
}

/** 메모: 고정한 것 먼저, 그다음 최근 수정 순 */
export function useNotes(): { notes: Note[]; loading: boolean } {
  const { docs, loading } = useCollection('notes')
  const notes = useMemo(
    () =>
      docs
        .map(parseNote)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.getTime() - a.updatedAt.getTime()),
    [docs],
  )
  return { notes, loading }
}

export function addNote(store: DataStore, text: string, color: string) {
  return store.add('notes', { text, color, pinned: false, updatedAt: new Date() })
}

export function updateNote(store: DataStore, id: string, data: Partial<Pick<Note, 'text' | 'color' | 'pinned'>>) {
  return store.update(`notes/${id}`, { ...data, updatedAt: new Date() })
}

export function removeNote(store: DataStore, id: string) {
  return store.remove(`notes/${id}`)
}
