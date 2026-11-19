import { doc, getDoc, serverTimestamp, setDoc, type DocumentData, type Firestore } from 'firebase/firestore'
import { toDate } from '../data/store'

/** Firestore users/{uid} 문서를 앱에서 쓰기 좋게 변환한 형태 */
export type UserProfile = {
  /** 변하기 시작한 날짜/시간. 처음엔 첫 로그인 시점 (서버 시각이 아직 안 정해졌으면 null) */
  startAt: Date | null
  motto: string
  settings: UserSettings
  streak: StreakState
  issueCounter: number
}

export type UserSettings = {
  /**
   * 숨긴 위젯 id 목록.
   * (명세의 enabledWidgets 대신 "숨긴 것"을 저장: 나중에 위젯이 새로 추가돼도 자동으로 보이게 하려고)
   */
  hiddenWidgets: string[]
  privacyModeDefault: boolean
  theme: 'dark'
}

export type StreakState = {
  current: number
  longest: number
  freezes: number
  /** 마지막으로 스트릭을 평가한 날 (YYYY-MM-DD, 서울 기준) */
  lastEvaluatedDate: string | null
}

export const DEFAULT_SETTINGS: UserSettings = {
  hiddenWidgets: [],
  privacyModeDefault: false,
  theme: 'dark',
}

export const DEFAULT_STREAK: StreakState = {
  current: 0,
  longest: 0,
  freezes: 0,
  lastEvaluatedDate: null,
}

export function createDefaultProfile(startAt: Date | null): UserProfile {
  return {
    startAt,
    motto: '',
    settings: { ...DEFAULT_SETTINGS },
    streak: { ...DEFAULT_STREAK },
    issueCounter: 0,
  }
}

/** Firestore 원본 데이터 → UserProfile. 빠진 필드는 기본값으로 채웁니다. */
export function parseProfile(data: DocumentData): UserProfile {
  return {
    startAt: toDate(data.startAt),
    motto: typeof data.motto === 'string' ? data.motto : '',
    settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
    streak: { ...DEFAULT_STREAK, ...(data.streak ?? {}) },
    issueCounter: typeof data.issueCounter === 'number' ? data.issueCounter : 0,
  }
}

const userDoc = (db: Firestore, uid: string) => doc(db, 'users', uid)

/** 첫 로그인이면 users/{uid} 문서를 기본값으로 만듭니다. 이미 있으면 아무것도 하지 않습니다. */
export async function ensureUserProfile(db: Firestore, uid: string): Promise<void> {
  const ref = userDoc(db, uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return

  const defaults = createDefaultProfile(null)
  await setDoc(ref, {
    ...defaults,
    startAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  })
}
