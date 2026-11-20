/**
 * 레벨 (연속 기록일 기준). 화면에는 숫자 없이 "LV: 이름"만 표시합니다.
 * 이름과 일수는 마음대로 바꿔도 됩니다. Gigachad 다음 레벨은 아직 미정.
 */
export type Level = { name: string; minDays: number }

export const LEVELS: Level[] = [
  { name: 'Doomer', minDays: 0 },
  { name: 'NPC', minDays: 14 },
  { name: 'Normal', minDays: 30 },
  { name: 'Grindset', minDays: 60 },
  { name: 'Sigma', minDays: 100 },
  { name: 'Chad', minDays: 200 },
  { name: 'Gigachad', minDays: 365 },
]
