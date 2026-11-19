/**
 * 밈 문구 모음. 마음대로 고치거나 추가하세요.
 * (유명 밈 이미지는 저작권 때문에 쓰지 않고, 텍스트와 이모지만 씁니다)
 */

/** 실패를 기록했을 때 보여주는 위로 문구 */
export const relapseComfort: string[] = [
  'he fell off… but he’s getting back up 💀➡️💪',
  '넘어진 건 기록이고, 다시 일어난 건 서사다.',
  '오늘은 보스전에서 졌다. 세이브 포인트는 살아있다. 🎮',
  '완벽한 사람은 이 앱 안 씀. 다시 가자.',
  'L 하나 먹었다. 근데 시즌은 아직 안 끝났다. 🏆',
  'main character도 2화쯤엔 한 번 무너진다. 🎬',
  '0일차 아님. 경험치 쌓인 1일차임.',
  '실패 기록한 것 자체가 이미 남들보다 앞선 거다. 📝',
]

/** 실패 후 최장 기록 안내 */
export const longestKept = (days: number) =>
  days > 1 ? `최고 기록 ${days}일차는 그대로 남아 있어. 그게 니 실력이다.` : '이제 진짜 시작이다. 첫 기록 세우러 가자.'

/** 끊기 항목이 하나도 없을 때 */
export const emptyQuit = '아직 끊는 게 없음. 너무 완벽한 거 아님? 🤨'

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/** 히어로 스트릭 안내 */
export const streakHint = (current: number, todayRecorded: boolean) =>
  todayRecorded ? `오늘 기록 완료. ${current}일 연속 🔥` : `오늘 기록하면 ${current + 1}일 연속`

/** 할일이 없을 때 */
export const emptyTodos = '할일 0개. 자유인가, 계획이 없는 건가 🤔'

/** 한 줄 일지 입력칸 */
export const journalPlaceholder = '오늘 한 줄. 대충 써도 됨.'
