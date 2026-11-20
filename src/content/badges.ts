/**
 * 배지 정의. 이름·이모지·밈 문구는 마음대로 고쳐도 됩니다.
 * (id 를 바꾸면 이미 받은 배지와 연결이 끊기니 id 는 그대로 두세요)
 *
 * 끊기 배지(quit, quitTotal)는 항목마다 따로 받습니다. title 의 {habit} 은 항목 이름으로 바뀝니다.
 */
export type BadgeCategory = 'record' | 'quit' | 'quitTotal' | 'sos' | 'journal' | 'savings' | 'special'

export type BadgeDef = {
  id: string
  category: BadgeCategory
  threshold: number
  emoji: string
  title: string
  meme: string
}

export const CATEGORY_INFO: Record<BadgeCategory, { label: string; unit: string; perHabit: boolean }> = {
  record: { label: '🔥 기록 스트릭', unit: '일', perHabit: false },
  quit: { label: '🚭 끊기 연속', unit: '일', perHabit: true },
  quitTotal: { label: '✅ 끊기 누적', unit: '일', perHabit: true },
  sos: { label: '🆘 SOS 승리', unit: '회', perHabit: false },
  journal: { label: '📝 기록 누적', unit: '개', perHabit: false },
  savings: { label: '💸 아낀 돈', unit: '원', perHabit: false },
  special: { label: '✨ 특별', unit: '', perHabit: false },
}

const record = (n: number, emoji: string, meme: string): BadgeDef => ({
  id: `record-${n}`,
  category: 'record',
  threshold: n,
  emoji,
  title: `${n}일 연속 기록`,
  meme,
})

const quit = (n: number, emoji: string, meme: string): BadgeDef => ({
  id: `quit-${n}`,
  category: 'quit',
  threshold: n,
  emoji,
  title: `{habit} ${n}일`,
  meme,
})

export const BADGES: BadgeDef[] = [
  record(3, '🌱', '3일이면 작심삼일 통과. 이미 평균 이상.'),
  record(7, '🔥', '일주일 풀콤보. 프리즈도 하나 챙겼다 🧊'),
  record(14, '⚡', '2주째. 이제 이게 그냥 너의 일상임.'),
  record(30, '🌕', '한 달. 습관이 너를 알아보기 시작했다.'),
  record(50, '💎', '50일. 이쯤 되면 기록이 너를 기록함.'),
  record(100, '💯', '세 자리 진입. 레전드 서사 시작 🎬'),
  record(200, '🏛️', '200일. 이건 습관이 아니라 정체성이다.'),
  record(365, '👑', '1년 풀시즌. 할 말이 없다. 그냥 왕.'),

  quit(1, '🐣', '첫 24시간 클리어. 제일 어려운 구간 지나왔다.'),
  quit(3, '🧱', '3일. 몸이 슬슬 눈치채기 시작함.'),
  quit(7, '🛡️', '일주일. 유혹 상대로 방어력 +7.'),
  quit(14, '⚔️', '2주. 이제 공격 턴이다.'),
  quit(30, '🏆', '30일. 이거 아무나 못 함. 진짜로.'),
  quit(60, '🦾', '60일. 몸이 업그레이드됨.'),
  quit(90, '🧠', '90일. 뇌 배선이 바뀌는 시간.'),
  quit(180, '🦅', '반년. 예전의 너는 기억도 안 남.'),
  quit(365, '🌌', '1년. 이건 그냥 다른 사람이다.'),

  { id: 'quitTotal-30', category: 'quitTotal', threshold: 30, emoji: '🧩', title: '{habit} 누적 30일', meme: '넘어져도 쌓인 건 안 사라진다. 누적 30일.' },
  { id: 'quitTotal-100', category: 'quitTotal', threshold: 100, emoji: '🏔️', title: '{habit} 누적 100일', meme: '누적 100일. 꾸준함이 재능을 이긴다.' },
  { id: 'quitTotal-365', category: 'quitTotal', threshold: 365, emoji: '🌍', title: '{habit} 누적 365일', meme: '실패 포함 1년치 성공. 이게 진짜 기록.' },

  { id: 'sos-1', category: 'sos', threshold: 1, emoji: '🆘', title: 'SOS 첫 승리', meme: '처음으로 충동을 이겼다. 이 감각 기억해.' },
  { id: 'sos-5', category: 'sos', threshold: 5, emoji: '🌊', title: 'SOS 5승', meme: '파도 다섯 번 넘김. 서핑 고수.' },
  { id: 'sos-10', category: 'sos', threshold: 10, emoji: '🧘', title: 'SOS 10승', meme: '10번 버팀. 멘탈 근육 붙었다.' },
  { id: 'sos-30', category: 'sos', threshold: 30, emoji: '🗿', title: 'SOS 30승', meme: '30승. 흔들려도 안 무너지는 사람.' },

  { id: 'journal-10', category: 'journal', threshold: 10, emoji: '✏️', title: '일지 10개', meme: '10줄 모였다. 작은 자서전 시작.' },
  { id: 'journal-50', category: 'journal', threshold: 50, emoji: '📓', title: '일지 50개', meme: '50일치 기록. 과거의 너랑 대화 가능.' },
  { id: 'journal-100', category: 'journal', threshold: 100, emoji: '📚', title: '일지 100개', meme: '100줄. 이 정도면 출판 각.' },

  { id: 'savings-100000', category: 'savings', threshold: 100_000, emoji: '💵', title: '10만 원 아낌', meme: '10만 원 지켜냄. 지갑이 고맙대.' },
  { id: 'savings-500000', category: 'savings', threshold: 500_000, emoji: '💰', title: '50만 원 아낌', meme: '50만 원. 이걸로 뭘 살지 행복한 고민.' },
  { id: 'savings-1000000', category: 'savings', threshold: 1_000_000, emoji: '🏦', title: '100만 원 아낌', meme: '100만 원. 절제가 재테크였다.' },

  { id: 'special-first-wish', category: 'special', threshold: 1, emoji: '🎁', title: '첫 위시 구매', meme: '아낀 돈으로 산 첫 보상. 이 맛에 한다.' },
  { id: 'special-day-100', category: 'special', threshold: 100, emoji: '🎯', title: 'DAY 100', meme: '변하기 시작한 지 100일. 시즌 1 완주.' },
  { id: 'special-day-365', category: 'special', threshold: 365, emoji: '🌅', title: 'DAY 365', meme: '1년 전의 너에게 이 화면 보여주고 싶다.' },
]
