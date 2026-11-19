import { useMemo } from 'react'
import { useStore } from '../data/DataStoreContext'
import { useDoc } from '../data/hooks'
import { parseProfile, type UserProfile } from '../lib/userProfile'

/** 로그인한 사용자의 프로필(users/{uid})을 실시간으로 구독합니다. */
export function useUserProfile(): { profile: UserProfile | null; loading: boolean } {
  const { data, loading } = useDoc('')
  const profile = useMemo(() => (data ? parseProfile(data) : null), [data])
  return { profile, loading }
}

/** 변하기 시작한 날짜/시간 수정 */
export function useUpdateStartAt() {
  const store = useStore()
  return (startAt: Date) => store?.update('', { startAt })
}
