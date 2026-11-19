import { Navigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { status, signIn, startPreview, errorMessage } = useAuth()

  if (status === 'ready' || status === 'needsAccess') return <Navigate to="/" replace />

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <p className="text-6xl font-black tracking-tight">
        <span aria-hidden>🔥 </span>DAY 1
      </p>
      <p className="mt-3 text-muted">오늘부터 다시 시작. 근데 이번엔 기록하면서.</p>

      {status === 'unconfigured' ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed">
          <p className="font-semibold">Firebase 설정이 아직 없어요</p>
          <p className="mt-2 text-muted">
            <code className="text-text">.env.example</code>을 <code className="text-text">.env</code>로 복사하고 Firebase
            웹 앱 설정값을 넣은 뒤 개발 서버를 다시 켜주세요. 자세한 순서는 README에 있어요.
          </p>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={startPreview}
              className="mt-4 w-full rounded-xl border border-line px-4 py-3 font-semibold transition-colors hover:bg-surface-2"
            >
              설정 없이 레이아웃 미리보기
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={signIn}
          disabled={status === 'loading'}
          className="mt-8 rounded-xl bg-text px-4 py-3 font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'loading' ? '확인 중…' : 'Google로 로그인'}
        </button>
      )}

      {errorMessage && <p className="mt-4 text-sm text-danger">{errorMessage}</p>}
    </main>
  )
}
