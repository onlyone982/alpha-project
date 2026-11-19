import { createContext, useContext } from 'react'

export type AppUser = {
  uid: string
  displayName: string | null
  email: string | null
}

export type AuthStatus =
  /** 로그인 상태 확인 중 */
  | 'loading'
  /** .env 에 Firebase 설정이 없음 */
  | 'unconfigured'
  | 'signedOut'
  /** 로그인은 됐지만 보안 규칙에 내 UID가 아직 등록되지 않음 */
  | 'needsAccess'
  | 'ready'
  | 'error'

export type AuthContextValue = {
  status: AuthStatus
  user: AppUser | null
  /** Firebase 없이 레이아웃만 보는 미리보기 모드 (개발 서버에서만) */
  isPreview: boolean
  errorMessage: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  startPreview: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth 는 AuthProvider 안에서만 쓸 수 있어요')
  return value
}
