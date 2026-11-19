import { Link } from 'react-router'
import { useDailyQuote } from '../data/quotesRepo'
import { useToday } from '../hooks/useToday'
import { useUserProfile } from '../hooks/useUserProfile'

/** 메인 화면 가운데 하단: 내 좌우명 + 오늘의 명언 */
export function QuoteWidget() {
  const todayKey = useToday()
  const { profile } = useUserProfile()
  const quote = useDailyQuote(todayKey)
  const motto = profile?.motto.trim()

  return (
    <div className="flex flex-col gap-4">
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
        <figure className="border-l-2 border-accent pl-3">
          <blockquote className="text-sm leading-relaxed">“{quote.text}”</blockquote>
          <figcaption className="mt-1 text-xs text-muted">— {quote.author}</figcaption>
        </figure>
      )}
    </div>
  )
}
