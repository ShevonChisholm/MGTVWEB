const AdaptiveAudio = lazy(() => import("@/components/player/AdaptiveVideo").then(m => ({default:m.AdaptiveAudio})));
import {
  lazy,
  Suspense,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { useMusic, type ApiMusic } from "./MusicContext";
import { customerApi } from "@/lib/customerAuth";
import { Button } from "@/components/ui/Button";
const AudioContext = createContext<{
  start: (item: ApiMusic, preview?: boolean) => Promise<void>;
  stop: () => void;
  startQueue: (items:ApiMusic[],index?:number)=>Promise<void>;
} | null>(null);
export function MusicAudioProvider({ children }: { children: ReactNode }) {
  const library = useMusic(),
    element = useRef<HTMLAudioElement>(null),
    cursor = useRef<any>(null),
    requestSerial=useRef(0),
    queue = useRef<{items:ApiMusic[];index:number}|null>(null),
    bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<{
      item: ApiMusic;
      url: string;
      preview: boolean;
      audience: string;
    } | null>(null),
    [notice, setNotice] = useState("");
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
  function stop() {
    requestSerial.current++;
    queue.current=null;
    element.current?.pause();
    cursor.current = null;
    setPlaying(null);
  }
  useEffect(() => {
    stop();
  }, [library.audience]);
  async function start(item: ApiMusic, preview = false, keepQueue = false) {
    const snapshot=keepQueue?queue.current:null;
    stop();
    queue.current=snapshot;
    const serial=requestSerial.current;
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
    if(serial!==requestSerial.current)return;
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
  async function startQueue(items:ApiMusic[],index=0) {
    if(!items.length||items.some(m=>m.kind!=='track')||!items[index])throw Error('Choose an available track to start.');
    queue.current={items:[...items],index};
    await start(items[index],false,true);
  }
  async function advance() {
    const snapshot=queue.current;
    if(!snapshot||!snapshot.items[snapshot.index+1])return;
    snapshot.index++;
    try {await start(snapshot.items[snapshot.index],false,true)}
    catch(e){setNotice((e as Error).message);}
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
    <AudioContext.Provider value={{ start, stop, startQueue }}>
      {children}
      {!playing&&notice&&<div role="alert" className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-bg-surface p-4 text-sm"><div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-4"><span>{notice}</span>{queue.current&&<Button size="sm" onClick={()=>{const q=queue.current;if(q)void start(q.items[q.index],false,true).catch(e=>setNotice(e.message));}}>Retry track</Button>}<Button size="sm" variant="ghost" onClick={()=>{stop();setNotice('')}}>Dismiss</Button></div></div>}
      {playing && playing.audience === library.audience && (
        <div
          ref={bar}
          role="region"
          aria-label="Audio mini-player"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-bg-surface px-4 py-3 shadow-xl"
        >
          <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
            <img
              src={playing.item.artwork.portraitUrl}
              alt=""
              className="h-12 w-12 rounded-md object-cover"
            />
            <Link
              className="min-w-0 flex-1 text-sm text-gold"
              to={"/music/track/" + playing.item.id}
            >
              {playing.item.title}
              {playing.preview ? " · Preview" : ""}
              <span className="block text-xs text-text-secondary">
                {playing.item.artist}
              </span>
            </Link>
            <Suspense fallback={null}><AdaptiveAudio
              key={playing.url + playing.audience}
              ref={element}
              src={playing.url}
              controls
              autoPlay
              preload="metadata"
              aria-label={playing.item.title}
              className="max-w-full"
              onLoadedMetadata={() => {
                if (element.current && cursor.current)
                  element.current.currentTime = cursor.current.last;
              }}
              onTimeUpdate={() => persist()}
              onPause={() => persist(true)}
              onSeeked={() => persist(true)}
              onEnded={() => {persist(true);void advance();}}
              onError={() =>
                setNotice(
                  "Audio is unavailable. Close the player and reopen the track to check access.",
                )
              }
            /></Suspense>
            <Button size="sm" variant="ghost" onClick={() => {persist(true);stop();}}>
              Close player
            </Button>
            <p role="status" className="w-full text-xs text-text-secondary">
              {notice}
            </p>
          </div>
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
