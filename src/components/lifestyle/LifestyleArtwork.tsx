import { useState } from "react";
export default function LifestyleArtwork({
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
    <div className="lifestyle-artwork">
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
        <div className="lifestyle-artwork__fallback">
          <span aria-hidden="true">▧</span>
          <span>Feature artwork unavailable</span>
        </div>
      )}
    </div>
  );
}
