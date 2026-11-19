const ID = /^[A-Za-z0-9_-]{11}$/

/**
 * YouTube 주소에서 영상 ID(11자리)를 꺼냅니다. 못 찾으면 null.
 * 지원: watch?v= / youtu.be/ / shorts/ / embed/ / live/ / m.·music. 도메인 / ID 만 붙여넣기
 */
export function extractYouTubeId(input: string): string | null {
  const value = input.trim()
  if (ID.test(value)) return value

  let url: URL
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\.|^m\.|^music\./, '')
  let candidate: string | null = null

  if (host === 'youtu.be') {
    candidate = url.pathname.split('/')[1] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') candidate = url.searchParams.get('v')
    else {
      const [, kind, id] = url.pathname.split('/')
      if (['shorts', 'embed', 'live', 'v'].includes(kind)) candidate = id ?? null
    }
  }

  return candidate && ID.test(candidate) ? candidate : null
}

export const youtubeThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`

export const youtubeEmbedUrl = (id: string, autoplay = false) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0${autoplay ? '&autoplay=1' : ''}`

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

/** 영상 제목 가져오기 (YouTube oEmbed). 실패하면 null → 직접 입력 */
export async function fetchYouTubeTitle(id: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeWatchUrl(id))}&format=json`,
    )
    if (!res.ok) return null
    const data = (await res.json()) as { title?: unknown }
    return typeof data.title === 'string' ? data.title : null
  } catch {
    return null
  }
}
