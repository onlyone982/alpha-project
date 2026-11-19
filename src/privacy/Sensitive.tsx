import type { ReactNode } from 'react'
import { usePrivacy } from './PrivacyContext'

/** 프라이버시 모드에서 when 이 true 면 내용을 흐리게 가립니다. */
export function Sensitive({ when = true, children }: { when?: boolean; children: ReactNode }) {
  const { privacy } = usePrivacy()
  if (!privacy || !when) return <>{children}</>
  return (
    <span className="privacy-blur" aria-label="가려진 항목">
      {children}
    </span>
  )
}
