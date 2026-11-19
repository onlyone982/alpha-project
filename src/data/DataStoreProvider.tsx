import { useMemo, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { firebase } from '../lib/firebase'
import { DataStoreContext } from './DataStoreContext'
import { createFirestoreStore } from './firestoreStore'
import { createMemoryStore } from './memoryStore'
import { createPreviewSeed } from './previewSeed'

/** 미리보기 저장소: 지금 시각 기준 예시 데이터로 채움 */
const createPreviewStore = () => createMemoryStore(createPreviewSeed(new Date()))

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const { status, user, isPreview } = useAuth()
  const uid = user?.uid ?? null

  const store = useMemo(() => {
    if (isPreview) return createPreviewStore()
    if (firebase && uid && status === 'ready') return createFirestoreStore(firebase.db, uid)
    return null
  }, [isPreview, uid, status])

  return <DataStoreContext.Provider value={store}>{children}</DataStoreContext.Provider>
}
