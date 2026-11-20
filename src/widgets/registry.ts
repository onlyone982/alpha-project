import { CalculatorWidget } from './CalculatorWidget'
import { DiaryWidget } from './DiaryWidget'
import { HomeWidget } from './HomeWidget'
import { LibraryWidget } from './LibraryWidget'
import { MotivationVideoWidget } from './MotivationVideoWidget'
import { NotesDetail } from './notes/NotesDetail'
import { ONE_DOLLAR_URL, OneDollarWidget } from './OneDollarWidget'
import { QuitCounterWidget } from './QuitCounterWidget'
import { QuitDetail } from './quit/QuitDetail'
import { QuoteDetail } from './quote/QuoteDetail'
import { QuoteWidget } from './QuoteWidget'
import { StickyNotesWidget } from './StickyNotesWidget'
import { StyleWidget } from './StyleWidget'
import { TodayDetail } from './today/TodayDetail'
import { TodayWidget } from './TodayWidget'
import { TreeWidget } from './TreeWidget'
import type { WidgetDefinition } from './types'
import { VideoDetail } from './video/VideoDetail'

export type { WidgetDefinition } from './types'

/**
 * 모든 위젯 목록. 어느 칸에 놓일지는 src/lib/layout.ts (기본 배치) 와 사용자가 저장한 배치가 정합니다.
 * 화면에 안 놓인 위젯은 위젯 라이브러리에 들어갑니다.
 */
export const WIDGETS: WidgetDefinition[] = [
  { id: 'home', title: 'LV · Day', emoji: '🔥', component: HomeWidget, hideHeader: true },
  { id: 'library', title: '위젯 라이브러리', emoji: '🗂️', component: LibraryWidget },
  { id: 'today', title: '이번 주', emoji: '✅', component: TodayWidget, detail: TodayDetail, hideHeader: true },
  { id: 'quit', title: 'List', emoji: '🚭', component: QuitCounterWidget, detail: QuitDetail },
  { id: 'notes', title: 'Sticker note', emoji: '🗒', component: StickyNotesWidget, detail: NotesDetail },
  { id: 'video', title: 'YouTube', emoji: '▶️', component: MotivationVideoWidget, detail: VideoDetail },
  { id: 'style', title: '스타일 기록', emoji: '🧴', component: StyleWidget, hideHeader: true },
  { id: 'tree', title: '나무 키우기', emoji: '🌳', component: TreeWidget },
  { id: 'quote', title: '좌우명 · 명언', emoji: '💬', component: QuoteWidget, detail: QuoteDetail, hideHeader: true },
  { id: 'calculator', title: '계산기', emoji: '🧮', component: CalculatorWidget, open: { kind: 'modal' } },
  { id: 'diary', title: '일기장', emoji: '📔', component: DiaryWidget, open: { kind: 'modal' } },
  { id: 'onedollar', title: 'One Dollar Drive', emoji: '🏎️', component: OneDollarWidget, open: { kind: 'link', url: ONE_DOLLAR_URL } },
]

export function getWidget(id: string): WidgetDefinition | undefined {
  return WIDGETS.find((widget) => widget.id === id)
}
