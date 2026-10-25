import { AdaptiveVideo } from "@/components/player/AdaptiveVideo";
import { useEffect, useRef, useState } from "react";
/** Decorative, public editorial clip. Never uses a full-content playback URL. */
export function HeroBackdrop({
  poster,
  featureUrl,
  sideGradient = true,
}: {
  poster: string;
  featureUrl?: string | null;
  sideGradient?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null),
    root = useRef<HTMLDivElement>(null),
    wanted = useRef(true),
    visible = useRef(true);
  const [allowed, setAllowed] = useState(false),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    setReady(false);
    setFailed(false);
    wanted.current = true;
    setPlaying(false);
  }, [featureUrl]);
  useEffect(() => {
    const element = video.current,
      node = root.current;
    if (!element || !node || !allowed || failed) return;
    const reconcile = () => {
      if (wanted.current && visible.current && !document.hidden) {
        void element.play().catch(() => setPlaying(false));
      } else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        reconcile();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", reconcile);
    reconcile();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", reconcile);
      element.pause();
    };
  }, [featureUrl, allowed, failed]);
  async function toggle() {
    const element = video.current;
    if (!element) return;
    if (playing) {
      wanted.current = false;
      element.pause();
    } else {
      wanted.current = true;
      try {
        await element.play();
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <div ref={root} className="hero-backdrop absolute inset-0">
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {allowed && featureUrl && !failed && (
        <AdaptiveVideo
          ref={video}
          key={featureUrl}
          src={featureUrl}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => {
            setReady(true);
            if (wanted.current && visible.current && !document.hidden)
              void video.current?.play().catch(() => setPlaying(false));
          }}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      {sideGradient && <div className="hero-side-gradient pointer-events-none absolute inset-0" />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
      {allowed && featureUrl && !failed && (
        <button
          type="button"
          onClick={() => void toggle()}
          aria-label={playing ? "Pause featured clip" : "Play featured clip"}
          className="absolute bottom-5 right-5 z-20 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 px-3 text-sm text-white hover:bg-black/80"
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
      )}
    </div>
  );
}
