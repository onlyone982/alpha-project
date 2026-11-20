/**
 * 시즌 챌린지 (3개월씩 4시즌). 기본 주제는 설정 페이지에서 시즌마다 바꿀 수 있습니다.
 * months: 그 시즌에 속하는 달 (1~12)
 */
export type SeasonType = 'winter' | 'spring' | 'summer' | 'fall'

export const SEASONS: Record<SeasonType, { name: string; emoji: string; months: number[]; defaultTheme: string }> = {
  winter: { name: 'Winter Arc', emoji: '❄️', months: [10, 11, 12], defaultTheme: '조용히 강해지는 시즌' },
  spring: { name: 'Spring Arc', emoji: '🌱', months: [1, 2, 3], defaultTheme: '새 습관 심기' },
  summer: { name: 'Summer Arc', emoji: '☀️', months: [4, 5, 6], defaultTheme: '몸 만들기' },
  fall: { name: 'Fall Arc', emoji: '🍂', months: [7, 8, 9], defaultTheme: '수확과 마무리' },
}
