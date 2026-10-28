import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import { Link } from "react-router";
import type { ApiMusic } from "@/context/MusicContext";
import { audioClock, ringPosition, seekKey } from "@/lib/audioPlayer";

function Icon({
  name,
}: {
  name:
    | "play"
    | "pause"
    | "previous"
    | "next"
    | "volume"
    | "muted"
    | "queue"
    | "close";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "play" ? (
        <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />
      ) : name === "pause" ? (
        <>
          <path d="M8 5v14M16 5v14" strokeWidth="4" />
        </>
      ) : name === "previous" ? (
        <>
          <path d="M5 5v14M19 5l-10 7 10 7Z" />
        </>
      ) : name === "next" ? (
        <>
          <path d="M19 5v14M5 5l10 7-10 7Z" />
        </>
      ) : name === "queue" ? (
        <>
          <path d="M4 5h16M4 11h10M4 17h7m6-3 4 3-4 3Z" />
        </>
      ) : name === "close" ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <>
          <path d="m11 4-6 5H2v6h3l6 5Z" />
          {name === "muted" ? (
            <path d="m16 9 6 6m0-6-6 6" />
          ) : (
            <>
              <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

type Props = {
  item: ApiMusic;
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  preview: boolean;
  handoff: boolean;
  notice: string;
  onNext?: () => Promise<void>;
  onClose: () => void;
  onContinue: () => Promise<void>;
  children: ReactNode;
};
/** Controls the existing authorized audio element; owns no stream/session state. */
export function MusicPlayerBar({
  item,
  audio,
  isPlaying,
  preview,
  handoff,
  notice,
  onNext,
  onClose,
  onContinue,
  children,
}: Props) {
  const [position, setPosition] = useState(0),
    [duration, setDuration] = useState(0),
    [volume, setVolume] = useState(1),
    [muted, setMuted] = useState(false),
    [waiting, setWaiting] = useState(true),
    [failed, setFailed] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const drag = useRef<number | null>(null);
  useEffect(() => {
    setError("");
    setFailed(false);
    setPosition(0);
    setDuration(0);
    setWaiting(true);
    drag.current = null;
    if (!audio) return;
    const sync = () => {
      if (drag.current === null)
        setPosition(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const sound = () => {
      setVolume(audio.volume);
      setMuted(audio.muted);
    };
    const ready = () => {
      setWaiting(false);
      sync();
    };
    const stall = () => setWaiting(true);
    const broken = () => {
      setWaiting(false);
      setFailed(true);
    };
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("durationchange", sync);
    audio.addEventListener("seeked", sync);
    audio.addEventListener("volumechange", sound);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("canplay", ready);
    audio.addEventListener("playing", ready);
    audio.addEventListener("waiting", stall);
    audio.addEventListener("error", broken);
    sync();
    sound();
    if (audio.readyState >= 3) ready();
    return () => {
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("durationchange", sync);
      audio.removeEventListener("seeked", sync);
      audio.removeEventListener("volumechange", sound);
      audio.removeEventListener("loadedmetadata", sync);
      audio.removeEventListener("canplay", ready);
      audio.removeEventListener("playing", ready);
      audio.removeEventListener("waiting", stall);
      audio.removeEventListener("error", broken);
    };
  }, [audio, item.id]);
  const seekable = !!audio && duration > 0 && !handoff && !failed;
  function seek(value: number) {
    if (!audio || !seekable) return;
    audio.currentTime = Math.max(0, Math.min(duration, value));
    setPosition(audio.currentTime);
  }
  function pointer(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    return (
      ringPosition(
        event.clientX,
        event.clientY,
        box.left + box.width / 2,
        box.top + box.height / 2,
      ) * duration
    );
  }
  async function act(work: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Try playback again.");
    } finally {
      setBusy(false);
    }
  }
  const percent = duration
      ? Math.min(100, Math.max(0, (position / duration) * 100))
      : 0,
    angle = (percent / 100) * Math.PI * 2 - Math.PI / 2;
  return (
    <div className="mgtv-audio-panel">
      <div className="mgtv-audio-identity">
        <Link
          to={"/music/track/" + item.id}
          className="mgtv-audio-avatar"
          title={item.title}
        >
          <img
            src={item.artwork.portraitUrl}
            alt={"Artwork for " + item.title}
          />
        </Link>
        <div className="mgtv-audio-meta">
          <span className="mgtv-audio-eyebrow">
            {preview ? "First listen · Preview" : "In your rhythm"}
          </span>
          <Link
            className="mgtv-audio-title"
            to={"/music/track/" + item.id}
            title={item.title}
          >
            {item.title}
          </Link>
          <span className="mgtv-audio-artist" title={item.artist}>
            {item.artist}
          </span>
        </div>
      </div>
      <div className="mgtv-audio-centre">
        <div
          className={
            "mgtv-audio-orbit" + (waiting ? " mgtv-audio-orbit--waiting" : "")
          }
        >
          <button
            type="button"
            className="mgtv-audio-play"
            aria-label={isPlaying ? "Pause track" : "Play track"}
            disabled={!audio || handoff || failed || busy}
            onClick={() =>
              void act(async () => {
                if (!audio) return;
                if (audio.paused) await audio.play();
                else audio.pause();
              })
            }
          >
            <Icon name={isPlaying ? "pause" : "play"} />
          </button>
          <div
            className="mgtv-audio-seek"
            role="slider"
            aria-label="Track position"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.min(Math.round(duration), Math.round(position))}
            aria-valuetext={
              audioClock(position) + " of " + audioClock(duration)
            }
            aria-disabled={!seekable}
            tabIndex={seekable ? 0 : -1}
            onKeyDown={(e) => {
              const target = seekKey(e.key, position, duration);
              if (target !== null && seekable) {
                e.preventDefault();
                seek(target);
              }
            }}
            onPointerDown={(e) => {
              if (!seekable || e.button !== 0) return;
              e.preventDefault();
              e.currentTarget.focus();
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = pointer(e);
              setPosition(drag.current);
            }}
            onPointerMove={(e) => {
              if (drag.current !== null) {
                drag.current = pointer(e);
                setPosition(drag.current);
              }
            }}
            onPointerUp={(e) => {
              if (drag.current === null) return;
              const value = pointer(e);
              drag.current = null;
              seek(value);
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onPointerCancel={() => {
              drag.current = null;
              if (audio) setPosition(audio.currentTime);
            }}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
          >
            <svg viewBox="0 0 112 112" fill="none" aria-hidden="true">
              <circle
                cx="56"
                cy="56"
                r="50"
                className="mgtv-audio-orbit-track"
              />
              <circle
                cx="56"
                cy="56"
                r="50"
                className="mgtv-audio-orbit-progress"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset={100 - percent}
                transform="rotate(-90 56 56)"
              />
              <circle
                cx={56 + 50 * Math.cos(angle)}
                cy={56 + 50 * Math.sin(angle)}
                r="3.5"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <span className="mgtv-audio-time" aria-hidden="true">
          {audioClock(position)}
          <span> / {audioClock(duration)}</span>
        </span>
      </div>
      <div className="mgtv-audio-tools">
        <div className="mgtv-audio-transport">
          <button
            type="button"
            className="mgtv-audio-control"
            aria-label="Restart track"
            title="Restart track"
            disabled={!seekable}
            onClick={() => {
              seek(0);
            }}
          >
            <Icon name="previous" />
          </button>
          <button
            type="button"
            className="mgtv-audio-control"
            aria-label="Next track"
            title="Next track"
            disabled={!onNext || handoff || busy}
            onClick={() => onNext && void act(onNext)}
          >
            <Icon name="next" />
          </button>
          <Link
            className="mgtv-audio-control"
            aria-label="Open listening queue"
            title="Listening queue"
            to="/music/player"
          >
            <Icon name="queue" />
          </Link>
          <button
            type="button"
            className="mgtv-audio-control mgtv-audio-close"
            aria-label="Close player"
            title="Close player"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="mgtv-audio-volume">
          <button
            type="button"
            className="mgtv-audio-control"
            aria-label={muted || volume === 0 ? "Unmute" : "Mute"}
            title={muted || volume === 0 ? "Unmute" : "Mute"}
            disabled={!audio}
            onClick={() => {
              if (audio) {
                if (audio.volume === 0) {
                  audio.volume = 0.5;
                  audio.muted = false;
                } else audio.muted = !audio.muted;
              }
            }}
          >
            <Icon name={muted || volume === 0 ? "muted" : "volume"} />
          </button>
          <input
            type="range"
            aria-label="Volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            disabled={!audio}
            aria-valuetext={Math.round(volume * 100) + " percent"}
            onChange={(e) => {
              if (audio) {
                audio.volume = Number(e.target.value);
                audio.muted = false;
              }
            }}
          />
        </div>
      </div>
      {children}
      <div className="mgtv-audio-feedback">
        {handoff && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void act(onContinue)}
          >
            Continue here
          </button>
        )}
        <p role={failed || error ? "alert" : "status"}>
          {error ||
            (failed
              ? "Audio could not load. Close the player and reopen the track to check access."
              : handoff
                ? notice
                : waiting
                  ? "Finding your rhythm…"
                  : preview
                    ? "A first listen. The full track is waiting."
                    : notice)}
        </p>
      </div>
    </div>
  );
}
