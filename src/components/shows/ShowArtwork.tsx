import { useState } from "react";
export function ShowArtwork({
  src,
  landscape = false,
  priority = false,
}: {
  src?: string;
  landscape?: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="show-artwork">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={landscape ? 1440 : 720}
          height={landscape ? 810 : 1080}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="show-artwork__fallback">
          <span aria-hidden="true">▷</span>
          <span>Artwork unavailable</span>
        </div>
      )}
    </div>
  );
}
export function ShowGridSkeleton() {
  return (
    <div className="show-results-grid" role="status" aria-label="Loading shows">
      {Array.from({ length: 6 }, (_, i) => (
        <article
          className="show-card show-card--skeleton"
          key={i}
          aria-hidden="true"
        >
          <div className="aspect-[2/3] mgtv-skeleton" />
          <div className="show-card__body">
            <div className="h-3 w-16 mgtv-skeleton" />
            <div className="show-card__title mgtv-skeleton" />
            <div className="h-4 w-24 mgtv-skeleton" />
            <div className="h-4 w-32 mgtv-skeleton" />
            <div className="h-11 w-full mgtv-skeleton" />
          </div>
        </article>
      ))}
    </div>
  );
}
export function ShowDetailSkeleton() {
  return (
    <main
      className="min-h-screen pt-24"
      role="status"
      aria-label="Loading series"
    >
      <div className="show-detail-hero mgtv-skeleton" />
      <div
        className="mx-auto max-w-[1760px] px-6 py-10 md:px-8 space-y-8"
        aria-hidden="true"
      >
        <div className="h-20 max-w-3xl mgtv-skeleton" />
        <div className="h-11 w-56 mgtv-skeleton" />
        {[0, 1].map((i) => (
          <div key={i} className="h-48 max-w-4xl mgtv-skeleton" />
        ))}
      </div>
    </main>
  );
}
