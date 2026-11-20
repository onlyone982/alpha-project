import { Outlet } from 'react-router'
import { BadgeProvider } from '../badges/BadgeProvider'
import { CelebrationHost } from '../badges/CelebrationHost'

/** 로그인 후 모든 화면 공통: 배지 판정 + 축하 화면 */
export function AppShell() {
  return (
    <BadgeProvider>
      <Outlet />
      <CelebrationHost />
    </BadgeProvider>
  )
}
