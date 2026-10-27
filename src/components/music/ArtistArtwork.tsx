import { useState } from "react";
/** A reserved editorial frame: groups remain groups instead of circular solo portraits. */
export function ArtistArtwork({
  src,
  hero = false,
}: {
  src?: string | null;
  hero?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={"artist-artwork" + (hero ? " artist-artwork--hero" : "")}>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={1536}
          height={1024}
          loading={hero ? "eager" : "lazy"}
          fetchPriority={hero ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="artist-artwork__fallback">
          <span aria-hidden="true">♫</span>
          <span>Artist artwork unavailable</span>
        </div>
      )}
      {hero && <div className="artist-artwork__shade" />}
    </div>
  );
}
export function ArtistCardSkeletons() {
  return (
    <div role="status" aria-label="Loading artists" className="artist-grid">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} aria-hidden="true" className="artist-card">
          <div className="artist-artwork mgtv-skeleton" />
          <div className="artist-card__body">
            <div className="artist-card__title mgtv-skeleton" />
            <p className="artist-card__genre mgtv-skeleton">&nbsp;</p>
            <p className="artist-card__origin mgtv-skeleton">&nbsp;</p>
            <span className="artist-card__action">&nbsp;</span>
          </div>
        </div>
      ))}
    </div>
  );
}
