/** 3×3 칸 이름: t/m/b(상·중·하) + l/c/r(좌·가운데·우) */
export const SLOTS = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'] as const
export type SlotId = (typeof SLOTS)[number]
export type Layout = Record<SlotId, string>

export const SLOT_INFO: Record<SlotId, { col: 1 | 2 | 3; row: 1 | 2 | 3; mobileOrder: number; label: string }> = {
  tl: { col: 1, row: 1, mobileOrder: 2, label: '왼쪽 위' },
  tc: { col: 2, row: 1, mobileOrder: 1, label: '가운데 위' },
  tr: { col: 3, row: 1, mobileOrder: 3, label: '오른쪽 위' },
  ml: { col: 1, row: 2, mobileOrder: 8, label: '왼쪽 가운데' },
  mc: { col: 2, row: 2, mobileOrder: 5, label: '정가운데' },
  mr: { col: 3, row: 2, mobileOrder: 6, label: '오른쪽 가운데' },
  bl: { col: 1, row: 3, mobileOrder: 7, label: '왼쪽 아래' },
  bc: { col: 2, row: 3, mobileOrder: 4, label: '가운데 아래' },
  br: { col: 3, row: 3, mobileOrder: 9, label: '오른쪽 아래' },
}

/** 바꿀 수 없는 칸 (레벨·DAY 칸, 위젯 라이브러리 칸) */
export const FIXED: Partial<Layout> = { tc: 'home', br: 'library' }

export const DEFAULT_LAYOUT: Layout = {
  tl: 'today',
  tc: 'home',
  tr: 'quit',
  ml: 'notes',
  mc: 'video',
  mr: 'style',
  bl: 'tree',
  bc: 'quote',
  br: 'library',
}

export const isFixedSlot = (slot: SlotId) => slot in FIXED

/**
 * 저장된 배치를 검사해서 쓸 수 있는 배치로.
 * 모르는 위젯·중복·고정 칸 침범이 있으면 그 칸은 기본값으로 (기본값도 이미 쓰였으면 빈 칸 '')
 */
export function resolveLayout(saved: Partial<Record<string, unknown>> | null | undefined, knownIds: readonly string[]): Layout {
  const known = new Set(knownIds)
  const fixedIds = new Set(Object.values(FIXED))
  const result = {} as Layout
  const used = new Set<string>()

  for (const slot of SLOTS) {
    const fixed = FIXED[slot]
    if (fixed) {
      result[slot] = fixed
      used.add(fixed)
    }
  }
  for (const slot of SLOTS) {
    if (FIXED[slot]) continue
    const value = saved?.[slot]
    if (typeof value === 'string' && (value === '' || (known.has(value) && !used.has(value) && !fixedIds.has(value)))) {
      result[slot] = value
      if (value) used.add(value)
    } else {
      result[slot] = ''
    }
  }
  // 저장값이 없던(또는 잘못된) 칸은 기본값으로, 단 이미 다른 칸에 있으면 비워둠
  for (const slot of SLOTS) {
    if (FIXED[slot] || (saved && typeof saved[slot] === 'string' && result[slot] === saved[slot])) continue
    const fallback = DEFAULT_LAYOUT[slot]
    result[slot] = known.has(fallback) && !used.has(fallback) ? fallback : ''
    if (result[slot]) used.add(result[slot])
  }
  return result
}

/** 위젯을 칸에 넣기. 원래 그 칸에 있던 위젯은 라이브러리로(또는 옮겨온 위젯의 원래 칸으로) */
export function placeWidget(layout: Layout, widgetId: string, slot: SlotId): Layout {
  if (isFixedSlot(slot)) return layout
  const next = { ...layout }
  const from = SLOTS.find((s) => layout[s] === widgetId)
  if (from && isFixedSlot(from)) return layout
  if (from) next[from] = layout[slot]
  next[slot] = widgetId
  return next
}

/** 칸 비우기 (위젯은 라이브러리로) */
export function clearSlot(layout: Layout, slot: SlotId): Layout {
  if (isFixedSlot(slot)) return layout
  return { ...layout, [slot]: '' }
}

/** 화면에 안 놓인 위젯 = 라이브러리에 있는 위젯 */
export function libraryIds(layout: Layout, allIds: readonly string[]): string[] {
  const placed = new Set(Object.values(layout))
  const fixedIds = new Set(Object.values(FIXED))
  return allIds.filter((id) => !placed.has(id) && !fixedIds.has(id))
}
