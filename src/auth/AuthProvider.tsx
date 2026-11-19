import { FirebaseError } from 'firebase/app'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { firebase } from '../lib/firebase'
import { ensureUserProfile } from '../lib/userProfile'
import { AuthContext, type AppUser, type AuthContextValue, type AuthStatus } from './AuthContext'

const PREVIEW_USER: AppUser = { uid: 'preview', displayName: '미리보기', email: null }

/** 홈 화면에 설치된 앱(PWA)으로 실행 중인지. iOS 에서는 팝업 로그인이 막히므로 리다이렉트를 씁니다. */
function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(firebase ? 'loading' : 'unconfigured')
  const [user, setUser] = useState<AppUser | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!firebase) return
    const { auth, db } = firebase

    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null)
        setStatus('signedOut')
        return
      }

      const appUser: AppUser = {
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        email: fbUser.email,
      }
      setUser(appUser)
      setStatus('loading')

      try {
        await ensureUserProfile(db, fbUser.uid)
        setStatus('ready')
      } catch (error) {
        if (error instanceof FirebaseError && error.code === 'permission-denied') {
          setStatus('needsAccess')
        } else {
          setErrorMessage(error instanceof Error ? error.message : String(error))
          setStatus('error')
        }
      }
    })
  }, [])

  const signIn = useCallback(async () => {
    if (!firebase) return
    const provider = new GoogleAuthProvider()
    try {
      if (isStandalone()) {
        await signInWithRedirect(firebase.auth, provider)
      } else {
        await signInWithPopup(firebase.auth, provider)
      }
    } catch (error) {
      // 사용자가 팝업을 닫은 경우는 조용히 무시
      if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') return
      setErrorMessage(error instanceof Error ? error.message : String(error))
    }
  }, [])

  const signOut = useCallback(async () => {
    if (isPreview) {
      setIsPreview(false)
      setUser(null)
      setStatus(firebase ? 'signedOut' : 'unconfigured')
      return
    }
    if (firebase) await firebaseSignOut(firebase.auth)
  }, [isPreview])

  const startPreview = useCallback(() => {
    if (!import.meta.env.DEV) return
    setIsPreview(true)
    setUser(PREVIEW_USER)
    setStatus('ready')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, isPreview, errorMessage, signIn, signOut, startPreview }),
    [status, user, isPreview, errorMessage, signIn, signOut, startPreview],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
