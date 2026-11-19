import { Link, Navigate, useParams } from 'react-router'
import { getWidget } from '../widgets/registry'

/** 위젯 상세 페이지 자리. 각 위젯을 구현하는 단계에서 실제 상세 화면으로 바뀝니다. */
export function WidgetDetailPage() {
  const { widgetId = '' } = useParams()
  const widget = getWidget(widgetId)
  if (!widget) return <Navigate to="/" replace />

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link to="/" className="text-sm text-muted hover:text-text">
        ← 홈으로
      </Link>
      <h1 className="mt-4 text-2xl font-bold">
        <span aria-hidden className="mr-2">
          {widget.emoji}
        </span>
        {widget.title}
      </h1>
      <div className="mt-6">
        {widget.detail ? <widget.detail /> : <p className="text-muted">전체 기록과 편집 화면이 여기에 들어갈 예정이에요.</p>}
      </div>
    </main>
  )
}
