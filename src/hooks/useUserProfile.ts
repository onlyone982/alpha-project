import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { firebase } from '../lib/firebase'
import { createDefaultProfile, subscribeUserProfile, type UserProfile } from '../lib/userProfile'

const PREVIEW_PROFILE = createDefaultProfile(null)

type Loaded = { uid: string; profile: UserProfile | null }

/** 로그인한 사용자의 프로필(users/{uid})을 실시간으로 구독합니다. */
export function useUserProfile(): { profile: UserProfile | null; loading: boolean } {
  const { user, isPreview } = useAuth()
  const uid = isPreview ? null : (user?.uid ?? null)
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    if (!firebase || !uid) return
    return subscribeUserProfile(
      firebase.db,
      uid,
      (profile) => setLoaded({ uid, profile }),
      (error) => {
        console.error('프로필을 불러오지 못했어요', error)
        setLoaded({ uid, profile: null })
      },
    )
  }, [uid])

  if (isPreview) return { profile: PREVIEW_PROFILE, loading: false }
  // 다른 계정의 이전 값이 남아 있으면 아직 로딩 중으로 취급
  if (!loaded || loaded.uid !== uid) return { profile: null, loading: true }
  return { profile: loaded.profile, loading: false }
}
