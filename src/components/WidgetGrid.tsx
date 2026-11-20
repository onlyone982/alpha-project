import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { SLOT_INFO, SLOTS, type Layout } from '../lib/layout'
import { getWidget } from '../widgets/registry'

type SlotStyle = CSSProperties & { '--m-order': number; '--col': number; '--row': number }

/**
 * 3×3 판. 칸 사이는 1px 선으로만 나뉨 (배경색 위에 칸을 1px 간격으로 깔아서 선처럼 보이게).
 * PC 3열 / 모바일 1열. 배치 규칙은 index.css 의 .widget-slot 참고
 */
export function WidgetGrid({ layout }: { layout: Layout }) {
  return (
    <div className="glow-board grid grid-cols-1 gap-px overflow-hidden rounded-3xl lg:grid-cols-3">
      {SLOTS.map((slot) => {
        const info = SLOT_INFO[slot]
        const widget = layout[slot] ? getWidget(layout[slot]) : undefined
        const style: SlotStyle = { '--m-order': info.mobileOrder, '--col': info.col, '--row': info.row }

        return (
          <section
            key={slot}
            className="widget-slot flex min-h-56 flex-col bg-bg/95 p-5"
            style={style}
            aria-label={widget?.title ?? `${info.label} 빈 칸`}
          >
            {widget && !widget.hideHeader && (
              <header className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{widget.title}</h2>
                {widget.detail && (
                  <Link to={`/w/${widget.id}`} className="text-xs text-muted hover:text-text">
                    전체 보기 →
                  </Link>
                )}
              </header>
            )}
            <div className="relative flex-1">
              {widget ? (
                <>
                  <widget.component />
                  {widget.hideHeader && widget.detail && (
                    <Link to={`/w/${widget.id}`} className="absolute right-0 top-0 text-xs text-muted hover:text-text">
                      전체 보기 →
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
