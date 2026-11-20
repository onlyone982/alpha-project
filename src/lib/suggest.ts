/**
 * 예전에 적은 값들로 자동완성 목록 만들기: 최근에 쓴 것 먼저, 중복(대소문자·앞뒤 공백 무시) 제거
 */
export function recentDistinct(entries: readonly { value: string; at: number }[], limit = 30): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const e of [...entries].sort((a, b) => b.at - a.at)) {
    const value = e.value.trim()
    const key = value.toLowerCase()
    if (!value || seen.has(key)) continue
    seen.add(key)
    result.push(value)
    if (result.length >= limit) break
  }
  return result
}
