import type { ComponentType } from 'react'
import { BadgeShelfWidget } from './BadgeShelfWidget'
import { MotivationVideoWidget } from './MotivationVideoWidget'
import { OutfitWidget } from './OutfitWidget'
import { QuitCounterWidget } from './QuitCounterWidget'
import { QuoteWidget } from './QuoteWidget'
import { StickyNotesWidget } from './StickyNotesWidget'
import { TodayWidget } from './TodayWidget'
import { WeeklyNewspaperWidget } from './WeeklyNewspaperWidget'
import { WorkoutWidget } from './WorkoutWidget'

export type WidgetDefinition = {
  id: string
  title: string
  emoji: string
  component: ComponentType
  /** PC(3열 그리드)에서의 위치. col: 1=좌, 2=가운데, 3=우 / row: 1=상단, 2=중간, 3=하단 */
  desktop: { col: 1 | 2 | 3; row: 1 | 2 | 3 }
  /** 모바일(1열)에서 쌓이는 순서. 작을수록 위. 히어로는 항상 맨 위라서 여기 없음 */
  mobileOrder: number
}

/**
 * 메인 화면 위젯 목록.
 * 위치를 바꾸고 싶으면 desktop / mobileOrder 값만 고치면 됩니다.
 */
export const WIDGETS: WidgetDefinition[] = [
  // ── 상단
  { id: 'weekly', title: '주간지', emoji: '📰', component: WeeklyNewspaperWidget, desktop: { col: 1, row: 1 }, mobileOrder: 7 },
  { id: 'today', title: '오늘', emoji: '✅', component: TodayWidget, desktop: { col: 2, row: 1 }, mobileOrder: 1 },
  { id: 'quit', title: '끊기 카운터', emoji: '🚭', component: QuitCounterWidget, desktop: { col: 3, row: 1 }, mobileOrder: 2 },
  // ── 중간
  { id: 'notes', title: '스티커 메모', emoji: '🗒', component: StickyNotesWidget, desktop: { col: 1, row: 2 }, mobileOrder: 9 },
  { id: 'video', title: '동기부여 영상', emoji: '▶️', component: MotivationVideoWidget, desktop: { col: 2, row: 2 }, mobileOrder: 4 },
  { id: 'outfit', title: '오늘의 착장', emoji: '👕', component: OutfitWidget, desktop: { col: 3, row: 2 }, mobileOrder: 5 },
  // ── 하단
  { id: 'badges', title: '배지 진열장', emoji: '🏅', component: BadgeShelfWidget, desktop: { col: 1, row: 3 }, mobileOrder: 8 },
  { id: 'quote', title: '좌우명 & 오늘의 명언', emoji: '💬', component: QuoteWidget, desktop: { col: 2, row: 3 }, mobileOrder: 3 },
  { id: 'workout', title: '운동 기록', emoji: '💪', component: WorkoutWidget, desktop: { col: 3, row: 3 }, mobileOrder: 6 },
]

export function getWidget(id: string): WidgetDefinition | undefined {
  return WIDGETS.find((widget) => widget.id === id)
}

/** 숨긴 위젯을 뺀 목록 */
export function visibleWidgets(hiddenIds: readonly string[]): WidgetDefinition[] {
  return WIDGETS.filter((widget) => !hiddenIds.includes(widget.id))
}
