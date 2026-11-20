import type { ComponentType } from 'react'

export type WidgetDefinition = {
  id: string
  title: string
  emoji: string
  component: ComponentType
  /** '전체 보기' 상세 화면. 없으면 생략 */
  detail?: ComponentType
  /** 라이브러리에서 '열기'를 눌렀을 때: 창으로 띄우기 / 링크 열기 (없으면 상세 화면으로) */
  open?: { kind: 'modal' } | { kind: 'link'; url: string }
  /** 칸 위에 제목줄을 숨김 */
  hideHeader?: boolean
}
