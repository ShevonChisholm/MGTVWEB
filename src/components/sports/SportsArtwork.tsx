import { useState } from "react";
export default function SportsArtwork({
  src,
  priority = false,
}: {
  src?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="sports-artwork">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={1440}
          height={810}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="sports-artwork__fallback">
          <span aria-hidden="true">▷</span>
          <span>Coverage artwork unavailable</span>
        </div>
      )}
    </div>
  );
}
