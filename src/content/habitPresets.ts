/** 끊기 항목 프리셋. 이름과 이모지는 추가할 때 자유롭게 바꿀 수 있습니다. */
export type HabitPreset = { name: string; emoji: string; isSensitive: boolean }

export const HABIT_PRESETS: HabitPreset[] = [
  { name: '금연', emoji: '🚭', isSensitive: false },
  { name: '금주', emoji: '🍺', isSensitive: false },
  { name: '글루텐 프리', emoji: '🌾', isSensitive: false },
  { name: '패스트푸드 끊기', emoji: '🍔', isSensitive: false },
  { name: '도파민 디톡스', emoji: '🧠', isSensitive: true },
]
