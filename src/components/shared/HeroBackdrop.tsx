import { homePosterReady } from "@/lib/homeStartup";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FeaturedClipPlayback,
  readFeaturedMuted,
  saveFeaturedMuted,
} from "@/lib/featuredClip";
const AdaptiveVideo = lazy(() =>
  import("@/components/player/AdaptiveVideo").then((m) => ({
    default: m.AdaptiveVideo,
  })),
);
/** Poster first. Public editorial clips run only under an actual mouse hover. */
export function HeroBackdrop({
  poster,
  portraitPoster,
  featureUrl,
  sideGradient = true,
  soundControlTop = 20,
}: {
  poster: string;
  portraitPoster?: string | null;
  featureUrl?: string | null;
  sideGradient?: boolean;
  soundControlTop?: number;
}) {
  const video = useRef<HTMLVideoElement>(null),
    root = useRef<HTMLDivElement>(null),
    wanted = useRef(false),
    inside = useRef(false),
    visible = useRef(true),
    playback = useRef<FeaturedClipPlayback | null>(null),
    preferredMuted = useRef(readFeaturedMuted());
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    playback.current?.stop();
    video.current = node;
    playback.current = node
      ? new FeaturedClipPlayback(
          node,
          () =>
            inside.current &&
            wanted.current &&
            visible.current &&
            !document.hidden,
          setMuted,
          () => {
            setFailed(true);
            setPlaying(false);
          },
        )
      : null;
    setVideoElement(node);
  }, []);
  const [allowed, setAllowed] = useState(false),
    [hovered, setHovered] = useState(false),
    [playing, setPlaying] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [muted, setMuted] = useState(readFeaturedMuted);
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
      playback.current?.stop();
      setHovered(false);
      setPlaying(false);
      setReady(false);
    };
    const enter = (event: PointerEvent) => {
      if (!allowed || event.pointerType !== "mouse" || inside.current) return;
      inside.current = true;
      preferredMuted.current = readFeaturedMuted();
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
      playback.current?.stop();
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
        void playback.current?.play(preferredMuted.current);
      else playback.current?.stop();
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
      playback.current?.stop();
    };
  }, [featureUrl, allowed, hovered, failed, videoElement]);
  async function toggle() {
    const element = video.current;
    if (!element || !inside.current) return;
    if (playing) {
      wanted.current = false;
      playback.current?.stop();
    } else {
      wanted.current = true;
      await playback.current?.play(preferredMuted.current, true);
    }
  }
  function toggleSound() {
    const next = !muted;
    preferredMuted.current = next;
    saveFeaturedMuted(next);
    setMuted(next);
    if (wanted.current) void playback.current?.play(next, true);
    else if (video.current) video.current.muted = next;
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
            muted={muted}
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
                void playback.current?.play(preferredMuted.current);
            }}
            onLoadedData={() => {
              setReady(true);
              if (
                inside.current &&
                wanted.current &&
                visible.current &&
                !document.hidden
              )
                void playback.current?.play(preferredMuted.current);
            }}
            onPlaying={() => {
              if (
                !inside.current ||
                !wanted.current ||
                !visible.current ||
                document.hidden
              ) {
                playback.current?.stop();
                return;
              }
              setPlaying(true);
            }}
            onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
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
          onClick={toggleSound}
          aria-label={muted ? "Unmute featured clip" : "Mute featured clip"}
          title={muted ? "Enable sound" : "Mute sound"}
          style={{ top: soundControlTop }}
          className="mgtv-featured-sound absolute right-5 z-30 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5 6 9H3v6h3l5 4V5Z"
            />
            {muted ? (
              <path strokeLinecap="round" d="m16 9 6 6m0-6-6 6" />
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"
                />
              </>
            )}
          </svg>
        </button>
      )}
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
