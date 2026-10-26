import { useEffect, useState } from "react";
function Cover({
  src,
  className,
  front = false,
}: {
  src?: string;
  className: string;
  front?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className={className}>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={640}
          height={640}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="playlist-artwork__fallback" aria-hidden="true">
          ♫
        </span>
      )}
      {front && <span className="playlist-artwork__veil" />}
    </div>
  );
}
export default function PlaylistArtwork({ item }: { item: any }) {
  const count =
    typeof item.itemCount === "number"
      ? item.itemCount
      : Array.isArray(item.items)
        ? item.items.length
        : undefined;
  const previews: string[] =
    item.previewArtwork ??
    item.items?.map((m: any) => m.artwork?.portraitUrl).filter(Boolean) ??
    [];
  const layers = count === undefined ? 2 : Math.min(2, Math.max(0, count - 1)),
    image = item.coverUrl ?? previews[0];
  return (
    <div className="playlist-artwork" aria-hidden="true">
      {layers > 1 && (
        <Cover
          src={previews[1] ?? previews[0]}
          className="playlist-artwork__sheet playlist-artwork__sheet--back"
        />
      )}
      {layers > 0 && (
        <Cover
          src={previews[0]}
          className="playlist-artwork__sheet playlist-artwork__sheet--middle"
        />
      )}
      <Cover
        src={image}
        className="playlist-artwork__sheet playlist-artwork__sheet--front"
        front
      />
      <span className="playlist-artwork__label">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 5h13M3 10h13M3 15h8M17 14v7l5-3.5-5-3.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {item.playlistKind === "video" ? "VIDEO PLAYLIST" : "AUDIO PLAYLIST"}
      </span>
    </div>
  );
}
