import { useMemo } from 'react'
import { pickDaily } from '../lib/daily'
import { useCollection } from './hooks'
import { asBool, asString, toDate, type DataStore, type StoredDoc } from './store'

export type Video = {
  id: string
  youtubeId: string
  title: string
  pinned: boolean
  forSos: boolean
  createdAt: Date
}

export function parseVideo(doc: StoredDoc): Video {
  return {
    id: doc.id,
    youtubeId: asString(doc.youtubeId),
    title: asString(doc.title, '제목 없음'),
    pinned: asBool(doc.pinned),
    forSos: asBool(doc.forSos),
    createdAt: toDate(doc.createdAt) ?? new Date(0),
  }
}

/** 저장한 영상 (최근 추가 순) */
export function useVideos(): { videos: Video[]; loading: boolean } {
  const { docs, loading } = useCollection('videos')
  const videos = useMemo(
    () => docs.map(parseVideo).filter((v) => v.youtubeId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [docs],
  )
  return { videos, loading }
}

export function addVideo(store: DataStore, youtubeId: string, title: string) {
  return store.add('videos', { youtubeId, title, pinned: false, forSos: false, createdAt: new Date() })
}

export function updateVideo(store: DataStore, id: string, data: Partial<Pick<Video, 'title' | 'forSos'>>) {
  return store.update(`videos/${id}`, data)
}

/** 고정은 하나만: 고정하면 다른 영상의 고정은 풀림 */
export async function setPinnedVideo(store: DataStore, videos: readonly Video[], id: string, pinned: boolean) {
  await Promise.all(
    videos
      .filter((v) => (v.id === id ? v.pinned !== pinned : pinned && v.pinned))
      .map((v) => store.update(`videos/${v.id}`, { pinned: v.id === id ? pinned : false })),
  )
}

export function removeVideo(store: DataStore, id: string) {
  return store.remove(`videos/${id}`)
}

/** 메인에 보여줄 영상: 고정한 영상, 없으면 날짜 기준 하루 1개 */
export function featuredVideo(videos: readonly Video[], dayKey: string): Video | null {
  const pinned = videos.find((v) => v.pinned)
  if (pinned) return pinned
  const byAge = [...videos].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  return pickDaily(byAge, dayKey, 'video')
}

/** SOS 에서 틀 영상: 'SOS용' 중 무작위, 없으면 전체 중 무작위 */
export function sosVideo(videos: readonly Video[], random = Math.random): Video | null {
  const pool = videos.some((v) => v.forSos) ? videos.filter((v) => v.forSos) : videos
  return pool.length ? pool[Math.floor(random() * pool.length)] : null
}
