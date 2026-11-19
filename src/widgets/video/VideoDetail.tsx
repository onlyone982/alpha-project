import { useState } from 'react'
import { YouTubeEmbed } from '../../components/YouTubeEmbed'
import { ui } from '../../components/ui'
import { emptyVideos } from '../../content/memes'
import { useStore } from '../../data/DataStoreContext'
import { addVideo, removeVideo, setPinnedVideo, updateVideo, useVideos, type Video } from '../../data/videosRepo'
import { extractYouTubeId, fetchYouTubeTitle, youtubeThumbnail } from '../../lib/youtube'

/** 동기부여 영상 관리: 추가, 고정, SOS용 지정, 삭제 */
export function VideoDetail() {
  const store = useStore()
  const { videos, loading } = useVideos()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const playing = videos.find((v) => v.id === playingId) ?? null

  if (!store || loading) return <p className="text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col gap-6">
      <AddVideoForm existing={videos} />

      {playing && (
        <section className="flex flex-col gap-2">
          <YouTubeEmbed youtubeId={playing.youtubeId} title={playing.title} autoplay />
          <p className="font-medium">{playing.title}</p>
        </section>
      )}

      {videos.length === 0 && <p className="text-sm text-muted">{emptyVideos}</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {videos.map((video) => (
          <li key={video.id} className={`${ui.card} flex flex-col gap-2 p-3`}>
            <button
              type="button"
              className="group relative overflow-hidden rounded-lg"
              onClick={() => setPlayingId(video.id)}
              aria-label={`${video.title} 재생`}
            >
              <img src={youtubeThumbnail(video.youtubeId)} alt="" className="aspect-video w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-3xl opacity-0 transition-opacity group-hover:opacity-100">
                ▶
              </span>
            </button>
            <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
            <div className="flex flex-wrap gap-1.5">
              <Toggle on={video.pinned} onClick={() => setPinnedVideo(store, videos, video.id, !video.pinned)}>
                📌 {video.pinned ? '고정됨' : '메인에 고정'}
              </Toggle>
              <Toggle on={video.forSos} onClick={() => updateVideo(store, video.id, { forSos: !video.forSos })}>
                🆘 {video.forSos ? 'SOS용' : 'SOS용으로'}
              </Toggle>
              <button
                type="button"
                className="ml-auto text-xs text-muted hover:text-danger"
                onClick={() => {
                  if (window.confirm('이 영상을 목록에서 지울까요?')) removeVideo(store, video.id)
                }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs transition-colors ${
        on ? 'border-accent bg-accent/15 text-text' : 'border-line text-muted hover:text-text'
      }`}
    >
      {children}
    </button>
  )
}

function AddVideoForm({ existing }: { existing: readonly Video[] }) {
  const store = useStore()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [needTitle, setNeedTitle] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!store) return
    const id = extractYouTubeId(url)
    if (!id) return setError('YouTube 주소를 확인해주세요. (watch, youtu.be, shorts 주소 모두 돼요)')
    if (existing.some((v) => v.youtubeId === id)) return setError('이미 저장한 영상이에요.')
    setError(null)
    setSaving(true)
    let finalTitle = title.trim()
    if (!finalTitle) {
      const fetched = await fetchYouTubeTitle(id)
      if (!fetched) {
        setNeedTitle(true)
        setSaving(false)
        return setError('제목을 자동으로 못 가져왔어요. 직접 적어주세요.')
      }
      finalTitle = fetched
    }
    await addVideo(store, id, finalTitle)
    setUrl('')
    setTitle('')
    setNeedTitle(false)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className={`${ui.card} flex flex-col gap-2`}>
      <label>
        <span className={ui.label}>YouTube 주소 붙여넣기</span>
        <div className="flex gap-2">
          <input
            className={ui.input}
            value={url}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className={ui.buttonPrimary} disabled={!url.trim() || saving}>
            {saving ? '추가 중…' : '추가'}
          </button>
        </div>
      </label>
      {needTitle && (
        <label>
          <span className={ui.label}>제목</span>
          <input className={ui.input} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  )
}
