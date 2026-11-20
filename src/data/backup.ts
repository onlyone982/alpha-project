import { toJsonSafe } from '../lib/backup'
import type { DataStore, DocData, StoredDoc } from './store'

/** 백업에 넣을 컬렉션 (users/{uid} 아래) */
const COLLECTIONS = [
  'habits',
  'sosEvents',
  'wishlist',
  'todos',
  'journal',
  'activityDays',
  'notes',
  'videos',
  'quotes',
  'styleLogs',
  'diary',
  'treeWaterings',
]

function readOnce<T>(subscribe: (onData: (value: T) => void, onError: (e: Error) => void) => () => void): Promise<T> {
  return new Promise((resolve, reject) => {
    let off: (() => void) | null = null
    let done = false
    off = subscribe(
      (value) => {
        if (done) return
        done = true
        queueMicrotask(() => off?.())
        resolve(value)
      },
      (error) => {
        if (!done) reject(error)
      },
    )
  })
}

const readCollection = (store: DataStore, path: string) =>
  readOnce<StoredDoc[]>((onData, onError) => store.subscribeCollection(path, onData, onError))

/** 내 데이터 전체를 JSON 으로 */
export async function exportAll(store: DataStore): Promise<string> {
  const profile = await readOnce<DocData | null>((onData, onError) => store.subscribeDoc('', onData, onError))
  const data: Record<string, unknown> = { profile }
  for (const name of COLLECTIONS) data[name] = await readCollection(store, name)

  // 끊기 항목별 실패 기록
  const relapses: Record<string, StoredDoc[]> = {}
  for (const habit of data.habits as StoredDoc[]) relapses[habit.id] = await readCollection(store, `habits/${habit.id}/relapses`)
  data.relapses = relapses

  return JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, data: toJsonSafe(data) }, null, 2)
}
