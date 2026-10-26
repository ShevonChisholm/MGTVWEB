import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import {
  useCustomerSession,
  customerApi,
  connectedAuth,
} from "@/lib/customerAuth";
import type { CatalogItem } from "@/data/mockContent";
export type MusicPreference = {
  saved: boolean;
  liked: boolean;
  rating: number | null;
  version: number;
};
export type ApiMusic = {
  kind: "track" | "music-video";
  artist: string;
  album: string;
  id: string;
  title: string;
  synopsis: string;
  genreNames: string[];
  classification: string;
  releaseYear: number;
  durationSeconds: number;
  artwork: { portraitUrl: string; landscapeUrl: string };
  director?: string;
  cast?: string[];
  preference?: MusicPreference;
  accessTier: "free" | "premium";
  eligibleTierIds: string[];
  featureUrl?:string|null;
  previewAvailable: boolean;
  progress?: {
    seconds: number;
    completed: boolean;
    version: number;
    mediaVersionId: string | null;
  };
};
export const musicItem = (music: ApiMusic): CatalogItem => ({
  id: music.id,
  type: music.kind === "track" ? "track" : "musicVideo",
  artist: music.artist,
  source: "api",
  featureUrl:music.featureUrl,
  landscapeThumbnail: music.artwork.landscapeUrl,
  progress: music.progress
    ? Math.min(100, (music.progress.seconds / music.durationSeconds) * 100)
    : 0,
  moviePreference: music.preference,
  badge: music.accessTier === "premium" ? "premium" : "free",
  title: music.title,
  description: music.synopsis,
  thumbnail: music.kind === "track" ? music.artwork.portraitUrl : music.artwork.landscapeUrl,
  genre: music.genreNames.join(" · "),
  year: music.releaseYear,
  classification: music.classification,
  durationSeconds: music.durationSeconds,
  duration: Math.max(1, Math.ceil(music.durationSeconds / 60)) + " min",
});
function useMusicValue() {
  const {
    session,
    loading: authLoading,
    error: authError,
  } = useCustomerSession();
  const [continuing, setContinuing] = useState<ApiMusic[]>([]);
  const [items, setItems] = useState<ApiMusic[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0);
  const profileRequired = !!session && !session.activeProfileId;
  const audience =
    session?.activeProfileId ?? (session ? "choose-profile" : "guest");
  const loadedAudienceRef = useRef<string | null>(null);
  const audienceRef = useRef(audience);
  audienceRef.current = audience;
  const request = useCallback(
    async (path: string) => {
      if (authError) throw Error(authError);
      if (session) return customerApi("/music" + path);
      const response = await fetch("/api/v1/catalog/music" + path, {
        credentials: "include",
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.message ?? "Music could not be loaded.");
      return body;
    },
    [audience, authError, session],
  );
  useEffect(() => {
    if (!connectedAuth || authLoading) return;
    let active = true;
    if (loadedAudienceRef.current !== audience) {
      setItems([]);
      setContinuing([]);
    }
    loadedAudienceRef.current = audience;
    setCursor(null);
    setError("");
    if (profileRequired) {
      setBusy(false);
      return;
    }
    setBusy(true);
    void Promise.all([
      request("?limit=100"),
      session
        ? request("?limit=24&continuing=true")
        : Promise.resolve({ items: [] }),
    ])
      .then(([page, progress]) => {
        if (active) {
          setItems(page.items);
          setContinuing(progress.items);
          setCursor(page.nextCursor);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [request, authLoading, revision]);
  const [preferences, setPreferences] = useState<
    Record<string, MusicPreference>
  >({});
  useEffect(() => setPreferences({}), [audience]);
  const preference = (music: Pick<ApiMusic, "id" | "preference">) => {
    const cached = preferences[audience + ":" + music.id];
    return cached && cached.version >= (music.preference?.version ?? 0)
      ? cached
      : (music.preference ?? {
          saved: false,
          liked: false,
          rating: null,
          version: 0,
        });
  };
  const save = async (
    music: Pick<ApiMusic, "id" | "preference">,
    patch: Partial<MusicPreference>,
  ) => {
    if (!session) throw Error("Sign in to save, like or rate a release.");
    if (profileRequired)
      throw Error(
        "Choose your profile before saving, liking or rating a release.",
      );
    const current = preference(music);
    const next = await customerApi(
      "/music/" + music.id + "/preference",
      "PUT",
      {
        saved: patch.saved ?? current.saved,
        liked: patch.liked ?? current.liked,
        rating: patch.rating === undefined ? current.rating : patch.rating,
      },
      {
        "If-Match": `"v${current.version}"`,
        "X-Profile-Context": session.activeProfileId,
      },
    );
    setPreferences((old) => ({ ...old, [audience + ":" + music.id]: next }));
    return next;
  };
  const recordProgress = (
    music: ApiMusic,
    progress: NonNullable<ApiMusic["progress"]>,
    profileContext: string,
  ) => {
    if (profileContext !== audienceRef.current) return;
    const updated = { ...music, progress };
    setContinuing((old) =>
      progress.completed || progress.seconds <= 0
        ? old.filter((item) => item.id !== music.id)
        : [updated, ...old.filter((item) => item.id !== music.id)],
    );
    setItems((old) =>
      old.map((item) => (item.id === music.id ? { ...item, progress } : item)),
    );
  };
  return {
    items,
    continuing,
    recordProgress,
    cursor,
    error: authError || error,
    busy: busy || authLoading,
    profileRequired,
    session,
    audience,
    request,
    preference,
    save,
    retry: () => setRevision((x) => x + 1),
    async more() {
      if (!cursor || busy) return;
      setBusy(true);
      try {
        const page = await request(
          "?limit=24&cursor=" + encodeURIComponent(cursor),
        );
        setItems((old) => [...old, ...page.items]);
        setCursor(page.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Music could not be loaded.");
      } finally {
        setBusy(false);
      }
    },
  };
}
const MusicContext = createContext<ReturnType<typeof useMusicValue> | null>(
  null,
);
export function MusicProvider({ children }: { children: ReactNode }) {
  const value = useMusicValue();
  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
}
export function useMusic() {
  const value = useContext(MusicContext);
  if (!value) throw Error("MusicProvider is required");
  return value;
}
