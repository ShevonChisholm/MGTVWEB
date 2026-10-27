import { useCatalogDemand } from "@/hooks/useCatalogDemand";
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
export type SportsPreference = {
  saved: boolean;
  liked: boolean;
  rating: number | null;
  version: number;
};
export type ApiSports = {
  originalLabel?:string|null;
  id: string;
  sport: string;
  competition: string;
  participants: string[];
  venue: string;
  occurredAt: string;
  coverage: "highlight" | "replay";
  title: string;
  synopsis: string;
  genreNames: string[];
  classification: string;
  releaseYear: number;
  durationSeconds: number;
  artwork: { portraitUrl: string; landscapeUrl: string };
  director?: string;
  cast?: string[];
  preference?: SportsPreference;
  accessTier: "free" | "premium";
  eligibleTierIds: string[];
  featureUrl?: string | null;
  previewAvailable: boolean;
  progress?: {
    seconds: number;
    completed: boolean;
    version: number;
    mediaVersionId: string | null;
  };
};
export const sportsItem = (sports: ApiSports): CatalogItem => ({
  id: sports.id,
  type: "sports",
  source: "api",
  featureUrl: sports.featureUrl,
  landscapeThumbnail: sports.artwork.landscapeUrl,
  progress: sports.progress
    ? Math.min(100, (sports.progress.seconds / sports.durationSeconds) * 100)
    : 0,
  sportsPreference: sports.preference,
  sportsCoverage: sports.coverage,
  sport: sports.sport,
  competition: sports.competition,
  occurredAt: sports.occurredAt,
  badge: sports.accessTier === "premium" ? "premium" : "free",
  title: sports.title,
  description: sports.synopsis,
  thumbnail: sports.artwork.landscapeUrl,
  genre: sports.genreNames.join(" · "),
  year: sports.releaseYear,
  classification: sports.classification,
  durationSeconds: sports.durationSeconds,
  duration: sports.durationSeconds < 60 ? Math.round(sports.durationSeconds) + " sec" : Math.ceil(sports.durationSeconds / 60) + " min",
});
function useSportsValue() {
  const startupReady = useHomeStartupReady();
  const demand = useCatalogDemand("sports");
  const {
    session,
    loading: authLoading,
    error: authError,
  } = useCustomerSession();
  const [continuing, setContinuing] = useState<ApiSports[]>([]);
  const [items, setItems] = useState<ApiSports[]>([]),
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
      if (session) return customerApi("/sports" + path);
      const response = await fetch("/api/v1/catalog/sports" + path, {
        credentials: "include",
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.message ?? "Sports could not be loaded.");
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
      demand==="full"?request("?limit=24"):Promise.resolve({items:[],nextCursor:null}),
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
    Record<string, SportsPreference>
  >({});
  useEffect(() => setPreferences({}), [audience]);
  const preference = (sports: Pick<ApiSports, "id" | "preference">) => {
    const cached = preferences[audience + ":" + sports.id];
    return cached && cached.version >= (sports.preference?.version ?? 0)
      ? cached
      : (sports.preference ?? {
          saved: false,
          liked: false,
          rating: null,
          version: 0,
        });
  };
  const save = async (
    sports: Pick<ApiSports, "id" | "preference">,
    patch: Partial<SportsPreference>,
  ) => {
    if (!session) throw Error("Sign in to save, like or rate a film.");
    if (profileRequired)
      throw Error(
        "Choose your profile before saving, liking or rating a film.",
      );
    const current = preference(sports);
    const next = await customerApi(
      "/sports/" + sports.id + "/preference",
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
    setPreferences((old) => ({ ...old, [audience + ":" + sports.id]: next }));
    return next;
  };
  const recordProgress = (
    sports: ApiSports,
    progress: NonNullable<ApiSports["progress"]>,
    profileContext: string,
  ) => {
    if (profileContext !== audienceRef.current) return;
    const updated = { ...sports, progress };
    setContinuing((old) =>
      progress.completed || progress.seconds <= 0
        ? old.filter((item) => item.id !== sports.id)
        : [updated, ...old.filter((item) => item.id !== sports.id)],
    );
    setItems((old) =>
      old.map((item) => (item.id === sports.id ? { ...item, progress } : item)),
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
          e instanceof Error ? e.message : "Sports could not be loaded.",
        );
      } finally {
        setBusy(false);
      }
    },
  };
}
const SportsContext = createContext<ReturnType<typeof useSportsValue> | null>(
  null,
);
export function SportsProvider({ children }: { children: ReactNode }) {
  const value = useSportsValue();
  return (
    <SportsContext.Provider value={value}>{children}</SportsContext.Provider>
  );
}
export function useSports() {
  const value = useContext(SportsContext);
  if (!value) throw Error("SportsProvider is required");
  return value;
}
