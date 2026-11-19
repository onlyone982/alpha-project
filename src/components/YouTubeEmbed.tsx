import { youtubeEmbedUrl } from '../lib/youtube'

/** YouTube 영상 (youtube-nocookie 임베드, 16:9) */
export function YouTubeEmbed({ youtubeId, title, autoplay = false }: { youtubeId: string; title: string; autoplay?: boolean }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-2">
      <iframe
        className="h-full w-full"
        src={youtubeEmbedUrl(youtubeId, autoplay)}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
