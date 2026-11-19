import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { AccessSetupPage } from '../pages/AccessSetupPage'
import { useAuth } from './AuthContext'

/** 로그인 + 접근 권한이 있어야 children 을 보여줍니다. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, errorMessage } = useAuth()

  switch (status) {
    case 'loading':
      return (
        <div className="flex min-h-dvh items-center justify-center text-muted" role="status">
          불러오는 중…
        </div>
      )
    case 'unconfigured':
    case 'signedOut':
      return <Navigate to="/login" replace />
    case 'needsAccess':
      return <AccessSetupPage />
    case 'error':
      return (
        <div className="mx-auto max-w-md px-4 py-20 text-sm">
          <p className="font-semibold">문제가 생겼어요</p>
          <p className="mt-2 break-all text-danger">{errorMessage}</p>
        </div>
      )
    case 'ready':
      return <>{children}</>
  }
}
