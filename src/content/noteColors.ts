/** 스티커 메모 색 5가지 (어두운 화면에서도 읽히는 파스텔 + 검정 글씨) */
export const NOTE_COLORS = [
  { key: 'yellow', label: '노랑', bg: '#f6e27a' },
  { key: 'pink', label: '분홍', bg: '#f4a7c0' },
  { key: 'mint', label: '민트', bg: '#9fe3c5' },
  { key: 'sky', label: '하늘', bg: '#9fcbf2' },
  { key: 'lavender', label: '보라', bg: '#c7b6f2' },
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]['key']

export const noteBg = (key: string) => NOTE_COLORS.find((c) => c.key === key)?.bg ?? NOTE_COLORS[0].bg
