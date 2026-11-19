import { Link } from 'react-router'
import { YouTubeEmbed } from '../components/YouTubeEmbed'
import { emptyVideos } from '../content/memes'
import { featuredVideo, useVideos } from '../data/videosRepo'
import { useToday } from '../hooks/useToday'

/** 메인 화면 가운데: 고정한 영상 또는 오늘의 영상 1개 */
export function MotivationVideoWidget() {
  const todayKey = useToday()
  const { videos, loading } = useVideos()
  const video = featuredVideo(videos, todayKey)

  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>
  if (!video) {
    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <p className="text-sm text-muted">{emptyVideos}</p>
        <Link to="/w/video" className="self-start text-sm text-accent hover:underline">
          + 영상 추가하기
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
      <p className="truncate text-sm" title={video.title}>
        {video.pinned && <span className="mr-1">📌</span>}
        {video.title}
      </p>
    </div>
  )
}
