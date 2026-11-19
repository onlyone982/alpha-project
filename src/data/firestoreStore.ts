import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  type Firestore,
} from 'firebase/firestore'
import type { DataStore } from './store'

/** Firestore 의 users/{uid} 아래를 읽고 쓰는 저장소 */
export function createFirestoreStore(db: Firestore, uid: string): DataStore {
  const segments = (path: string) => (path ? path.split('/') : [])
  const docRef = (path: string) => doc(db, 'users', uid, ...segments(path))
  const colRef = (path: string) => collection(db, 'users', uid, ...segments(path))

  return {
    subscribeDoc(docPath, onChange, onError) {
      return onSnapshot(docRef(docPath), (snap) => onChange(snap.exists() ? snap.data() : null), onError)
    },
    subscribeCollection(collectionPath, onChange, onError) {
      return onSnapshot(
        colRef(collectionPath),
        (snap) => onChange(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
        onError,
      )
    },
    async add(collectionPath, data) {
      const ref = await addDoc(colRef(collectionPath), data)
      return ref.id
    },
    async update(docPath, data) {
      await updateDoc(docRef(docPath), data)
    },
    async remove(docPath) {
      await deleteDoc(docRef(docPath))
    },
  }
}
