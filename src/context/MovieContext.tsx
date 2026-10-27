import { useCatalogDemand } from "@/hooks/useCatalogDemand";
import { musicDuration as filmDuration } from "@/lib/musicPresentation";
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
export type MoviePreference = {
  saved: boolean;
  liked: boolean;
  rating: number | null;
  version: number;
};
export type ApiMovie = {
  originalLabel?:string|null;
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
  preference?: MoviePreference;
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
export const movieItem = (movie: ApiMovie): CatalogItem => ({
  id: movie.id,
  type: "movie",
  source: "api",
  featureUrl:movie.featureUrl,
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
  duration: filmDuration(movie.durationSeconds),
});
function useMovieValue() {
  const startupReady = useHomeStartupReady();
  const demand = useCatalogDemand("movies");
  const {
    session,
    loading: authLoading,
    error: authError,
  } = useCustomerSession();
  const [continuing, setContinuing] = useState<ApiMovie[]>([]);
  const [items, setItems] = useState<ApiMovie[]>([]),
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
      if (session) return customerApi("/movies" + path);
      const response = await fetch("/api/v1/catalog/movies" + path, {
        credentials: "include",
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.message ?? "Movies could not be loaded.");
      return body;
    },
    [audience, authError, session],
  );
  useEffect(() => {
    if (!connectedAuth || authLoading || !startupReady) return;
    if(demand==="none"||(demand==="history"&&!session)){
      setItems([]);setContinuing([]);setCursor(null);setError("");setBusy(false);return;
    }
    let active = true;
    setItems([]);
    setContinuing([]);
    setCursor(null);
    setError("");
    if (profileRequired) {
      setBusy(false);
      return;
    }
    setBusy(true);
    void Promise.all([
      demand==="full"?request("?limit=100"):Promise.resolve({items:[],nextCursor:null}),
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
  }, [request, authLoading, revision, startupReady, demand]);
  const [preferences, setPreferences] = useState<
    Record<string, MoviePreference>
  >({});
  useEffect(() => setPreferences({}), [audience]);
  const preference = (movie: Pick<ApiMovie, "id" | "preference">) => {
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
    movie: Pick<ApiMovie, "id" | "preference">,
    patch: Partial<MoviePreference>,
  ) => {
    if (!session) throw Error("Sign in to save, like or rate a film.");
    if (profileRequired)
      throw Error(
        "Choose your profile before saving, liking or rating a film.",
      );
    const current = preference(movie);
    const next = await customerApi(
      "/movies/" + movie.id + "/preference",
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
    movie: ApiMovie,
    progress: NonNullable<ApiMovie["progress"]>,
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
          e instanceof Error ? e.message : "Movies could not be loaded.",
        );
      } finally {
        setBusy(false);
      }
    },
  };
}
const MovieContext = createContext<ReturnType<typeof useMovieValue> | null>(
  null,
);
export function MovieProvider({ children }: { children: ReactNode }) {
  const value = useMovieValue();
  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
export function useMovies() {
  const value = useContext(MovieContext);
  if (!value) throw Error("MovieProvider is required");
  return value;
}
