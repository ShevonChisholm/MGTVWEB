import {LoadingSkeleton} from "@/components/shared/LoadingSkeleton";
import {useSports,sportsItem,type ApiSports} from "@/context/SportsContext";
import { useMusic, musicItem, type ApiMusic } from "@/context/MusicContext";
import { useShows, seriesItem, type ApiSeries } from "@/context/ShowsContext";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { useMovies, movieItem, type ApiMovie } from "@/context/MovieContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { ActiveFilters } from "@/components/shared/DiscoveryResults";
import { MediaCard } from "@/components/home/MediaCard";
import type { DiscoveryState } from "@/hooks/useDiscoveryFilters";
import type { CatalogItem } from "@/data/mockContent";
type Facets = {
  genres: { id: string; name: string }[];
  classifications: { id: string; name: string }[];
  years: string[];
};
export function MovieDiscovery({
  collection = "movies",
  title = "Discover movies",
  query = "",
  saved = false,
  children,
  musicKind,
}: {
  collection?: "movies" | "shows" | "music" | "sports";
  musicKind?: "track" | "music-video";
  title?: string;
  query?: string;
  saved?: boolean;
  children?: (items: CatalogItem[]) => ReactNode;
}) {
  const sportsContext=useSports();
  const filmContext = useMovies(),
    showContext = useShows(),
    musicContext = useMusic();
  const movies =
      collection === "sports" ? sportsContext : collection === "movies"
        ? filmContext
        : collection === "music"
          ? musicContext
          : showContext,
    [params, setParams] = useSearchParams();
  const [items, setItems] = useState<ApiMovie[]>([]),
    [facets, setFacets] = useState<Facets>({
      genres: [],
      classifications: [],
      years: [],
    }),
    [cursor, setCursor] = useState<string | null>(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  const generation = useRef(0);
  const selection = Object.fromEntries(
    ["genre", "classification", "year"]
      .filter((k) => params.has(k))
      .map((k) => [k, params.get(k)!]),
  );
  const qs = new URLSearchParams({ limit: children ? (collection === "shows" ? "50" : "100") : "24" });
  const searchQuery = query || params.get("q") || "";
  if (searchQuery) qs.set("q", searchQuery);
  if (musicKind) qs.set("musicKind", musicKind);
  if (saved) qs.set("saved", "true");
  if (selection.genre) qs.set("genreId", selection.genre);
  if (selection.classification)
    qs.set("classificationId", selection.classification);
  if (selection.year) qs.set("year", selection.year);
  const queryString = qs.toString();
  useEffect(() => {
    const ticket = ++generation.current;
    setItems([]);
    setCursor(null);
    setError("");
    if (movies.busy || movies.profileRequired || (saved && !movies.session)) {
      setBusy(false);
      return;
    }
    setBusy(true);
    void Promise.all([
      movies.request("?" + queryString),
      movies.request("/facets"),
    ])
      .then(([page, filters]) => {
        if (ticket === generation.current) {
          setItems(page.items);
          setCursor(page.nextCursor);
          setFacets(filters);
        }
      })
      .catch((e) => {
        if (ticket === generation.current) setError(e.message);
      })
      .finally(() => {
        if (ticket === generation.current) setBusy(false);
      });
    return () => {
      generation.current++;
    };
  }, [
    collection,
    movies.request,
    movies.busy,
    movies.profileRequired,
    queryString,
    revision,
  ]);
  const noun =
    collection === "sports" ? "sports videos" : collection === "music"
      ? "releases"
      : collection === "shows"
        ? "series"
        : "films";
  const data =
    collection === "sports" ? (items as ApiSports[]).map(sportsItem) : collection === "movies"
      ? items.map(movieItem)
      : collection === "music"
        ? (items as unknown as ApiMusic[]).map(musicItem)
        : (items as ApiSeries[]).map(seriesItem);
  const set = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };
  const clear = () => {
    const next = new URLSearchParams(params);
    ["genre", "classification", "year"].forEach((k) => next.delete(k));
    setParams(next);
  };
  const discovery: DiscoveryState = {
    selection,
    groups: [
      {
        id: "genre",
        label: "Genre",
        options: facets.genres.map((x) => ({ value: x.id, label: x.name })),
      },
      {
        id: "year",
        label: "Release year",
        options: facets.years.map((x) => ({ value: x, label: x })),
      },
      {
        id: "classification",
        label: "Classification",
        options: facets.classifications.map((x) => ({
          value: x.id,
          label: x.name,
        })),
      },
    ],
    active: !!Object.keys(selection).length,
    set,
    clear,
    filtered: data,
  };
  async function more() {
    if (!cursor || busy) return;
    const ticket = generation.current;
    setBusy(true);
    try {
      const page = await movies.request(
        "?" + queryString + "&cursor=" + encodeURIComponent(cursor),
      );
      if (ticket === generation.current) {
        setItems((old) => [...old, ...page.items]);
        setCursor(page.nextCursor);
      }
    } catch (e) {
      if (ticket === generation.current)
        setError(
          e instanceof Error ? e.message : "Movies could not be loaded.",
        );
    } finally {
      if (ticket === generation.current) setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
      <Text as="h2" className="mb-8 font-display text-3xl">
        {title}
      </Text>
      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar discovery={discovery} />
        <div className="min-w-0 flex-1">
          <ActiveFilters discovery={discovery} count={data.length} />
          {movies.profileRequired ? (
            <div className="space-y-4 rounded-xl bg-bg-surface p-8">
              <Text as="h3" className="font-display text-3xl">
                Who’s joining us?
              </Text>
              <Text className="text-sm text-text-secondary">
                Choose a profile so we can show content within its age
                classification.
              </Text>
              <ButtonLink to="/profiles">Choose profile</ButtonLink>
            </div>
          ) : saved && !movies.session ? (
            <ButtonLink to="/auth/sign-in">
              Sign in to view saved {noun}
            </ButtonLink>
          ) : error ? (
            <div
              role="alert"
              className="space-y-4 rounded-xl border border-rose-400/40 bg-bg-surface p-6"
            >
              <p>{error}</p>
              <Button onClick={() => setRevision((x) => x + 1)}>
                Try again
              </Button>
              {discovery.active && (
                <Button onClick={clear} variant="outline">
                  Clear filters
                </Button>
              )}
              {movies.session && (
                <ButtonLink to="/profiles" variant="outline">
                  Choose profile
                </ButtonLink>
              )}
            </div>
          ) : (busy || movies.busy) && !items.length ? (
            <LoadingSkeleton label={<>Loading {noun}…</>} columns={3}/>
          ) : !items.length ? (
            <div className="space-y-4 rounded-xl bg-bg-surface p-8">
              <Text as="h3" className="font-display text-3xl">
                {saved
                  ? "Your next favourites belong here."
                  : `No ${noun} in this view yet.`}
              </Text>
              <Text className="text-sm text-text-secondary">
                {saved
                  ? `Save a ${collection === "shows" ? "series" : "film"} to add it to this profile’s collection.`
                  : discovery.active
                    ? "Try removing a filter."
                    : `Published ${noun} will appear here when available.`}
              </Text>
              {discovery.active && (
                <Button onClick={clear} variant="outline">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {children && !discovery.active ? (
                children(data)
              ) : (
                <div className="grid items-start gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {data.map((item) => (
                    <MediaCard key={item.id} item={item} fluid />
                  ))}
                </div>
              )}
              {cursor && (
                <Button
                  variant="outline"
                  className="mt-8"
                  disabled={busy}
                  onClick={() => void more()}
                >
                  {busy ? "Loading…" : `More ${noun}`}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
