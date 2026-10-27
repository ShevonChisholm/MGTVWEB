import { useState } from "react";
/** A digital album sleeve; decorative record texture is never a separate product. */
export function AlbumArtwork({
  src,
  hero = false,
}: {
  src?: string | null;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={"album-artwork" + (hero ? " album-artwork--hero" : "")}>
      <div className="album-artwork__record" aria-hidden="true">
        <span />
      </div>
      <div className="album-artwork__sleeve">
        {src && !failed ? (
          <img
            src={src}
            alt=""
            width={960}
            height={960}
            loading={hero ? "eager" : "lazy"}
            fetchPriority={hero ? "high" : "auto"}
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="album-artwork__fallback">
            <span aria-hidden="true">♫</span>
            <span>Album artwork unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}
export function AlbumCardSkeletons() {
  return (
    <div role="status" aria-label="Loading albums" className="album-grid">
      {Array.from({ length: 8 }, (_, i) => (
        <div className="album-card" aria-hidden="true" key={i}>
          <div className="album-artwork">
            <div className="album-artwork__record" />
            <div className="album-artwork__sleeve mgtv-skeleton" />
          </div>
          <div className="album-card__body">
            <span className="album-card__label mgtv-skeleton">&nbsp;</span>
            <div className="album-card__title mgtv-skeleton" />
            <p className="album-card__meta mgtv-skeleton">&nbsp;</p>
            <span className="album-card__action">&nbsp;</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export function AlbumDetailSkeleton() {
  return (
    <main
      className="min-h-screen bg-bg-base pt-16"
      role="status"
      aria-label="Loading album"
    >
      <div className="mx-auto max-w-[1760px] px-6 pb-16 pt-10 md:px-8">
        <div className="mb-6 h-10 w-32 mgtv-skeleton" />
        <section className="album-detail__identity" aria-hidden="true">
          <div className="album-detail__cover">
            <div className="album-artwork">
              <div className="album-artwork__record" />
              <div className="album-artwork__sleeve mgtv-skeleton" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-4 w-32 mgtv-skeleton" />
            <div className="h-20 w-full mgtv-skeleton" />
            <div className="h-24 w-full mgtv-skeleton" />
            <div className="h-11 w-40 mgtv-skeleton" />
          </div>
        </section>
        <div className="mt-10 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 w-full mgtv-skeleton" />
          ))}
        </div>
      </div>
    </main>
  );
}
