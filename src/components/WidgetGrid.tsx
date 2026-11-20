import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { SLOT_INFO, SLOTS, type Layout } from '../lib/layout'
import { getWidget } from '../widgets/registry'

type SlotStyle = CSSProperties & { '--m-order': number; '--m-span': number; '--col': number; '--row': number }

/**
 * PC: 하나의 판을 빛나는 1px 선으로 3×3 분할
 * 모바일: 2열 둥근 카드 (YouTube 칸만 가로 전체)
 * 배치 규칙은 index.css 의 .board / .widget-slot 참고.
 * 칸 안쪽은 container 라서, 위젯이 칸 폭에 맞춰 배치를 바꿀 수 있음 (@max-3xs: 등)
 */
export function WidgetGrid({ layout }: { layout: Layout }) {
  return (
    <div className="board">
      {SLOTS.map((slot) => {
        const info = SLOT_INFO[slot]
        const widget = layout[slot] ? getWidget(layout[slot]) : undefined
        const style: SlotStyle = { '--m-order': info.mobileOrder, '--m-span': info.mobileSpan, '--col': info.col, '--row': info.row }

        return (
          <section
            key={slot}
            className="widget-slot flex min-h-40 min-w-0 flex-col p-3.5 lg:min-h-56 lg:p-5"
            style={style}
            aria-label={widget?.title ?? `${info.label} 빈 칸`}
          >
            {widget && !widget.hideHeader && (
              <header className="mb-3 flex items-center justify-between gap-2">
                <h2 className="truncate text-sm font-semibold">{widget.title}</h2>
                {widget.detail && (
                  <Link to={`/w/${widget.id}`} className="shrink-0 text-xs text-muted hover:text-text">
                    <span className="max-lg:hidden">전체 보기 </span>→
                  </Link>
                )}
              </header>
            )}
            <div className="@container relative min-w-0 flex-1">
              {widget ? (
                <>
                  <widget.component />
                  {widget.hideHeader && widget.detail && (
                    <Link to={`/w/${widget.id}`} className="absolute right-0 top-0 text-xs text-muted hover:text-text">
                      <span className="max-lg:hidden">전체 보기 </span>→
                    </Link>
                  )}
                </>
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-muted">빈 칸 · 위젯 라이브러리에서 넣을 수 있어요</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
