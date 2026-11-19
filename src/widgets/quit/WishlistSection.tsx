import { useState } from 'react'
import { ProgressBar } from '../../components/ProgressBar'
import { ui } from '../../components/ui'
import { useStore } from '../../data/DataStoreContext'
import { addWish, removeWish, setWishPurchased } from '../../data/wishlistRepo'
import { formatSeoul } from '../../lib/date'
import { formatWon } from '../../lib/format'
import type { WishlistSummary } from '../../lib/wishlist'

/** 아낀 돈으로 살 것들 */
export function WishlistSection({ summary }: { summary: WishlistSummary }) {
  const store = useStore()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')

  if (!store) return null

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = Number(price)
    if (!name.trim() || !(priceNum > 0) || !store) return
    await addWish(store, { name: name.trim(), price: priceNum, url: url.trim() })
    setName('')
    setPrice('')
    setUrl('')
    setAdding(false)
  }

  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">🎁 위시리스트</h2>
          <p className="text-sm text-muted">
            쓸 수 있는 아낀 돈 <strong className="text-text tabular-nums">{formatWon(summary.available)}</strong>
            {summary.spent > 0 && <span> (이미 {formatWon(summary.spent)} 씀)</span>}
          </p>
        </div>
        {!adding && (
          <button type="button" className={ui.button} onClick={() => setAdding(true)}>
            + 추가
          </button>
        )}
      </header>

      {adding && (
        <form onSubmit={handleAdd} className={`${ui.card} grid gap-2 sm:grid-cols-[1fr_9rem]`}>
          <label>
            <span className={ui.label}>이름</span>
            <input className={ui.input} value={name} placeholder="예: 향수 (우디 계열)" onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <span className={ui.label}>가격 (원)</span>
            <input type="number" inputMode="numeric" min={1} className={ui.input} value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="sm:col-span-2">
            <span className={ui.label}>링크 (선택)</span>
            <input type="url" className={ui.input} value={url} placeholder="https://" onChange={(e) => setUrl(e.target.value)} />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className={ui.buttonPrimary} disabled={!name.trim() || !(Number(price) > 0)}>
              추가
            </button>
            <button type="button" className={ui.button} onClick={() => setAdding(false)}>
              취소
            </button>
          </div>
          <p className="text-xs text-muted sm:col-span-2">사진 첨부는 사진 기능(6단계)과 함께 추가돼요.</p>
        </form>
      )}

      {summary.pending.length === 0 && !adding && (
        <p className="text-sm text-muted">아낀 돈으로 사고 싶은 걸 등록해봐. 목표가 있으면 덜 흔들림.</p>
      )}

      <ul className="flex flex-col gap-2">
        {summary.pending.map(({ item, progress, canBuy }) => (
          <li key={item.id} className={ui.card}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="font-medium">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </span>
              <span className="shrink-0 text-sm text-muted tabular-nums">
                {formatWon(item.price)} · {Math.round(progress * 100)}%
              </span>
            </div>
            <ProgressBar value={progress} label={`${item.name} 진행률`} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {canBuy && <span className="text-sm font-semibold text-accent">🎉 이제 살 수 있음</span>}
              {canBuy && (
                <button type="button" className={ui.buttonPrimary} onClick={() => setWishPurchased(store, item.id, new Date())}>
                  구매 완료
                </button>
              )}
              <button
                type="button"
                className="ml-auto text-xs text-muted hover:text-danger"
                onClick={() => {
                  if (window.confirm(`'${item.name}'을(를) 위시리스트에서 지울까요?`)) removeWish(store, item.id)
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {summary.purchased.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted">구매 완료 {summary.purchased.length}개</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {summary.purchased.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 px-2 py-1">
                <span>
                  ✅ {item.name} <span className="text-muted">{formatWon(item.price)}</span>
                  <span className="ml-2 text-xs text-muted">{formatSeoul(item.purchasedAt!, 'yyyy.MM.dd')}</span>
                </span>
                <button type="button" className="text-xs text-muted hover:text-text" onClick={() => setWishPurchased(store, item.id, null)}>
                  되돌리기
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
