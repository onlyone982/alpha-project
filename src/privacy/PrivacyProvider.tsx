import { useMemo, useState, type ReactNode } from 'react'
import { useUserProfile } from '../hooks/useUserProfile'
import { PrivacyContext } from './PrivacyContext'

/** 프라이버시 모드. 기본값은 설정(privacyModeDefault), 토글하면 이번 접속 동안만 바뀜 */
export function PrivacyProvider({ children }: { children: ReactNode }) {
  const { profile } = useUserProfile()
  const [override, setOverride] = useState<boolean | null>(null)
  const privacy = override ?? profile?.settings.privacyModeDefault ?? false

  const value = useMemo(() => ({ privacy, toggle: () => setOverride(!privacy) }), [privacy])
  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
}
