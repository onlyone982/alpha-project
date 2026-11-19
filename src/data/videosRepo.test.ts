import { describe, expect, it } from 'vitest'
import { featuredVideo, sosVideo, type Video } from './videosRepo'

const video = (id: string, over: Partial<Video> = {}): Video => ({
  id,
  youtubeId: id.padEnd(11, 'x'),
  title: id,
  pinned: false,
  forSos: false,
  createdAt: new Date(`2026-11-0${id.length}T00:00:00Z`),
  ...over,
})

describe('featuredVideo', () => {
  it('고정한 영상이 있으면 그 영상', () => {
    const list = [video('a'), video('bb', { pinned: true }), video('ccc')]
    expect(featuredVideo(list, '2026-11-20')?.id).toBe('bb')
  })

  it('없으면 하루 동안 같은 영상', () => {
    const list = [video('a'), video('bb'), video('ccc')]
    expect(featuredVideo(list, '2026-11-20')?.id).toBe(featuredVideo([...list].reverse(), '2026-11-20')?.id)
  })

  it('영상이 없으면 null', () => {
    expect(featuredVideo([], '2026-11-20')).toBeNull()
  })
})

describe('sosVideo', () => {
  it('SOS용이 있으면 그중에서만', () => {
    const list = [video('a'), video('bb', { forSos: true })]
    expect(sosVideo(list, () => 0)?.id).toBe('bb')
    expect(sosVideo(list, () => 0.99)?.id).toBe('bb')
  })

  it('SOS용이 없으면 전체 중에서', () => {
    expect(sosVideo([video('a')], () => 0)?.id).toBe('a')
    expect(sosVideo([], () => 0)).toBeNull()
  })
})
