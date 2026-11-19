import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import type { WidgetDefinition } from '../widgets/registry'

type SlotStyle = CSSProperties & { '--m-order': number; '--col': number; '--row': number }

/** PC 3열 / 모바일 1열 위젯 그리드. 배치 규칙은 index.css 의 .widget-slot 참고 */
export function WidgetGrid({ widgets }: { widgets: WidgetDefinition[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {widgets.map((widget) => {
        const Widget = widget.component
        const style: SlotStyle = {
          '--m-order': widget.mobileOrder,
          '--col': widget.desktop.col,
          '--row': widget.desktop.row,
        }
        return (
          <section
            key={widget.id}
            className="widget-slot flex min-h-44 flex-col rounded-2xl border border-line bg-surface p-4"
            style={style}
            aria-labelledby={`widget-${widget.id}-title`}
          >
            <header className="mb-3 flex items-center justify-between">
              <h2 id={`widget-${widget.id}-title`} className="text-sm font-semibold">
                <span aria-hidden className="mr-1.5">
                  {widget.emoji}
                </span>
                {widget.title}
              </h2>
              <Link
                to={`/w/${widget.id}`}
                className="rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                전체 보기 →
              </Link>
            </header>
            <div className="flex-1">
              <Widget />
            </div>
          </section>
        )
      })}
    </div>
  )
}
