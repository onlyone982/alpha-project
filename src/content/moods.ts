/** 한 줄 일지 기분 5단계 (1=최악 ~ 5=최고) */
export const MOODS = [
  { value: 1, emoji: '😫', label: '최악' },
  { value: 2, emoji: '😕', label: '별로' },
  { value: 3, emoji: '😐', label: '그럭저럭' },
  { value: 4, emoji: '🙂', label: '좋음' },
  { value: 5, emoji: '😆', label: '최고' },
] as const

export const moodEmoji = (value: number | null) => MOODS.find((m) => m.value === value)?.emoji ?? ''
