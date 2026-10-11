type VideoCardProps = {
  title: string;
  id: string;
  portrait?: boolean;
};

export function VideoCard({ title, id, portrait = true }: VideoCardProps) {
  return (
    <article className={`video-card ${portrait ? 'portrait' : 'landscape'}`}>
      <div className="video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?controls=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="video-card-footer"><span>{title}</span><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">Watch on YouTube</a></div>
    </article>
  );
}
