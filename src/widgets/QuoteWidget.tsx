import { Link } from 'react-router'
import { useDailyQuote } from '../data/quotesRepo'
import { useToday } from '../hooks/useToday'
import { useUserProfile } from '../hooks/useUserProfile'
import { AchievementTicker } from './quote/AchievementTicker'

/** 가운데 아래: 좌우명 + 오늘의 명언 + 달성 소식 */
export function QuoteWidget() {
  const todayKey = useToday()
  const { profile } = useUserProfile()
  const quote = useDailyQuote(todayKey)
  const motto = profile?.motto.trim()

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4 text-center">
      <div>
        <p className="text-xs text-muted">내 좌우명</p>
        {motto ? (
          <p className="mt-1 text-lg font-bold leading-snug">{motto}</p>
        ) : (
          <Link to="/w/quote" className="mt-1 inline-block text-sm text-accent hover:underline">
            + 좌우명 정하기
          </Link>
        )}
      </div>
      {quote && (
        <figure>
          <blockquote className="text-sm leading-relaxed">“{quote.text}”</blockquote>
          <figcaption className="mt-1 text-xs text-muted">— {quote.author}</figcaption>
        </figure>
      )}
      <AchievementTicker />
    </div>
  )
}
