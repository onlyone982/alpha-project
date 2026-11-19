import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

/**
 * 로그인은 됐지만 보안 규칙(firestore.rules / storage.rules)에 내 UID가 아직 없을 때 보여주는 안내.
 * 1인용 앱이라 처음 한 번만 거치는 단계입니다.
 */
export function AccessSetupPage() {
  const { user, signOut } = useAuth()
  const [copied, setCopied] = useState(false)
  const uid = user?.uid ?? ''

  async function copyUid() {
    await navigator.clipboard.writeText(uid)
    setCopied(true)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-bold">거의 다 왔어요 🔐</h1>
      <p className="mt-3 leading-relaxed text-muted">
        이 앱은 나만 쓰도록 잠겨 있어요. 아래 UID를 보안 규칙에 등록하면 끝나요.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface p-3">
        <code className="flex-1 break-all text-sm">{uid}</code>
        <button
          type="button"
          onClick={copyUid}
          className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
        <li>
          <code className="text-text">firestore.rules</code>와 <code className="text-text">storage.rules</code>의{' '}
          <code className="text-text">ALLOWED_UID</code>를 위 UID로 바꾸기
        </li>
        <li>
          터미널에서 <code className="text-text">npx firebase-tools deploy --only firestore:rules,storage</code> 실행
        </li>
        <li>이 페이지 새로고침</li>
      </ol>

      <button type="button" onClick={signOut} className="mt-8 self-start text-sm text-muted hover:text-text">
        로그아웃
      </button>
    </main>
  )
}
