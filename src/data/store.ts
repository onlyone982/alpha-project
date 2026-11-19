/**
 * 데이터 저장소 인터페이스.
 * 경로는 모두 users/{uid} 아래 기준입니다. 예: 'habits', 'habits/abc/relapses'. 빈 문자열('')은 users/{uid} 문서 자체.
 * Firebase 구현(firestoreStore)과 미리보기용 메모리 구현(memoryStore)이 같은 인터페이스를 씁니다.
 */
export type DocData = Record<string, unknown>
export type StoredDoc = DocData & { id: string }
export type Unsubscribe = () => void
export type ErrorHandler = (error: Error) => void

export interface DataStore {
  subscribeDoc(docPath: string, onChange: (data: DocData | null) => void, onError?: ErrorHandler): Unsubscribe
  subscribeCollection(collectionPath: string, onChange: (docs: StoredDoc[]) => void, onError?: ErrorHandler): Unsubscribe
  /** field == value 인 문서만 구독 */
  subscribeWhere(
    collectionPath: string,
    where: Where,
    onChange: (docs: StoredDoc[]) => void,
    onError?: ErrorHandler,
  ): Unsubscribe
  /** 새 문서 추가, id 반환 */
  add(collectionPath: string, data: DocData): Promise<string>
  /** 일부 필드만 수정. 'settings.theme' 처럼 점(.)으로 중첩 필드 지정 가능 */
  update(docPath: string, data: DocData): Promise<void>
  remove(docPath: string): Promise<void>
  /** 정해진 id 로 문서를 만들거나 기존 문서에 합치기 (merge) */
  set(docPath: string, data: DocData): Promise<void>
}

export type Where = { field: string; value: string | number | boolean }

/** Firestore Timestamp / Date / 그 외 → Date | null */
export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate()
  }
  return null
}

export const asString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback)
export const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
export const asBool = (value: unknown, fallback = false): boolean => (typeof value === 'boolean' ? value : fallback)
