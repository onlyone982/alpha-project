import { useEffect, useState } from 'react'
import { useStore } from './DataStoreContext'
import type { DataStore, DocData, StoredDoc, Where } from './store'

type Loaded<T> = { store: DataStore; path: string; value: T }

/**
 * 컬렉션 실시간 구독. path 가 null 이면 구독하지 않음.
 * where 를 주면 field == value 인 문서만.
 */
export function useCollection(path: string | null, where?: Where): { docs: StoredDoc[]; loading: boolean } {
  const store = useStore()
  const [loaded, setLoaded] = useState<Loaded<StoredDoc[]> | null>(null)
  const field = where?.field
  const value = where?.value
  const key = path === null ? null : `${path}?${field ?? ''}=${String(value ?? '')}`

  useEffect(() => {
    if (!store || path === null || key === null) return
    const onChange = (docs: StoredDoc[]) => setLoaded({ store, path: key, value: docs })
    const onError = (error: Error) => {
      console.error(`'${key}' 를 불러오지 못했어요`, error)
      setLoaded({ store, path: key, value: [] })
    }
    return field !== undefined && value !== undefined
      ? store.subscribeWhere(path, { field, value }, onChange, onError)
      : store.subscribeCollection(path, onChange, onError)
  }, [store, path, key, field, value])

  if (!store || key === null) return { docs: EMPTY, loading: false }
  if (!loaded || loaded.store !== store || loaded.path !== key) return { docs: EMPTY, loading: true }
  return { docs: loaded.value, loading: false }
}

/** 문서 실시간 구독. '' 는 users/{uid} 문서 */
export function useDoc(path: string | null): { data: DocData | null; loading: boolean } {
  const store = useStore()
  const [loaded, setLoaded] = useState<Loaded<DocData | null> | null>(null)

  useEffect(() => {
    if (!store || path === null) return
    return store.subscribeDoc(
      path,
      (data) => setLoaded({ store, path, value: data }),
      (error) => {
        console.error(`'${path}' 를 불러오지 못했어요`, error)
        setLoaded({ store, path, value: null })
      },
    )
  }, [store, path])

  if (!store || path === null) return { data: null, loading: false }
  if (!loaded || loaded.store !== store || loaded.path !== path) return { data: null, loading: true }
  return { data: loaded.value, loading: false }
}

const EMPTY: StoredDoc[] = []
