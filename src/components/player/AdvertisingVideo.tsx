import {
  useEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
  type Ref,
} from "react";
import { customerApi } from "@/lib/customerAuth";
type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  base: any;
  forwarded: Ref<HTMLVideoElement>;
};
export function advertisingSource(src?: string) {
  const m =
    /^\/api\/v1\/customer\/(movies|episodes|music|events|sports)\/([a-f0-9-]{36})\/video(?:\?|$)/i.exec(
      src ?? "",
    );
  return m
    ? {
        kind: (
          {
            sports: "sports",
            movies: "movie",
            episodes: "episode",
            music: "music",
            events: "event",
          } as Record<string, string>
        )[m[1]],
        targetId: m[2],
      }
    : null;
}
export default function AdvertisingVideo({
  base: Base,
  forwarded,
  ...props
}: Props) {
  const main = useRef<HTMLVideoElement | null>(null),
    commercial = useRef<HTMLVideoElement | null>(null),
    session = useRef<string | null>(null),
    profile = useRef(""),
    live = useRef(true),
    queue = useRef<Promise<any>>(Promise.resolve()),
    lastAdTick = useRef(-1),
    adRef = useRef<any>(null),
    started = useRef(false),
    starting = useRef(false),
    resume = useRef(false);
  const [ad, setAd] = useState<any>(null),
    [preparing, setPreparing] = useState(true),
    [watched, setWatched] = useState(0),
    [message, setMessage] = useState(""),
    [playing, setPlaying] = useState(false);
  function attach(node: HTMLVideoElement | null) {
    main.current = node;
    if (typeof forwarded === "function") forwarded(node);
    else if (forwarded) forwarded.current = node;
  }
  function show(value: any) {
    adRef.current = value;
    setAd(value);
    setWatched(0);
    lastAdTick.current = -1;
    started.current = false;
    if (value) main.current?.pause();
  }
  function finish() {
    show(null);
    setPlaying(false);
    setMessage("");
    if (resume.current) void main.current?.play().catch(() => {});
  }
  function event(
    action: string,
    seconds = commercial.current?.currentTime ?? 0,
  ) {
    const value = adRef.current;
    if (!value) return Promise.resolve(null);
    const request = () =>
      customerApi(
        "/advertising/receipts/" + value.id + "/events",
        "POST",
        { action, seconds },
        { "X-Profile-Context": profile.current },
      );
    queue.current = queue.current.catch(() => {}).then(request);
    return queue.current;
  }
  async function begin() {
    if (starting.current) return;
    starting.current = true;
    resume.current = true;
    try {
      if (!started.current) {
        setMessage("Preparing advertisement…");
        await event("start", 0);
        if (!adRef.current || !live.current) return;
        started.current = true;
      }
      setMessage("");
      await commercial.current
        ?.play()
        .catch(() => setMessage("Press Play to start the advertisement."));
    } catch {
      finish();
    } finally {
      starting.current = false;
    }
  }
  useEffect(() => {
    live.current = true;
    const context = advertisingSource(props.src);
    if (!context) {
      setPreparing(false);
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setPreparing(false);
      }
    }, 5000);
    void (async () => {
      const identity = await customerApi("/session");
      profile.current = identity.activeProfileId;
      const result = await customerApi(
        "/advertising/playback",
        "POST",
        context,
        { "X-Profile-Context": profile.current },
      );
      if (cancelled) return;
      session.current = result.sessionId;
      show(result.ad);
    })()
      .catch(() => {
        /* No eligible or reachable advertisement must not block content. */
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setPreparing(false);
      });
    const ticker = setInterval(() => {
      const video = main.current;
      if (
        !session.current ||
        !video ||
        video.paused ||
        video.seeking ||
        adRef.current ||
        !live.current
      )
        return;
      void customerApi(
        "/advertising/playback/" + session.current + "/tick",
        "POST",
        { seconds: video.currentTime },
        { "X-Profile-Context": profile.current },
      )
        .then((r) => {
          if (live.current && r.ad) {
            resume.current = true;
            show(r.ad);
          }
        })
        .catch(() => {});
    }, 5000);
    return () => {
      cancelled = true;
      live.current = false;
      clearTimeout(timeout);
      clearInterval(ticker);
      commercial.current?.pause();
    };
  }, [props.src]);
  useEffect(() => {
    if (!preparing && !ad && resume.current)
      void main.current?.play().catch(() => {});
  }, [preparing, ad]);
  const caption = ad ? `Advertisement · ${ad.headline}` : "Preparing playback…";
  return (
    <div
      className="relative h-full w-full"
      data-ad-break={preparing || ad ? "active" : undefined}
    >
      <Base
        {...props}
        ref={attach}
        style={{
          ...props.style,
          ...(ad || preparing ? { visibility: "hidden" } : {}),
        }}
        onPlay={(e: any) => {
          props.onPlay?.(e);
          if (preparing || adRef.current) {
            resume.current = true;
            e.currentTarget.pause();
          }
        }}
      />
      {(preparing || ad) && (
        <div
          className="absolute inset-0 flex flex-col bg-bg-base"
          aria-label="Advertising playback"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-b from-black/90 to-transparent px-3 py-2 text-xs text-white">
            <span role="status" className="min-w-0 truncate">
              {caption}
            </span>
            {ad && (
              <a
                href={ad.destinationUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="shrink-0 text-gold"
                onClick={() => void event("click").catch(() => {})}
              >
                Visit advertiser ↗
              </a>
            )}
          </div>
          {ad ? (
            <>
              <div className="absolute inset-0">
                <Base
                  src={ad.url}
                  poster={ad.posterUrl ?? undefined}
                  ref={commercial}
                  playsInline
                  preload="metadata"
                  className="h-full w-full"
                  aria-label={"Advertisement: " + ad.headline}
                  onPlay={(e: any) => {
                    if (!started.current) {
                      e.currentTarget.pause();
                      void begin();
                      return;
                    }
                    setPlaying(true);
                    props.onPlay?.(e);
                  }}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={() => {
                    if (!started.current) return;
                    const seconds = commercial.current?.currentTime ?? 0;
                    if (seconds - lastAdTick.current < 1) return;
                    lastAdTick.current = seconds;
                    void event("progress", seconds)
                      .then((r) => {
                        if (live.current && r)
                          setWatched(r.watchedSeconds ?? 0);
                      })
                      .catch(() => {});
                  }}
                  onEnded={() =>
                    void event("complete")
                      .catch(() => event("fail"))
                      .finally(finish)
                  }
                  onError={() =>
                    void event("fail")
                      .catch(() => {})
                      .finally(finish)
                  }
                />
                {!playing && (
                  <button
                    className="absolute inset-0 flex items-center justify-center font-semibold text-accent"
                    onClick={() => void begin()}
                  >
                    Play advertisement
                  </button>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-black/90 to-transparent px-3 py-2 text-xs text-white">
                <span role="status">
                  {message ||
                    (watched < 5
                      ? `Skip in ${Math.max(1, Math.ceil(5 - watched))}s`
                      : "Ready to skip")}
                </span>
                <button
                  className="rounded-md border border-border px-3 py-2 text-text-primary disabled:opacity-50"
                  aria-label="Pause advertisement"
                  disabled={!playing}
                  onClick={() => commercial.current?.pause()}
                >
                  Pause
                </button>
                <button
                  className="rounded-md border border-border px-3 py-2 text-text-primary disabled:opacity-50"
                  disabled={watched < 5}
                  onClick={() =>
                    void event("skip")
                      .then(finish)
                      .catch(() =>
                        setMessage(
                          "Keep playing until skipping becomes available.",
                        ),
                      )
                  }
                >
                  Skip ad
                </button>
              </div>
            </>
          ) : (
            <p className="m-auto text-sm" role="status">
              Preparing playback…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
