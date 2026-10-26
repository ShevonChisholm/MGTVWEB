import { BrandLogo } from "@/components/shared/BrandLogo";
import { playAuthorizedMedia } from "@/lib/viewingBudget";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Ref,
  type VideoHTMLAttributes,
} from "react";
import { Link } from "react-router";
import { useCustomerSession } from "@/lib/customerAuth";
type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  base: any;
  forwarded: Ref<HTMLVideoElement>;
};
function clock(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const seconds = Math.floor(value);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {name === "play" ? (
        <path fill="currentColor" stroke="none" d="m8 4 12 8-12 8z" />
      ) : name === "pause" ? (
        <path d="M8 4v16M16 4v16" strokeWidth="4" />
      ) : name === "full" ? (
        <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      ) : name === "mute" ? (
        <>
          <path d="m11 4-5 4H2v8h4l5 4zM16 9l6 6m0-6-6 6" />
        </>
      ) : name === "volume" ? (
        <>
          <path d="m11 4-5 4H2v8h4l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
        </>
      ) : (
        <>
          <path
            d={
              name === "back"
                ? "M4 8V3m0 5h5M4 8a9 9 0 1 1-1 8"
                : "M20 8V3m0 5h-5m5 0a9 9 0 1 0 1 8"
            }
          />
          <text x="7" y="16" fontSize="8" fill="currentColor" stroke="none">
            10
          </text>
        </>
      )}
    </svg>
  );
}
export function MGTVPlayer({ base: Base, forwarded, ...props }: Props) {
  const root = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement | null>(null),
    hide = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const auth = useCustomerSession();
  const [paused, setPaused] = useState(true),
    [waiting, setWaiting] = useState(false),
    [ended, setEnded] = useState(false),
    [position, setPosition] = useState(0),
    [duration, setDuration] = useState(0),
    [muted, setMuted] = useState(false),
    [volume, setVolume] = useState(1),
    [speed, setSpeed] = useState(1),
    [visible, setVisible] = useState(true),
    [message, setMessage] = useState(""),
    [captionOptions, setCaptionOptions] = useState<
      { id: string; label: string }[]
    >([]),
    [captionChoice, setCaptionChoice] = useState("off"),
    [fullscreen, setFullscreen] = useState(false);
  const preview = /\/preview(?:\?|$)/.test(props.src ?? ""),
    title = String(props["aria-label"] ?? "MGTV video"),
    fullPath = location.pathname;
  const destination = !auth.session
    ? "/auth/sign-in?returnTo=" + encodeURIComponent(fullPath)
    : !auth.session.activeProfileId
      ? "/profiles?returnTo=" + encodeURIComponent(fullPath)
      : fullPath;
  function wake() {
    setVisible(true);
    clearTimeout(hide.current);
    hide.current = setTimeout(() => {
      if (video.current && !video.current.paused) setVisible(false);
    }, 3500);
  }
  const attach = useCallback(
    (element: HTMLVideoElement | null) => {
      video.current = element;
      if (typeof forwarded === "function") forwarded(element);
      else if (forwarded) forwarded.current = element;
    },
    [forwarded],
  );
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    setEnded(false);
    setDuration(0);
    setPosition(0);
    setMessage("");
    setPaused(element.paused);
    setCaptionChoice("off");
    const captionSync = () => {
      const tracks = Array.from(
        element.querySelectorAll<HTMLTrackElement>(
          "track[data-mgtv-caption-id]",
        ),
      );
      setCaptionOptions(
        tracks.map((t) => ({
          id: t.dataset.mgtvCaptionId!,
          label: t.label || t.srclang,
        })),
      );
      setCaptionChoice(
        tracks.find((t) => t.track.mode === "showing")?.dataset.mgtvCaptionId ??
          "off",
      );
    };
    element.addEventListener("mgtv:captions", captionSync);
    element.textTracks.addEventListener("change", captionSync);
    const sync = () => {
      setPaused(element.paused);
      if (element.readyState >= 1) setPosition(element.currentTime || 0);
      if (Number.isFinite(element.duration) && element.duration > 0)
        setDuration(element.duration);
      setMuted(element.muted);
      setVolume(element.volume);
      setSpeed(element.playbackRate);
    };
    const ready = () => {
      setWaiting(false);
      sync();
    };
    const wait = () => setWaiting(true);
    const finish = () => {
      setEnded(true);
      setVisible(true);
      sync();
    };
    for (const event of [
      "play",
      "pause",
      "timeupdate",
      "durationchange",
      "volumechange",
      "ratechange",
      "loadedmetadata",
      "seeked",
    ])
      element.addEventListener(event, sync);
    element.addEventListener("waiting", wait);
    element.addEventListener("playing", ready);
    element.addEventListener("canplay", ready);
    element.addEventListener("ended", finish);
    const screen = () => {
      setFullscreen(document.fullscreenElement === root.current);
      wake();
    };
    document.addEventListener("fullscreenchange", screen);
    sync();
    return () => {
      clearTimeout(hide.current);
      element.removeEventListener("mgtv:captions", captionSync);
      element.textTracks.removeEventListener("change", captionSync);
      for (const event of [
        "play",
        "pause",
        "timeupdate",
        "durationchange",
        "volumechange",
        "ratechange",
        "loadedmetadata",
        "seeked",
      ])
        element.removeEventListener(event, sync);
      element.removeEventListener("waiting", wait);
      element.removeEventListener("playing", ready);
      element.removeEventListener("canplay", ready);
      element.removeEventListener("ended", finish);
      document.removeEventListener("fullscreenchange", screen);
    };
  }, [props.src]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const budget = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.message) {
        setMessage(detail.message);
        setPaused(true);
      } else if (detail?.limited && detail.remainingSeconds !== null) {
        setMessage(
          detail.remainingSeconds === 0 && detail.windowId
            ? "Final viewing window · resets at midnight in Jamaica"
            : `Viewing time: ${Math.ceil(detail.remainingSeconds / 60)} min left today · Jamaica time`,
        );
      }
    };
    element.addEventListener("mgtv:viewing-budget", budget);
    return () => element.removeEventListener("mgtv:viewing-budget", budget);
  }, [props.src]);
  function adPlaying() {
    return !!root.current?.querySelector('[data-ad-break="active"]');
  }
  function play() {
    if (adPlaying()) return;
    const element = video.current;
    if (!element) return;
    if (ended) {
      element.currentTime = 0;
      setEnded(false);
    }
    if (element.paused)
      void playAuthorizedMedia(element, ended).catch(() =>
        setMessage("Press play when you’re ready."),
      );
    else element.pause();
    wake();
  }
  function seek(seconds: number) {
    if (adPlaying()) return;
    const element = video.current;
    if (element && Number.isFinite(element.duration)) {
      element.currentTime = Math.max(0, Math.min(seconds, element.duration));
      setPosition(element.currentTime);
    }
    wake();
  }
  async function full() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen)
        await root.current.requestFullscreen();
      else (video.current as any)?.webkitEnterFullscreen?.();
    } catch {
      setMessage("Full screen is unavailable in this browser.");
    }
    wake();
  }
  function mute() {
    if (video.current) video.current.muted = !video.current.muted;
    wake();
  }
  const control =
    "mgtv-player-button grid size-9 shrink-0 place-items-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-gold sm:size-10";
  return (
    <div
      ref={root}
      className={
        "mgtv-player relative h-full w-full overflow-hidden bg-black " +
        (props.className ?? "")
      }
      role="group"
      aria-label={`${title} player`}
      tabIndex={0}
      onPointerMove={wake}
      onPointerDown={wake}
      onFocus={wake}
      onKeyDown={(event) => {
        if (
          adPlaying() ||
          (event.target as HTMLElement).closest("button,input,select,a")
        )
          return;
        const key = event.key.toLowerCase();
        if ([" ", "k", "arrowleft", "arrowright", "m", "f"].includes(key)) {
          event.preventDefault();
          if (key === " " || key === "k") play();
          else if (key === "arrowleft") seek(position - 10);
          else if (key === "arrowright") seek(position + 10);
          else if (key === "m") mute();
          else void full();
        }
      }}
    >
      <Base
        {...props}
        ref={attach}
        controls={false}
        data-mgtv-custom-controls="true"
        className="h-full w-full object-contain"
      />
      <div
        className={`mgtv-content-controls pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-gradient-to-b from-black/85 to-transparent px-4 pb-8 pt-3 transition-opacity ${visible || paused ? "opacity-100" : "opacity-0"}`}
      >
        <BrandLogo className="h-8 w-16" />
        <span className="min-w-0 truncate text-xs text-white/75">{title}</span>
        {preview && (
          <span className="ml-auto rounded border border-gold/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold">
            Preview
          </span>
        )}
      </div>
      {waiting && !paused && (
        <div
          role="status"
          aria-label="Buffering video"
          className="mgtv-content-controls pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-gold motion-reduce:animate-none" />
        </div>
      )}
      {paused && (!preview || !ended) && !waiting && (
        <button
          type="button"
          onClick={play}
          aria-label={ended ? "Replay video" : "Play video"}
          className="mgtv-content-controls absolute left-1/2 top-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-black/60 text-gold backdrop-blur-sm"
        >
          <Icon name="play" />
        </button>
      )}
      {preview && ended && (
        <div className="absolute inset-0 z-30 grid place-items-center overflow-hidden bg-black">
          <img
            src={props.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30" />
          <div className="relative max-w-lg px-5 text-center">
            <BrandLogo className="mx-auto hidden h-12 w-24 sm:block" />
            <h2 className="mt-2 font-display text-2xl leading-tight sm:text-4xl">
              There’s more to the story.
            </h2>
            <p className="mx-auto mt-2 hidden max-w-sm text-xs leading-relaxed text-white/75 sm:block sm:text-sm">
              The preview has ended. Keep watching with your MGTV account and an
              eligible plan where required.
            </p>
            {auth.loading ? (
              <p role="status">Checking your account…</p>
            ) : (
              <Link
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-5 text-sm font-semibold text-black hover:bg-gold-light"
                to={destination}
              >
                {!auth.session
                  ? "Sign in to watch the full video"
                  : !auth.session.activeProfileId
                    ? "Choose a profile to keep watching"
                    : "Watch the full video"}
              </Link>
            )}
            <button
              type="button"
              onClick={play}
              className="mx-auto mt-1 block min-h-8 px-4 text-xs font-medium text-white/80 hover:text-gold"
            >
              Replay preview
            </button>
          </div>
        </div>
      )}
      {(!ended || !preview) && (
        <div
          className={`mgtv-content-controls absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-3 pb-2 pt-9 transition-opacity ${visible || paused ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <input
            type="range"
            min={0}
            max={duration || 1}
            step="0.1"
            value={Math.min(position, duration || 1)}
            onChange={(event) => seek(Number(event.target.value))}
            disabled={!duration}
            aria-label="Seek video"
            aria-valuetext={`${clock(position)} of ${clock(duration)}`}
            className="mgtv-seek block h-5 w-full cursor-pointer accent-gold"
          />
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className={control}
              onClick={play}
              aria-label={paused ? "Play" : "Pause"}
            >
              <Icon name={paused ? "play" : "pause"} />
            </button>
            <button
              type="button"
              className={control}
              onClick={() => seek(position - 10)}
              aria-label="Rewind 10 seconds"
            >
              <Icon name="back" />
            </button>
            <button
              type="button"
              className={control}
              onClick={() => seek(position + 10)}
              aria-label="Forward 10 seconds"
            >
              <Icon name="forward" />
            </button>
            <button
              type="button"
              className={control}
              onClick={mute}
              aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
            >
              <Icon name={muted || volume === 0 ? "mute" : "volume"} />
            </button>
            <input
              aria-label="Volume"
              type="range"
              min={0}
              max={1}
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(event) => {
                if (video.current) {
                  video.current.volume = Number(event.target.value);
                  video.current.muted = false;
                }
                wake();
              }}
              className="mr-2 hidden w-16 accent-gold md:block"
            />
            <span className="min-w-0 whitespace-nowrap px-1 text-[10px] tabular-nums text-white/80 sm:text-xs">
              {clock(position)} / {clock(duration)}
            </span>
            <span className="flex-1" />
            <select
              aria-label="Caption language"
              value={captionChoice}
              disabled={!captionOptions.length}
              className="h-9 min-w-0 max-w-20 rounded border border-white/20 bg-black/70 px-1 text-[10px] text-white disabled:opacity-40 sm:max-w-36 sm:text-xs"
              onChange={(event) => {
                const selected = event.target.value;
                const element = video.current;
                if (element) {
                  for (const track of Array.from(element.textTracks))
                    track.mode = "disabled";
                  for (const track of element.querySelectorAll<HTMLTrackElement>(
                    "track[data-mgtv-caption-id]",
                  ))
                    if (track.dataset.mgtvCaptionId === selected)
                      track.track.mode = "showing";
                }
                setCaptionChoice(selected);
                wake();
              }}
            >
              <option value="off">CC Off</option>
              {captionOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Playback speed"
              value={speed}
              className="hidden h-9 rounded bg-black/50 px-1 text-xs text-white sm:block"
              onChange={(event) => {
                if (video.current) {
                  video.current.defaultPlaybackRate = Number(
                    event.target.value,
                  );
                  video.current.playbackRate = Number(event.target.value);
                }
                wake();
              }}
            >
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}×
                </option>
              ))}
            </select>
            <button
              type="button"
              className={control}
              onClick={() => void full()}
              aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            >
              <Icon name="full" />
            </button>
          </div>
          {message && (
            <p role="status" className="px-2 py-1 text-xs text-gold">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
