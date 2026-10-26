import { useEffect, useState } from "react";
/** Reserved campaign frame; failures keep the event identity and layout visible. */
export default function EventArtwork({
  src,
  title,
  portrait = false,
  eager = false,
}: {
  src: string;
  title: string;
  portrait?: boolean;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div
      className={
        "event-artwork " +
        (portrait ? "event-artwork--portrait" : "event-artwork--landscape")
      }
    >
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
          <span className="font-display text-2xl text-gold">{title}</span>
          <p className="text-xs text-text-secondary">
            Artwork is temporarily unavailable
          </p>
        </div>
      ) : (
        <img
          src={src}
          alt=""
          width={portrait ? 800 : 1440}
          height={portrait ? 1200 : 810}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      )}
    </div>
  );
}
