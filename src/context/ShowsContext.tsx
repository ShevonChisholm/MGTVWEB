import { useHomeStartupReady } from "@/lib/homeStartup";
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
export type SeriesPreference = {
  saved: boolean;
  liked: boolean;
  rating: number | null;
  version: number;
};
export type ApiSeries = {
  originalLabel?:string|null;
  id: string;
  kind: "show" | "episode";
  parentId: string | null;
  number: number | null;
  showId: string;
  seasonNumber: number | null;
  nextEpisode?: { id: string; title: string } | null;
  previousEpisode?: { id: string; title: string } | null;
  seasons?: {
    id: string;
    number: number;
    title: string;
    synopsis: string;
    episodes: ApiSeries[];
  }[];
  title: string;
  synopsis: string;
  genreNames: string[];
  classification: string;
  releaseYear: number;
  durationSeconds: number;
  artwork: { portraitUrl: string; landscapeUrl: string };
  director?: string;
  cast?: string[];
  preference?: SeriesPreference;
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
export const seriesItem = (movie: ApiSeries): CatalogItem => ({
  id: movie.id,
  type: movie.kind,
  source: "api",
  featureUrl:movie.featureUrl,
  showId: movie.showId,
  seasonNumber: movie.seasonNumber ?? undefined,
  episodeNumber: movie.number ?? undefined,
  landscapeThumbnail: movie.artwork.landscapeUrl,
  progress: movie.progress
    ? Math.min(100, (movie.progress.seconds / movie.durationSeconds) * 100)
    : 0,
  moviePreference: movie.preference,
  badge: movie.accessTier === "premium" ? "premium" : "free",
  title: movie.title,
  description: movie.synopsis,
  thumbnail: movie.artwork.portraitUrl,
  genre: movie.genreNames.join(" · "),
  year: movie.releaseYear,
  classification: movie.classification,
  durationSeconds: movie.durationSeconds,
  duration:
    movie.kind === "show"
      ? "Series"
      : Math.max(1, Math.ceil(movie.durationSeconds / 60)) + " min",
});
function useShowsValue() {
  const startupReady = useHomeStartupReady();
  const {
    session,
    loading: authLoading,
    error: authError,
  } = useCustomerSession();
  const [continuing, setContinuing] = useState<ApiSeries[]>([]);
  const [items, setItems] = useState<ApiSeries[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(connectedAuth),
    [revision, setRevision] = useState(0);
  const profileRequired = !!session && !session.activeProfileId;
  const audience =
    session?.activeProfileId ?? (session ? "choose-profile" : "guest");
  const audienceRef = useRef(audience);
  audienceRef.current = audience;
  const request = useCallback(
    async (path: string) => {
      if (authError) throw Error(authError);
      if (session) return customerApi("/shows" + path);
      const response = await fetch("/api/v1/catalog/shows" + path, {
        credentials: "include",
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.message ?? "Series could not be loaded.");
      return body;
    },
    [audience, authError, session],
  );
  const loadedAudience = useRef("");
  useEffect(() => {
    if (!connectedAuth || authLoading || !startupReady) return;
    let active = true;
    if (loadedAudience.current !== audience) {
      setItems([]);
      setContinuing([]);
      loadedAudience.current = audience;
    }
    setCursor(null);
    setError("");
    if (profileRequired) {
      setBusy(false);
      return;
    }
    setBusy(true);
    void Promise.all([
      request("?limit=50"),
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
  }, [request, authLoading, revision, startupReady]);
  const [preferences, setPreferences] = useState<
    Record<string, SeriesPreference>
  >({});
  useEffect(() => setPreferences({}), [audience]);
  const preference = (
    movie: Pick<ApiSeries, "id" | "preference"> & { kind?: "show" | "episode" },
  ) => {
    const cached = preferences[audience + ":" + movie.id];
    return cached && cached.version >= (movie.preference?.version ?? 0)
      ? cached
      : (movie.preference ?? {
          saved: false,
          liked: false,
          rating: null,
          version: 0,
        });
  };
  const save = async (
    movie: Pick<ApiSeries, "id" | "preference"> & { kind?: "show" | "episode" },
    patch: Partial<SeriesPreference>,
  ) => {
    if (!session) throw Error("Sign in to save, like or rate a series.");
    if (profileRequired)
      throw Error(
        "Choose your profile before saving, liking or rating a series.",
      );
    const current = preference(movie);
    const next = await customerApi(
      "/" +
        ("kind" in movie && movie.kind === "episode" ? "episodes" : "shows") +
        "/" +
        movie.id +
        "/preference",
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
    setPreferences((old) => ({ ...old, [audience + ":" + movie.id]: next }));
    return next;
  };
  const recordProgress = (
    movie: ApiSeries,
    progress: NonNullable<ApiSeries["progress"]>,
    profileContext: string,
  ) => {
    if (profileContext !== audienceRef.current) return;
    const updated = { ...movie, progress };
    setContinuing((old) =>
      progress.completed || progress.seconds <= 0
        ? old.filter((item) => item.id !== movie.id)
        : [updated, ...old.filter((item) => item.id !== movie.id)],
    );
    setItems((old) =>
      old.map((item) => (item.id === movie.id ? { ...item, progress } : item)),
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
    requestEpisode: async (id: string) => {
      if (authError) throw Error(authError);
      if (session) return customerApi("/episodes/" + encodeURIComponent(id));
      const response = await fetch(
        "/api/v1/catalog/episodes/" + encodeURIComponent(id),
      );
      const body = await response.json();
      if (!response.ok) throw Error(body.message);
      return body;
    },
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
        setError(
          e instanceof Error ? e.message : "Series could not be loaded.",
        );
      } finally {
        setBusy(false);
      }
    },
  };
}
const ShowsContext = createContext<ReturnType<typeof useShowsValue> | null>(
  null,
);
export function ShowsProvider({ children }: { children: ReactNode }) {
  const value = useShowsValue();
  return (
    <ShowsContext.Provider value={value}>{children}</ShowsContext.Provider>
  );
}
export function useShows() {
  const value = useContext(ShowsContext);
  if (!value) throw Error("ShowsProvider is required");
  return value;
}
