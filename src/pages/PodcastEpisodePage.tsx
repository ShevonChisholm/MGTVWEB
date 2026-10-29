import { CommentsSection } from "@/components/comments/CommentsSection";
import { ReportContent } from "@/components/moderation/ReportContent";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { podcastRequest, podcastTime, type Podcast } from "@/lib/podcasts";
import {
  useCustomerSession,
  customerApi,
  CustomerAuthError,
} from "@/lib/customerAuth";
import {
  AdaptiveAudio,
  AdaptiveVideo,
} from "@/components/player/AdaptiveVideo";
import { useMusicAudio } from "@/context/MusicAudioContext";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ShareBar } from "@/components/shared/ShareBar";
import { PodcastGlyph } from "@/components/podcasts/PodcastCard";
import "@/components/podcasts/podcasts.css";
export default function PodcastEpisodePage() {
  const { id } = useParams(),
    navigate = useNavigate(),
    auth = useCustomerSession(),
    profile = auth.session?.activeProfileId,
    music = useMusicAudio();
  const [item, setItem] = useState<Podcast | null>(null),
    [siblings, setSiblings] = useState<Podcast[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [issue, setIssue] = useState(""),
    [busy, setBusy] = useState(false),
    [source, setSource] = useState(""),
    [mode, setMode] = useState<"preview" | "full">("full"),
    [ended, setEnded] = useState(false),
    [playing, setPlaying] = useState(false),
    [position, setPosition] = useState(0),
    [duration, setDuration] = useState(0),
    [speed, setSpeed] = useState(1),
    [volume, setVolume] = useState(1),
    [muted, setMuted] = useState(false),
    [notice, setNotice] = useState(""),
    [element, setElement] = useState<HTMLMediaElement | null>(null),
    [retry, setRetry] = useState(0);
  const media = useRef<HTMLMediaElement | null>(null),
    lease = useRef<any>(null),
    serial = useRef(0),
    disposed = useRef(false),
    restore = useRef<number | null>(null);
  const attach = useCallback((node: HTMLMediaElement | null) => {
    media.current = node;
    setElement(node);
  }, []);
  function persist(seconds: number, force = false) {
    const state = lease.current;
    if (
      !state ||
      !Number.isFinite(seconds) ||
      (!force && Math.abs(seconds - state.saved) < 10)
    )
      return;
    state.pending = seconds;
    if (state.saving) return;
    state.saving = true;
    void (async () => {
      try {
        while (state.pending !== null) {
          const value = state.pending;
          state.pending = null;
          const result = await customerApi(
            "/podcast-episodes/" + state.id + "/progress",
            "PUT",
            { mediaVersionId: state.mediaVersionId, seconds: value },
            {
              "X-Profile-Context": state.profile,
              "If-Match": `"v${state.version}"`,
            },
          );
          state.version = result.version;
          state.saved = value;
          if (lease.current === state && !disposed.current)
            setNotice("Your place is saved.");
        }
      } catch (e) {
        if (lease.current === state && !disposed.current)
          setNotice((e as Error).message);
      } finally {
        state.saving = false;
      }
    })();
  }
  useEffect(() => {
    if (auth.loading) return;
    let active = true;
    const abort = new AbortController();
    const request = ++serial.current;
    disposed.current = false;
    media.current?.pause();
    lease.current = null;
    setSource("");
    setItem(null);
    setSiblings([]);
    setIssue("");
    setError("");
    setLoading(true);
    setEnded(false);
    setPosition(0);
    setDuration(0);
    void (async () => {
      const r: Podcast = await podcastRequest("/" + id, profile, abort.signal);
      if (!active) return;
      if (r.kind !== "episode") throw Error("Choose a podcast episode.");
      setItem(r);
      const page = await podcastRequest(
        "/" + r.seriesId + "/episodes?limit=50",
        profile,
        abort.signal,
      );
      if (active) setSiblings(page.items.filter((e: Podcast) => e.id !== id));
    })()
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      abort.abort();
      if (serial.current === request) serial.current++;
      if (media.current) persist(media.current.currentTime, true);
      media.current?.pause();
      lease.current = null;
      disposed.current = true;
    };
  }, [id, profile, auth.loading, retry]);
  async function start(preview = false) {
    if (!item || busy) return;
    if (!preview && !auth.session) {
      navigate(
        "/auth/sign-in?returnTo=" + encodeURIComponent(location.pathname),
      );
      return;
    }
    if (!preview && !profile) {
      navigate("/profiles?returnTo=" + encodeURIComponent(location.pathname));
      return;
    }
    const attempt = ++serial.current;
    media.current?.pause();
    if (media.current) persist(media.current.currentTime, true);
    lease.current = null;
    setBusy(true);
    setIssue("");
    setNotice("");
    setSource("");
    setPosition(0);
    setEnded(false);
    restore.current = 0;
    try {
      if (preview) {
        setMode("preview");
        setSource("/api/v1/catalog/podcasts/" + item.id + "/preview");
      } else {
        const p = await customerApi(
          "/podcast-episodes/" + item.id + "/playback",
          "GET",
          undefined,
          { "X-Profile-Context": profile! },
        );
        if (attempt !== serial.current) return;
        setMode("full");
        lease.current = {
          id: item.id,
          profile,
          mediaVersionId: p.mediaVersionId,
          version: p.progress.version,
          saved: p.progress.seconds,
          pending: null,
          saving: false,
        };
        restore.current = p.progress.completed ? 0 : p.progress.seconds;
        setSource(p.url);
      }
    } catch (e) {
      if (attempt === serial.current)
        setIssue(
          e instanceof CustomerAuthError
            ? e.message
            : "The episode could not be prepared. Please try again.",
        );
    } finally {
      if (attempt === serial.current) setBusy(false);
    }
  }
  async function toggle() {
    if (!element) return;
    try {
      if (element.paused) await element.play();
      else element.pause();
    } catch {
      setNotice("Tap play again when the episode is ready.");
    }
  }
  const onMetadata = () => {
    if (!media.current) return;
    setDuration(media.current.duration);
    if (restore.current !== null) {
      media.current.currentTime = Math.min(
        restore.current,
        Math.max(0, media.current.duration - 0.1),
      );
      restore.current = null;
    }
    setPosition(media.current.currentTime);
  };
  const events = {
    onLoadedMetadata: onMetadata,
    onTimeUpdate: () => {
      if (media.current) {
        setPosition(media.current.currentTime);
        persist(media.current.currentTime);
      }
    },
    onPause: () => {
      setPlaying(false);
      if (media.current) persist(media.current.currentTime, true);
    },
    onPlay: () => {
      music.stop();
      setPlaying(true);
      setEnded(false);
    },
    onEnded: () => {
      setPlaying(false);
      setEnded(true);
      if (media.current) persist(media.current.duration, true);
    },
    onError: () =>
      setIssue(
        "This episode could not play. Reopen it to check access and try again.",
      ),
  };
  const fullLabel = !auth.session
    ? "Sign in for the full episode"
    : !profile
      ? "Choose a profile"
      : item?.progress?.seconds && !item.progress.completed
        ? "Resume episode"
        : "Play full episode";
  if (loading || auth.loading)
    return (
      <div className="podcasts-page">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  if (!item || error)
    return (
      <div className="podcasts-page pc-empty" role="alert">
        <PodcastGlyph size={48} />
        <h1>This conversation is out of reach.</h1>
        <p>{error || "The episode is not available."}</p>
        <Button onClick={() => setRetry((x) => x + 1)}>Try again</Button>
        <ButtonLink to="/podcasts" variant="outline">
          All podcasts
        </ButtonLink>
      </div>
    );
  const previewEnded = mode === "preview" && ended;
  return (
    <article className="podcasts-page">
      <Link className="pc-back" to={"/podcasts/" + item.seriesId}>
        ← {item.seriesTitle}
      </Link>
      <div className="pc-watch">
        <div>
          <div className={item.format === "video" ? "pc-video" : "pc-audio"}>
            {item.format === "audio" && item.coverUrl && (
              <img className="pc-audio-art" src={item.coverUrl} alt="" />
            )}
            {source && item.format === "video" ? (
              <AdaptiveVideo
                key={source}
                ref={attach}
                src={source}
                controls
                autoPlay
                playsInline
                poster={item.coverUrl ?? undefined}
                aria-label={item.title}
                {...events}
              />
            ) : source ? (
              <>
                <AdaptiveAudio
                  key={source}
                  ref={attach}
                  src={source}
                  autoPlay
                  preload="metadata"
                  aria-label={item.title}
                  {...events}
                />
                <div className="pc-audio-content">
                  <p className="pc-kicker justify-center">
                    MGTV PODCASTS ·{" "}
                    {mode === "preview" ? "FIRST LISTEN" : "IN CONVERSATION"}
                  </p>
                  <div className="pc-orbit">
                    <svg viewBox="0 0 128 128" fill="none" aria-hidden>
                      <circle
                        cx="64"
                        cy="64"
                        r="59"
                        stroke="#ffffff20"
                        strokeWidth="4"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="59"
                        stroke="#c9a84c"
                        strokeWidth="4"
                        pathLength="100"
                        strokeDasharray="100"
                        strokeDashoffset={
                          100 -
                          Math.min(
                            100,
                            duration ? (position / duration) * 100 : 0,
                          )
                        }
                      />
                    </svg>
                    <button
                      type="button"
                      aria-label={playing ? "Pause podcast" : "Play podcast"}
                      onClick={toggle}
                    >
                      {playing ? (
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                        </svg>
                      ) : (
                        <PodcastGlyph name="play" size={34} />
                      )}
                    </button>
                  </div>
                  <p className="pc-audio-time">
                    {podcastTime(position)} / {podcastTime(duration)}
                  </p>
                  <label className="sr-only" htmlFor="podcast-seek">
                    Episode position
                  </label>
                  <input
                    id="podcast-seek"
                    className="pc-seek"
                    type="range"
                    min="0"
                    max={
                      Number.isFinite(duration) && duration > 0 ? duration : 1
                    }
                    step=".1"
                    value={position}
                    disabled={!duration}
                    onChange={(e) => {
                      if (element) {
                        element.currentTime = Number(e.target.value);
                        setPosition(element.currentTime);
                      }
                    }}
                  />
                  <div className="pc-audio-controls">
                    <button
                      aria-label="Back 15 seconds"
                      onClick={() => {
                        if (element)
                          element.currentTime = Math.max(
                            0,
                            element.currentTime - 15,
                          );
                      }}
                    >
                      ↶ 15
                    </button>
                    <button
                      aria-label="Forward 15 seconds"
                      onClick={() => {
                        if (element)
                          element.currentTime = Math.min(
                            element.duration,
                            element.currentTime + 15,
                          );
                      }}
                    >
                      15 ↷
                    </button>
                    <label className="sr-only" htmlFor="podcast-speed">
                      Playback speed
                    </label>
                    <select
                      id="podcast-speed"
                      value={speed}
                      onChange={(e) => {
                        setSpeed(Number(e.target.value));
                        if (element)
                          element.playbackRate = Number(e.target.value);
                      }}
                    >
                      {[0.75, 1, 1.25, 1.5, 2].map((v) => (
                        <option key={v} value={v}>
                          {v}×
                        </option>
                      ))}
                    </select>
                    <button
                      aria-label={muted ? "Unmute podcast" : "Mute podcast"}
                      onClick={() => {
                        if (element) {
                          element.muted = !muted;
                          setMuted(!muted);
                        }
                      }}
                    >
                      {muted ? "Sound off" : "Sound on"}
                    </button>
                    <label className="sr-only" htmlFor="podcast-volume">
                      Volume
                    </label>
                    <input
                      id="podcast-volume"
                      className="pc-volume"
                      type="range"
                      min="0"
                      max="1"
                      step=".05"
                      value={volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        if (element) element.volume = Number(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </>
            ) : item.coverUrl ? (
              <img
                className="h-full w-full absolute inset-0 object-cover opacity-35"
                src={item.coverUrl}
                alt=""
              />
            ) : null}
            {(!source || (previewEnded && item.format === "audio") || issue) && (
              <div className="pc-player-message">
                <PodcastGlyph size={40} />
                <h2>
                  {busy
                    ? "Tuning you in…"
                    : previewEnded
                      ? "That was just the first word."
                      : item.title}
                </h2>
                <p>
                  {issue ||
                    (!source
                      ? item.format === "audio"
                        ? "Settle in. The conversation is yours to start."
                        : "Press play and join the conversation."
                      : "Keep the conversation going with the full episode.")}
                </p>
                <div className="pc-inline-actions justify-center">
                  <Button disabled={busy} onClick={() => start(false)}>
                    {busy ? "Preparing…" : fullLabel}
                  </Button>
                  {item.previewAvailable && (
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => start(true)}
                    >
                      {previewEnded ? "Replay preview" : "Try a free preview"}
                    </Button>
                  )}
                  {issue && auth.session && profile && (
                    <ButtonLink to="/mgtv-plus" variant="outline">
                      Explore MGTV+
                    </ButtonLink>
                  )}
                </div>
              </div>
            )}
          </div>
          {notice && (
            <p className="pc-player-note" role="status">
              {notice}
            </p>
          )}
          <p className="pc-kicker mt-6">
            {item.seasonNumber ? "Season " + item.seasonNumber + " · " : ""}
            Episode {item.episodeNumber} · {item.format} · {item.classification}
            {item.accessTier === "premium" ? " · MGTV+" : ""}
          </p>
          <h1 className="pc-episode-title">{item.title}</h1>
          <p className="text-text-secondary">
            {item.host} · {podcastTime(item.durationSeconds)}
          </p>
          <p className="pc-episode-description">{item.description}</p>
          <div className="pc-inline-actions">
            <ShareBar title={item.title} />
            <ReportContent kind="podcast" contentId={item.id} />
          </div>
          <CommentsSection kind="podcast" contentId={item.id} />
        </div>
        <aside aria-label="More podcast episodes">
          <h2 className="font-display text-2xl mb-5">
            Keep the conversation going
          </h2>
          <div className="pc-recommendations">
            {siblings.map((e) => (
              <Link to={"/podcasts/episodes/" + e.id} key={e.id}>
                {e.coverUrl ? (
                  <img src={e.coverUrl} alt="" loading="lazy" />
                ) : (
                  <PodcastGlyph size={42} />
                )}
                <div>
                  <small>
                    {e.seasonNumber ? "S" + e.seasonNumber + " · " : ""}EP{" "}
                    {e.episodeNumber} · {e.format}
                  </small>
                  <strong>{e.title}</strong>
                  <small>{podcastTime(e.durationSeconds)}</small>
                </div>
              </Link>
            ))}
            {!siblings.length && (
              <p className="text-sm text-text-secondary">
                You’re caught up with this series. There’s more to discover.
              </p>
            )}
          </div>
          <ButtonLink to="/podcasts" variant="ghost" className="mt-5">
            Explore podcasts ↗
          </ButtonLink>
        </aside>
      </div>
    </article>
  );
}
