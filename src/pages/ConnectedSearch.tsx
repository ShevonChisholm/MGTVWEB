import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { customerApi } from "@/lib/customerAuth";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  useDiscovery,
  useDiscoveryFacets,
  discoveryKinds,
} from "@/lib/connectedDiscovery";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import DiscoveryCard from "@/components/search/DiscoveryCard";
const labels: Record<string, string> = {
  podcast: "Podcasts",
  movie: "Movies",
  show: "Shows",
  episode: "Episodes",
  music: "Music",
  sports: "Sports",
  event: "Events",
  artist: "Artists",
  album: "Albums",
  playlist: "Playlists",
  news: "News",
  lifestyle: "Lifestyle",
};
export default function ConnectedSearch() {
  const [params, setParams] = useSearchParams(),
    q = params.get("q") ?? "",
    [input, setInput] = useState(q),
    facets = useDiscoveryFacets();
  const query = new URLSearchParams(params);
  query.delete("cursor");
  query.set("limit", "24");
  const scope = query.toString(),
    page = useDiscovery(scope),
    [extra, setExtra] = useState<{
      scope: string;
      items: any[];
      next: string | null;
    }>({ scope: "", items: [], next: null }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const audienceScope = scope + ":" + page.audience,
    requestScope = useRef(audienceScope);
  requestScope.current = audienceScope;
  const more = extra.scope === audienceScope ? extra.items : [],
    next = extra.scope === audienceScope ? extra.next : null;
  useEffect(() => setInput(q), [q]);
  useEffect(() => {
    setExtra({ scope: audienceScope, items: [], next: null });
    setError("");
    setBusy(false);
  }, [audienceScope]);
  useEffect(
    () => () => {
      requestScope.current = "unmounted";
    },
    [],
  );
  function filter(key: string, value: string) {
    const p = new URLSearchParams(params);
    p.delete("cursor");
    if (value) p.set(key, value);
    else p.delete(key);
    setParams(p);
  }
  async function loadMore() {
    const requestedScope = audienceScope;
    setBusy(true);
    setError("");
    try {
      const cursor = next ?? page.data?.nextCursor,
        p = new URLSearchParams(scope);
      p.set("cursor", cursor);
      const r =
        page.audience !== "guest"
          ? await customerApi("/discovery/search?" + p)
          : await fetch("/api/v1/catalog/discovery/search?" + p, {
              cache: "no-store",
            }).then(async (r) => {
              const b = await r.json();
              if (!r.ok)
                throw Error(b.message ?? "More results could not be loaded.");
              return b;
            });
      if (requestScope.current === requestedScope)
        setExtra((old) => ({
          scope: requestedScope,
          items: [
            ...(old.scope === requestedScope ? old.items : []),
            ...r.items,
          ],
          next: r.nextCursor ?? "",
        }));
    } catch (e) {
      if (requestScope.current === requestedScope)
        setError((e as Error).message);
    } finally {
      if (requestScope.current === requestedScope) setBusy(false);
    }
  }
  const items = [...(page.data?.items ?? []), ...more];
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1760px] px-6 py-16 md:px-8">
        <h1 className="mb-6 font-display text-5xl">Search MGTV</h1>
        <form
          className="mb-6 flex max-w-2xl gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            filter("q", input.trim());
          }}
        >
          <Input
            aria-label="Search MGTV catalog"
            maxLength={120}
            placeholder="Titles, artists, sports and stories…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
        <p className="text-sm text-text-secondary">
          {q
            ? `Find your next story: “${q}”`
            : "A story, a sound, a moment. Find yours."}
        </p>
        <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              key: "category",
              label: "Category",
              values: facets.data?.category ?? [],
            },
            {
              key: "kind",
              label: "Content type",
              values: discoveryKinds.map((id) => ({ id, name: labels[id] })),
            },
            { key: "genre", label: "Genre", values: facets.data?.genre ?? [] },
            { key: "tag", label: "Tag", values: facets.data?.tag ?? [] },
            {
              key: "format",
              label: "Media format",
              values: [
                { id: "music-video", name: "Music videos" },
                { id: "track", name: "Audio tracks" },
                {id:"audio",name:"Audio podcasts"},{id:"video",name:"Video podcasts"},{id:"mixed",name:"Audio + video series"},
              ],
            },
          ].map((f) => (
            <label key={f.key} className="min-w-0 text-sm text-text-secondary">
              {f.label}
              <select
                className="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-bg-surface px-3 text-text-primary"
                value={params.get(f.key) ?? ""}
                onChange={(e) => filter(f.key, e.target.value)}
              >
                <option value="">All</option>
                {f.values.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {facets.error && (
          <p role="alert" className="my-4">
            {facets.error}
            <Button variant="ghost" onClick={facets.retry}>
              Retry filters
            </Button>
          </p>
        )}
        {page.profileRequired ? (
          <ButtonLink to="/profiles">Choose profile to search</ButtonLink>
        ) : page.loading ? (
          <LoadingSkeleton label="Finding stories…" />
        ) : page.error ? (
          <div role="alert">
            <p>{page.error}</p>
            <Button variant="outline" onClick={page.retry}>
              Try search again
            </Button>
            <Button variant="ghost" onClick={() => setParams({})}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl">
                {items.length ? "Your discoveries" : "No matching stories yet"}
              </h2>
              {params.toString() && (
                <Button variant="ghost" onClick={() => setParams({})}>
                  Clear filters
                </Button>
              )}
            </div>
            {!items.length && (
              <p className="text-text-secondary">
                Try a different title or widen your filters.
              </p>
            )}
            <div className="grid items-start gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {items.map((r: any) => (
                <DiscoveryCard key={r.kind + r.id} entry={r} />
              ))}
            </div>
            {error && (
              <p role="alert" className="mt-5">
                {error}
              </p>
            )}
            {(next === null ? page.data?.nextCursor : next) && (
              <Button
                className="mt-8"
                variant="outline"
                disabled={busy}
                onClick={() => void loadMore()}
              >
                {busy ? "Loading…" : "More discoveries"}
              </Button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
