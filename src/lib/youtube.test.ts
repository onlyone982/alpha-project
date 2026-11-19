import { describe, expect, it } from 'vitest'
import { extractYouTubeId } from './youtube'

const ID = 'dQw4w9WgXcQ'

describe('extractYouTubeId', () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://music.youtube.com/watch?v=${ID}&list=abc`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=xyz`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}?feature=share`,
    `youtube.com/watch?v=${ID}`,
    `  ${ID}  `,
  ])('%s', (input) => {
    expect(extractYouTubeId(input)).toBe(ID)
  })

  it.each(['', 'hello', 'https://example.com/watch?v=dQw4w9WgXcQ', 'https://youtube.com/watch?v=short', 'https://youtube.com/channel/abc'])(
    '못 찾으면 null: %s',
    (input) => {
      expect(extractYouTubeId(input)).toBeNull()
    },
  )
})
