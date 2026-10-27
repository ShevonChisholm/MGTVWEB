import { useState } from "react";
export function MusicArtwork({
  src,
  hero = false,
  label = "Release artwork unavailable",
}: {
  src?: string;
  hero?: boolean;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="music-artwork">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={hero ? 960 : 640}
          height={hero ? 960 : 640}
          loading={hero ? "eager" : "lazy"}
          fetchPriority={hero ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="music-artwork__fallback">
          <span aria-hidden="true">♫</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
export function MusicCardSkeletons({
  kind,
}: {
  kind: "track" | "music-video";
}) {
  return (
    <div
      role="status"
      aria-label={kind === "track" ? "Loading tracks" : "Loading music videos"}
      className="music-results-grid"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <article
          key={i}
          aria-hidden="true"
          className={
            "music-card-skeleton " +
            (kind === "track"
              ? "music-card-skeleton--track"
              : "music-card-skeleton--video")
          }
        >
          <div className="music-card-skeleton__art mgtv-skeleton" />
          <div className="music-card-skeleton__body">
            <div className="music-card__format mgtv-skeleton">&nbsp;</div>
            <div className="music-card__title mgtv-skeleton" />
            <div className="music-card__artist mgtv-skeleton">&nbsp;</div>
            <div className="music-card__meta mgtv-skeleton">&nbsp;</div>
            <div className="music-card__actions">&nbsp;</div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function MusicReleaseSkeleton({ audio }: { audio: boolean }) {
  return (
    <main
      className="min-h-screen bg-bg-base pt-24"
      role="status"
      aria-label={audio ? "Loading track" : "Loading music video"}
    >
      <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
        <div className="mb-8 h-11 w-32 mgtv-skeleton" />
        {audio ? (
          <div className="track-release__identity" aria-hidden="true">
            <div className="track-release__sleeve mgtv-skeleton" />
            <div className="space-y-5">
              <div className="h-4 w-40 mgtv-skeleton" />
              <div className="h-20 w-full mgtv-skeleton" />
              <div className="h-7 w-48 mgtv-skeleton" />
              <div className="h-24 w-full mgtv-skeleton" />
              <div className="h-12 w-48 mgtv-skeleton" />
            </div>
          </div>
        ) : (
          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
            aria-hidden="true"
          >
            <div>
              <div className="aspect-video w-full mgtv-skeleton" />
              <div className="mt-8 h-10 w-3/4 mgtv-skeleton" />
              <div className="mt-6 h-20 w-full mgtv-skeleton" />
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 mgtv-skeleton" />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
