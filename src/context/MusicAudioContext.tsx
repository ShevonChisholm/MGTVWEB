import {
  lazy,
  Suspense,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router";
import { useMusic, type ApiMusic } from "./MusicContext";
import { customerApi } from "@/lib/customerAuth";
import { Button } from "@/components/ui/Button";
import { MusicPlayerBar } from "@/components/player/MusicPlayerBar";

const AdaptiveAudio = lazy(() =>
  import("@/components/player/AdaptiveVideo").then((m) => ({
    default: m.AdaptiveAudio,
  })),
);
export type ListeningSource = {
  kind: "manual" | "album" | "playlist" | "personal-playlist";
  id?: string;
};
export type SavedListening = {
  version: number;
  queueIds: string[];
  index: number;
  current: ApiMusic | null;
  source: { kind: string; id: string; title: string } | null;
  otherSession: boolean;
  unavailable: boolean;
};
const AudioContext = createContext<{
  start: (item: ApiMusic, preview?: boolean) => Promise<void>;
  stop: () => void;
  startQueue: (
    items: ApiMusic[],
    index?: number,
    source?: ListeningSource,
  ) => Promise<void>;
  saved: SavedListening | null;
  restoring: boolean;
  notice: string;
  refreshListening: () => Promise<void>;
  resumeListening: (takeover?: boolean) => Promise<void>;
  skipListening: () => Promise<void>;
  handoff: boolean;
  isPlaying: boolean;
  activeTrackId: string | null;
  restorationError: string;
} | null>(null);
export function MusicAudioProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const profileFlow =
    location.pathname.startsWith("/profiles") ||
    location.pathname === "/parental-controls";
  useEffect(() => {
    if (profileFlow) element.current?.pause();
  }, [profileFlow]);
  const library = useMusic(),
    element = useRef<HTMLAudioElement>(null),
    audioSettings = useRef({ volume: 1, muted: false }),
    cursor = useRef<any>(null),
    requestSerial = useRef(0),
    queue = useRef<{
      ids: string[];
      index: number;
      source: ListeningSource;
    } | null>(null),
    lease = useRef<{ version: number; profileId: string } | null>(null),
    pendingHandoff = useRef<{
      item: ApiMusic;
      queue: { ids: string[]; index: number; source: ListeningSource };
    } | null>(null),
    bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<{
      item: ApiMusic;
      url: string;
      preview: boolean;
      audience: string;
    } | null>(null),
    [notice, setNotice] = useState("");
  const [audioNode, setAudioNode] = useState<HTMLAudioElement | null>(null);
  const attachAudio = useCallback((node: HTMLAudioElement | null) => {
    if (element.current && element.current !== node) {
      audioSettings.current = {
        volume: element.current.volume,
        muted: element.current.muted,
      };
    }
    if (node) {
      node.volume = audioSettings.current.volume;
      node.muted = audioSettings.current.muted;
    }
    element.current = node;
    setAudioNode(node);
  }, []);
  const [restorationError, setRestorationError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedAudience, setSavedAudience] = useState("");
  const [saved, setSaved] = useState<SavedListening | null>(null),
    [restoring, setRestoring] = useState(false),
    [handoff, setHandoff] = useState(false);
  const scopeRef = useRef(library.audience);
  scopeRef.current = library.audience;
  const restoredScope = useRef("");
  function listeningHeaders(version?: number) {
    return {
      "X-Profile-Context": library.session?.activeProfileId ?? "",
      ...(version === undefined ? {} : { "If-Match": `"v${version}"` }),
    };
  }
  async function refreshListening() {
    if (!library.session || library.profileRequired) return;
    const scope = library.audience;
    setRestoring(true);
    setRestorationError("");
    try {
      const result = await customerApi(
        "/listening",
        "GET",
        undefined,
        listeningHeaders(),
      );
      if (scopeRef.current === scope) {
        setSaved(result);
        setSavedAudience(scope);
        restoredScope.current = scope;
      }
    } catch (e) {
      if (scopeRef.current === scope) setRestorationError((e as Error).message);
    } finally {
      if (scopeRef.current === scope) setRestoring(false);
    }
  }
  useEffect(() => {
    if (
      location.pathname.startsWith("/music") &&
      !library.busy &&
      library.session &&
      !library.profileRequired &&
      restoredScope.current !== library.audience
    )
      void refreshListening();
  }, [location.pathname, library.audience, library.busy]);
  useEffect(() => {
    const tick = setInterval(() => {
      const active = lease.current;
      if (!active || !element.current || element.current.paused) return;
      void customerApi(
        "/listening/heartbeat",
        "POST",
        {},
        {
          "X-Profile-Context": active.profileId,
          "If-Match": `"v${active.version}"`,
        },
      ).catch((e) => {
        if (lease.current === active) {
          element.current?.pause();
          lease.current = null;
          setNotice((e as Error).message);
          setHandoff(true);
          void refreshListening();
        }
      });
    }, 15000);
    return () => clearInterval(tick);
  }, [library.audience]);
  async function claim(
    item: ApiMusic,
    snapshot: { ids: string[]; index: number; source: ListeningSource },
    takeover = false,
  ) {
    const scope = library.audience;
    const latest = await customerApi(
      "/listening",
      "GET",
      undefined,
      listeningHeaders(),
    );
    if (scopeRef.current !== scope) return false;
    if (latest.otherSession && !takeover) {
      setSaved(latest);
      setSavedAudience(scope);
      pendingHandoff.current = { item, queue: snapshot };
      setHandoff(true);
      setNotice(
        "Your soundtrack is playing in another session. Continue here when you’re ready.",
      );
      return false;
    }
    const result = await customerApi(
      "/listening",
      "PUT",
      {
        queueIds: snapshot.ids,
        index: snapshot.index,
        sourceKind: snapshot.source.kind,
        ...(snapshot.source.id ? { sourceId: snapshot.source.id } : {}),
        takeover,
      },
      listeningHeaders(latest.version),
    );
    if (scopeRef.current !== scope) return false;
    lease.current = {
      version: result.version,
      profileId: library.session!.activeProfileId!,
    };
    setSaved(result);
    setSavedAudience(scope);
    setHandoff(false);
    pendingHandoff.current = null;
    return true;
  }
  async function resumeListening(takeover = false) {
    const scope = library.audience;
    const pending = pendingHandoff.current;
    if (pending) {
      if (await claim(pending.item, pending.queue, takeover)) {
        queue.current = pending.queue;
        await start(pending.item, false, true, true);
      }
      return;
    }
    const latest = await customerApi(
      "/listening",
      "GET",
      undefined,
      listeningHeaders(),
    );
    if (scopeRef.current !== scope) return;
    setSaved(latest);
    setSavedAudience(scope);
    if (!latest.current) {
      setNotice(
        "This track is no longer available. Try the next track in your queue.",
      );
      return;
    }
    const snapshot = {
      ids: latest.queueIds,
      index: latest.index,
      source: latest.source
        ? { kind: latest.source.kind, id: latest.source.id }
        : { kind: "manual" },
    } as { ids: string[]; index: number; source: ListeningSource };
    if (await claim(latest.current, snapshot, takeover)) {
      queue.current = snapshot;
      await start(latest.current, false, true, true);
    }
  }
  async function skipListening() {
    const scope = library.audience;
    const { candidate } = await customerApi(
      "/listening/next",
      "GET",
      undefined,
      listeningHeaders(),
    );
    if (scopeRef.current !== scope) return;
    if (!candidate?.current) {
      setNotice(
        "There are no more available tracks in this queue. Find your next sound in Music.",
      );
      return;
    }
    const snapshot = {
      ids: candidate.queueIds,
      index: candidate.index,
      source: candidate.source
        ? { kind: candidate.source.kind, id: candidate.source.id }
        : { kind: "manual" },
    } as { ids: string[]; index: number; source: ListeningSource };
    if (await claim(candidate.current, snapshot)) {
      queue.current = snapshot;
      await start(candidate.current, false, true, true);
    }
  }
  useEffect(() => {
    const node = bar.current;
    if (!node) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--music-player-height",
        `${node.getBoundingClientRect().height}px`,
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--music-player-height");
    };
  }, [!!playing]);
  function stop(release = true) {
    const active = lease.current;
    if (release && active) {
      lease.current = null;
      void customerApi(
        "/listening/release",
        "POST",
        {},
        {
          "X-Profile-Context": active.profileId,
          "If-Match": `"v${active.version}"`,
        },
      ).catch(() => {});
    }
    requestSerial.current++;
    queue.current = null;
    element.current?.pause();
    cursor.current = null;
    setPlaying(null);
    setIsPlaying(false);
  }
  useEffect(() => {
    stop();
    setSaved(null);
    setRestorationError("");
    setNotice("");
    setHandoff(false);
    pendingHandoff.current = null;
    restoredScope.current = "";
  }, [library.audience]);
  async function start(
    item: ApiMusic,
    preview = false,
    keepQueue = false,
    claimed = false,
  ) {
    if (!preview && !claimed) {
      const snapshot =
        keepQueue && queue.current
          ? queue.current
          : {
              ids: [item.id],
              index: 0,
              source: { kind: "manual" } as ListeningSource,
            };
      if (!library.session)
        throw Error("Sign in with a customer account to listen.");
      if (library.profileRequired)
        throw Error("Choose your profile before listening.");
      if (!(await claim(item, snapshot))) return;
      queue.current = snapshot;
      keepQueue = true;
    }
    const snapshot = keepQueue ? queue.current : null;
    stop(preview);
    queue.current = snapshot;
    const serial = requestSerial.current;
    setNotice("");
    const audience = library.audience;
    if (preview) {
      if (!item.previewAvailable) throw Error("No preview is available.");
      setPlaying({
        item,
        url: "/api/v1/catalog/music/" + item.id + "/preview",
        preview: true,
        audience,
      });
      return;
    }
    if (!library.session)
      throw Error("Sign in with a customer account to listen.");
    if (library.profileRequired)
      throw Error("Choose your profile before listening.");
    const result = await customerApi("/music/" + item.id + "/playback");
    if (serial !== requestSerial.current) return;
    cursor.current = {
      id: item.id,
      mediaVersionId: result.mediaVersionId,
      version: result.progress.version,
      profileId: library.session.activeProfileId,
      last: result.progress.completed ? 0 : result.progress.seconds,
      pending: null,
      saving: false,
    };
    setPlaying({ item, url: result.url, preview: false, audience });
  }
  async function startQueue(
    items: ApiMusic[],
    index = 0,
    source: ListeningSource = { kind: "manual" },
  ) {
    if (!items.length || items.some((m) => m.kind !== "track") || !items[index])
      throw Error("Choose an available track to start.");
    queue.current = { ids: items.map((m) => m.id), index, source };
    await start(items[index], false, true);
  }
  async function advance() {
    if (!queue.current) return;
    try {
      await skipListening();
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  function persist(force = false) {
    const state = cursor.current,
      node = element.current;
    if (
      !state ||
      !node ||
      !playing ||
      playing.preview ||
      !Number.isFinite(node.currentTime)
    )
      return;
    if (!force && Math.abs(node.currentTime - state.last) < 10) return;
    state.pending = node.currentTime;
    if (state.saving) return;
    state.saving = true;
    void (async () => {
      try {
        while (state.pending !== null && cursor.current === state) {
          const seconds = state.pending;
          state.pending = null;
          const saved = await customerApi(
            "/music/" + state.id + "/progress",
            "PUT",
            { seconds, mediaVersionId: state.mediaVersionId },
            {
              "If-Match": `"v${state.version}"`,
              "X-Profile-Context": state.profileId,
            },
          );
          state.version = saved.version;
          state.last = seconds;
          if (cursor.current === state) {
            library.recordProgress(playing.item, saved, state.profileId);
            setSaved((old) =>
              old?.current?.id === playing.item.id
                ? { ...old, current: { ...old.current, progress: saved } }
                : old,
            );
            setNotice("Listening position saved.");
          }
        }
      } catch (e) {
        if (cursor.current === state)
          setNotice(
            e instanceof Error ? e.message : "Could not save position.",
          );
      } finally {
        state.saving = false;
      }
    })();
  }
  return (
    <AudioContext.Provider
      value={{
        start,
        stop: () => stop(),
        startQueue,
        saved: savedAudience === library.audience ? saved : null,
        restoring,
        notice,
        refreshListening,
        resumeListening,
        skipListening,
        handoff,
        isPlaying,
        activeTrackId: playing && !playing.preview ? playing.item.id : null,
        restorationError,
      }}
    >
      {children}
      {notice &&
        !playing &&
        !profileFlow &&
        location.pathname !== "/music/player" && (
          <div
            role="status"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-bg-surface p-4 text-sm"
          >
            <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-4">
              <span>{notice}</span>
              {handoff && (
                <Button
                  size="sm"
                  onClick={() =>
                    void resumeListening(true).catch((e) =>
                      setNotice(e.message),
                    )
                  }
                >
                  Continue here
                </Button>
              )}
              <Link className="text-gold" to="/music/player">
                Open music player
              </Link>
              <Button size="sm" variant="ghost" onClick={() => setNotice("")}>
                Dismiss
              </Button>
            </div>
          </div>
        )}
      {playing && playing.audience === library.audience && (
        <div
          ref={bar}
          style={{ display: profileFlow ? "none" : undefined }}
          role="region"
          aria-label="Audio mini-player"
          className="mgtv-audio-dock"
        >
          <MusicPlayerBar
            item={playing.item}
            audio={audioNode}
            isPlaying={isPlaying}
            preview={playing.preview}
            handoff={handoff}
            notice={notice}
            onNext={
              !playing.preview &&
              saved?.current?.id === playing.item.id &&
              saved.index + 1 < saved.queueIds.length
                ? advance
                : undefined
            }
            onContinue={() => resumeListening(true)}
            onClose={() => {
              persist(true);
              stop();
            }}
          >
            <Suspense fallback={null}>
              <AdaptiveAudio
                key={playing.url + playing.audience}
                ref={attachAudio}
                src={playing.url}
                controls={false}
                aria-hidden="true"
                tabIndex={-1}
                autoPlay
                preload="metadata"
                aria-label={playing.item.title}
                className="hidden"
                onLoadedMetadata={() => {
                  if (element.current && cursor.current)
                    element.current.currentTime = cursor.current.last;
                }}
                onTimeUpdate={() => persist()}
                onPlay={() => {
                  setIsPlaying(true);
                  const active = lease.current;
                  if (active)
                    void customerApi(
                      "/listening/heartbeat",
                      "POST",
                      {},
                      {
                        "X-Profile-Context": active.profileId,
                        "If-Match": `"v${active.version}"`,
                      },
                    ).catch((e) => {
                      if (lease.current === active) {
                        element.current?.pause();
                        lease.current = null;
                        setHandoff(true);
                        setNotice(e.message);
                        void refreshListening();
                      }
                    });
                }}
                onPause={() => {
                  setIsPlaying(false);
                  persist(true);
                }}
                onSeeked={() => persist(true)}
                onEnded={() => {
                  persist(true);
                  void advance();
                }}
                onError={() =>
                  setNotice(
                    "Audio is unavailable. Close the player and reopen the track to check access.",
                  )
                }
              />
            </Suspense>
          </MusicPlayerBar>
        </div>
      )}
    </AudioContext.Provider>
  );
}
export function useMusicAudio() {
  const value = useContext(AudioContext);
  if (!value) throw Error("MusicAudioProvider is required");
  return value;
}
