import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useStore } from '../data/DataStoreContext'
import { removeLegacyBadges } from '../data/profileRepo'
import { LevelWatcher } from './LevelWatcher'

/** 로그인 후 모든 화면 공통: 레벨업 알림 + (한 번) 예전 배지 데이터 정리 */
export function AppShell() {
  const store = useStore()

  // 배지 기능을 없애면서 남은 데이터 정리. 다음 정리 때 이 부분은 지워도 됩니다.
  useEffect(() => {
    if (store) removeLegacyBadges(store)
  }, [store])

  return (
    <>
      <Outlet />
      <LevelWatcher />
    </>
  )
}
