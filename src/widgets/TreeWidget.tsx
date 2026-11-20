import { useState } from 'react'
import { ui } from '../components/ui'
import { TREE_ART, TREE_COLORS, WILTED_COLORS } from '../content/treeArt'
import { useStore } from '../data/DataStoreContext'
import { useWateredDays, waterTree } from '../data/treeRepo'
import { useNow } from '../hooks/useNow'
import { toDayKey, formatSeoul } from '../lib/date'
import { treeState } from '../lib/tree'

/** 왼쪽 아래: 픽셀 나무 키우기. 하루 1번 물 주기 */
export function TreeWidget() {
  const store = useStore()
  const now = useNow(60_000)
  const todayKey = toDayKey(now)
  const { days, loading } = useWateredDays()
  const [watering, setWatering] = useState(false)
  const state = treeState(days, todayKey)
  const hour = Number(formatSeoul(now, 'H'))

  async function water() {
    if (!store || state.wateredToday) return
    setWatering(true)
    await waterTree(store, new Date())
    window.setTimeout(() => setWatering(false), 1200)
  }

  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col items-center gap-3">
      <PixelTree stage={state.stage.key} wilted={state.wilted} hour={hour} watering={watering} />
      <div className="text-center text-sm">
        <p className="font-semibold">
          {state.stage.name} {state.wilted && <span className="text-muted">(시듦)</span>}
        </p>
        <p className="text-xs text-muted">
          물 준 날 {state.wateredDays}일
          {state.daysToNext !== null && ` · 다음 단계까지 ${state.daysToNext}일`}
        </p>
        {state.wilted && <p className="mt-1 text-xs text-muted">목말라서 시들었어… 물 주면 다시 살아나.</p>}
      </div>
      <button type="button" className={ui.button} onClick={water} disabled={state.wateredToday}>
        {state.wateredToday ? '오늘 물 줌 ✓' : '💧 물 주기'}
      </button>
    </div>
  )
}

function skyFor(hour: number): { sky: string; night: boolean } {
  if (hour >= 6 && hour < 17) return { sky: '#5aa9e6', night: false }
  if (hour >= 17 && hour < 19) return { sky: '#e9845a', night: false }
  if (hour >= 5 && hour < 6) return { sky: '#6b6fa8', night: false }
  return { sky: '#0e1430', night: true }
}

const STARS = [
  [2, 2],
  [12, 1],
  [6, 4],
  [14, 6],
  [1, 8],
  [10, 3],
]

function PixelTree({ stage, wilted, hour, watering }: { stage: keyof typeof TREE_ART; wilted: boolean; hour: number; watering: boolean }) {
  const art = TREE_ART[stage]
  const { sky, night } = skyFor(hour)
  const color = (ch: string) => (wilted && WILTED_COLORS[ch]) || TREE_COLORS[ch]

  const pixels = (rows: string[], offset: number) =>
    rows.flatMap((row, y) =>
      [...row].map((ch, x) => (ch === '.' ? null : <rect key={`${x}-${y + offset}`} x={x} y={y + offset} width={1.02} height={1.02} fill={color(ch)} />)),
    )

  return (
    <svg
      viewBox="0 0 16 16"
      className="w-full max-w-48 rounded-xl border border-line"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`픽셀 나무${wilted ? ' (시듦)' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <rect width={16} height={16} fill={sky} />
      {night && STARS.map(([x, y]) => <rect key={`s${x}${y}`} x={x} y={y} width={0.5} height={0.5} fill="#fff8d6" className="tree-twinkle" />)}
      {!night && <rect x={12} y={1} width={2} height={2} fill="#ffe27a" />}
      {night && <rect x={12} y={1} width={2} height={2} fill="#f4f1de" />}
      <g className={wilted ? 'tree-droop' : 'tree-sway'}>{pixels(art.slice(0, 14), 0)}</g>
      <g>{pixels(art.slice(14), 14)}</g>
      {watering &&
        [5, 8, 11, 7, 10].map((x, i) => (
          <rect key={i} x={x} y={0} width={0.6} height={1} fill="#7cc6ff" className="tree-drop" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
    </svg>
  )
}
