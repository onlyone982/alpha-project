/**
 * 시간대별 "이런 건 어떠세요?" 추천. 마음대로 고치거나 추가하세요.
 * - slot: morning(아침 05~11시) / lunch(점심 11~17시) / evening(저녁 17시~새벽 5시)
 * - text: 팝업에 나오는 말 (질문하듯이)
 * - note: '좋아요'를 누르면 스티커 메모로 붙는 짧은 문구
 * - habit: 이 단어가 들어간 끊기 항목이 있으면 먼저 추천 (선택)
 * id 를 바꾸면 '관심 없음'으로 숨긴 기록과 연결이 끊기니 id 는 그대로 두세요.
 */
export type TipSlot = 'morning' | 'lunch' | 'evening'

export type HabitTip = { id: string; slot: TipSlot; emoji: string; text: string; note: string; habit?: string }

export const SLOT_INFO: Record<TipSlot, { label: string; greeting: string }> = {
  morning: { label: '아침', greeting: '좋은 아침!' },
  lunch: { label: '점심', greeting: '오후도 힘내자.' },
  evening: { label: '저녁', greeting: '오늘 하루 수고했어.' },
}

export const HABIT_TIPS: HabitTip[] = [
  // ── 아침
  { id: 'm-honey-almond', slot: 'morning', emoji: '🍯', text: '공복에 꿀 한 숟가락과 아몬드 3알은 어떠세요?', note: '아침 공복: 꿀 한 숟가락 + 아몬드 3알' },
  { id: 'm-water', slot: 'morning', emoji: '💧', text: '일어나자마자 물 한 컵, 마셨나요?', note: '기상 직후 물 한 컵' },
  { id: 'm-sunlight', slot: 'morning', emoji: '🌞', text: '아침 햇빛 10분 쬐는 건 어때요? 밤에 잠이 더 잘 와요.', note: '아침 햇빛 10분' },
  { id: 'm-bed', slot: 'morning', emoji: '🛏️', text: '이불 정리 1분. 오늘의 첫 승리 어때요?', note: '일어나서 이불 정리' },
  { id: 'm-stretch', slot: 'morning', emoji: '🧘', text: '기지개 켜고 스트레칭 5분 어떠세요?', note: '아침 스트레칭 5분' },
  { id: 'm-no-phone', slot: 'morning', emoji: '📵', text: '눈 뜨고 30분은 폰 대신 나한테 집중해보는 건요?', note: '기상 후 30분 폰 안 보기' },
  { id: 'm-protein', slot: 'morning', emoji: '🥚', text: '아침에 계란이나 요거트로 단백질 챙겨볼까요?', note: '아침 단백질 (계란·요거트)' },
  { id: 'm-plan', slot: 'morning', emoji: '📝', text: '오늘 꼭 할 일 3개만 정해볼까요?', note: '오늘 꼭 할 일 3개 정하기' },
  { id: 'm-cold', slot: 'morning', emoji: '🚿', text: '샤워 마지막 30초만 찬물로. 정신이 번쩍 들어요.', note: '샤워 마지막 30초 찬물' },
  { id: 'm-walk-smoke', slot: 'morning', emoji: '🚶', text: '담배 생각나면 5분만 걸어볼까요? 충동은 금방 지나가요.', note: '담배 생각나면 5분 걷기', habit: '금연' },

  // ── 점심
  { id: 'l-sunscreen', slot: 'lunch', emoji: '🧴', text: '해가 쨍쨍합니다! 아참, 선크림은 바르셨나요?', note: '외출 전 선크림' },
  { id: 'l-walk', slot: 'lunch', emoji: '🚶', text: '점심 먹고 10분 산책 어떠세요? 오후 졸음이 덜해요.', note: '점심 후 10분 산책' },
  { id: 'l-stand', slot: 'lunch', emoji: '🧍', text: '한 시간 넘게 앉아 있었다면, 일어나서 기지개 한 번!', note: '1시간마다 일어나기' },
  { id: 'l-water', slot: 'lunch', emoji: '💧', text: '지금까지 물 몇 컵 마셨어요? 한 컵 더 어때요?', note: '오후 물 한 컵 더' },
  { id: 'l-veggie', slot: 'lunch', emoji: '🥗', text: '점심에 채소 한 접시 추가해볼까요?', note: '점심에 채소 한 접시' },
  { id: 'l-coffee', slot: 'lunch', emoji: '☕', text: '커피는 오후 2시 전까지! 밤잠을 지켜줘요.', note: '커피는 오후 2시 전까지' },
  { id: 'l-eyes', slot: 'lunch', emoji: '👀', text: '화면에서 눈 떼고 먼 곳 20초 보기, 해볼까요?', note: '20분마다 먼 곳 20초 보기' },
  { id: 'l-posture', slot: 'lunch', emoji: '🪑', text: '지금 자세 어때요? 어깨 펴고 턱 당기기!', note: '어깨 펴고 턱 당기기' },
  { id: 'l-snack', slot: 'lunch', emoji: '🍎', text: '패스트푸드 대신 과일이나 견과류 간식은 어때요?', note: '간식은 과일·견과류로', habit: '패스트푸드' },

  // ── 저녁
  { id: 'e-water-check', slot: 'evening', emoji: '💧', text: '오늘 하루 물은 얼마나 드셨나요?', note: '하루 물 마신 양 체크' },
  { id: 'e-journal', slot: 'evening', emoji: '📝', text: '오늘 한 줄 일지, 남겨볼까요?', note: '자기 전 한 줄 일지' },
  { id: 'e-gratitude', slot: 'evening', emoji: '🙏', text: '오늘 고마웠던 일 3개, 떠올려볼래요?', note: '감사한 일 3개 적기' },
  { id: 'e-phone-down', slot: 'evening', emoji: '📵', text: '자기 30분 전엔 폰 내려놓기 어때요?', note: '자기 30분 전 폰 내려놓기' },
  { id: 'e-stretch', slot: 'evening', emoji: '🧘', text: '자기 전 스트레칭 5분으로 몸 풀어줄까요?', note: '자기 전 스트레칭 5분' },
  { id: 'e-tomorrow', slot: 'evening', emoji: '🗓️', text: '내일 할 일, 미리 하나만 적어둘까요?', note: '내일 할 일 미리 적기' },
  { id: 'e-sleep', slot: 'evening', emoji: '😴', text: '오늘은 7시간 이상 자보는 건 어때요?', note: '7시간 이상 자기' },
  { id: 'e-light-dinner', slot: 'evening', emoji: '🍽️', text: '야식 대신 따뜻한 차 한 잔은 어때요?', note: '야식 대신 따뜻한 차' },
  { id: 'e-no-drink', slot: 'evening', emoji: '🍵', text: '술 생각나는 저녁엔 탄산수나 차로 바꿔볼까요?', note: '술 대신 탄산수·차', habit: '금주' },
  { id: 'e-read', slot: 'evening', emoji: '📖', text: '자기 전 책 10쪽, 어떠세요?', note: '자기 전 책 10쪽' },
]
