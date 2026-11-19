/** 문자열 → 0 이상의 정수 해시 (FNV-1a) */
export function hashString(value: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** 날짜 키로 하루 동안 같은 항목 하나를 고릅니다. salt 를 다르게 주면 다른 목록과 겹치지 않게 섞입니다. */
export function pickDaily<T>(items: readonly T[], dayKey: string, salt = ''): T | null {
  if (items.length === 0) return null
  return items[hashString(`${salt}:${dayKey}`) % items.length]
}
