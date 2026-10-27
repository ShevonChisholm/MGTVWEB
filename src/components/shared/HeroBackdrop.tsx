import { homePosterReady } from "@/lib/homeStartup";
const AdaptiveVideo = lazy(() =>
  import("@/components/player/AdaptiveVideo").then((m) => ({
    default: m.AdaptiveVideo,
  })),
);
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
/** Poster first. Public editorial clips run only under an actual mouse hover. */
export function HeroBackdrop({
  poster,
  portraitPoster,
  featureUrl,
  sideGradient = true,
}: {
  poster: string;
  portraitPoster?: string | null;
  featureUrl?: string | null;
  sideGradient?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null),
    root = useRef<HTMLDivElement>(null),
    wanted = useRef(false),
    inside = useRef(false),
    visible = useRef(true);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    video.current = node;
    setVideoElement(node);
  }, []);
  const [allowed, setAllowed] = useState(false),
    [hovered, setHovered] = useState(false),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)"),
      mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setAllowed(!motion.matches && mouse.matches);
    update();
    motion.addEventListener("change", update);
    mouse.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      mouse.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    const surface = root.current?.parentElement;
    if (!surface) return;
    const leave = () => {
      inside.current = false;
      wanted.current = false;
      video.current?.pause();
      setHovered(false);
      setPlaying(false);
      setReady(false);
    };
    const enter = (event: PointerEvent) => {
      if (!allowed || event.pointerType !== "mouse" || inside.current) return;
      inside.current = true;
      wanted.current = true;
      setFailed(false);
      setReady(false);
      setHovered(true);
    };
    leave();
    // The surrounding hero owns hover: text, buttons and sponsor credits sit above the backdrop.
    surface.addEventListener("pointerenter", enter);
    surface.addEventListener("pointermove", enter);
    surface.addEventListener("pointerleave", leave);
    return () => {
      surface.removeEventListener("pointerenter", enter);
      surface.removeEventListener("pointermove", enter);
      surface.removeEventListener("pointerleave", leave);
      wanted.current = false;
      inside.current = false;
      video.current?.pause();
    };
  }, [featureUrl, allowed]);
  useEffect(() => {
    const element = videoElement,
      node = root.current;
    if (!element || !node || !allowed || !hovered || failed) return;
    const reconcile = () => {
      if (
        inside.current &&
        wanted.current &&
        visible.current &&
        !document.hidden
      )
        void element.play().catch(() => setPlaying(false));
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current =
          entry.isIntersecting && entry.intersectionRatio >= 0.05;
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
  }, [featureUrl, allowed, hovered, failed, videoElement]);
  async function toggle() {
    const element = video.current;
    if (!element || !inside.current) return;
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
      <picture>
        {portraitPoster && (
          <source media="(max-width: 767px)" srcSet={portraitPoster} />
        )}
        <img
          src={poster}
          onLoad={(event) => homePosterReady(event.currentTarget)}
          onError={() => homePosterReady()}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {allowed && hovered && featureUrl && !failed && (
        <Suspense fallback={null}>
          <AdaptiveVideo
            ref={attachVideo}
            key={featureUrl}
            src={featureUrl}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready && playing ? "opacity-100" : "opacity-0"}`}
            onLoadedMetadata={() => {
              if (
                inside.current &&
                wanted.current &&
                visible.current &&
                !document.hidden
              )
                void video.current?.play().catch(() => setPlaying(false));
            }}
            onLoadedData={() => {
              setReady(true);
              if (
                inside.current &&
                wanted.current &&
                visible.current &&
                !document.hidden
              )
                void video.current?.play().catch(() => setPlaying(false));
            }}
            onPlaying={() => {
              if (!inside.current || !wanted.current) {
                video.current?.pause();
                return;
              }
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        </Suspense>
      )}
      {sideGradient && (
        <div className="hero-side-gradient pointer-events-none absolute inset-0" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />
      {allowed && hovered && featureUrl && !failed && (
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
