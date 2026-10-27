import { useState } from "react";
export default function NewsArtwork({
  src,
  alt = "",
  priority = false,
}: {
  src?: string;
  alt?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="news-artwork">
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          width={1440}
          height={810}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="news-artwork__fallback">
          <span aria-hidden="true">▧</span>
          <span>Story artwork unavailable</span>
        </div>
      )}
    </div>
  );
}
