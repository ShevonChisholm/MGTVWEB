import { PodcastCard, PodcastGlyph } from "@/components/podcasts/PodcastCard";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { podcastRequest, type Podcast } from "@/lib/podcasts";
import { useCustomerSession, customerApi } from "@/lib/customerAuth";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ShareBar } from "@/components/shared/ShareBar";
import "@/components/podcasts/podcasts.css";
export default function PodcastsPage() {
  const { id } = useParams(),
    auth = useCustomerSession(),
    profile = auth.session?.activeProfileId,
    [params, setParams] = useSearchParams(),
    query = params.get("q") ?? "";
  const [data, setData] = useState<any>(null),
    [items, setItems] = useState<Podcast[]>([]),
    [resume, setResume] = useState<Podcast[]>([]),
    [next, setNext] = useState<string | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [search, setSearch] = useState(query),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (auth.loading) return;
    let active = true;
    const abort = new AbortController();
    setLoading(true);
    setError("");
    setResume([]);
    void (async () => {
      const suffix = id
        ? "/" + id + "/episodes?limit=24"
        : "?limit=24&q=" + encodeURIComponent(query);
      const [page, detail] = await Promise.all([
        podcastRequest(suffix, profile, abort.signal),
        id
          ? podcastRequest("/" + id, profile, abort.signal)
          : Promise.resolve(null),
      ]);
      if (!active) return;
      setData(detail);
      setItems(page.items);
      setNext(page.nextCursor);
      if (!id && profile)
        try {
          const r = await customerApi("/podcasts/resume", "GET", undefined, {
            "X-Profile-Context": profile,
          });
          if (active) setResume(r.items);
        } catch {
          /* Catalog browsing remains available if private history fails. */
        }
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
    };
  }, [id, profile, auth.loading, query, retry]);
  async function more() {
    if (!next) return;
    setBusy(true);
    try {
      const p = await podcastRequest(
        (id ? "/" + id + "/episodes" : "") +
          "?" +
          new URLSearchParams({
            limit: "24",
            after: next,
            ...(!id ? { q: query } : {}),
          }),
        profile,
      );
      setItems((old) => [...old, ...p.items]);
      setNext(p.nextCursor);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading || auth.loading)
    return (
      <div className="podcasts-page">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="cards" count={8} />
      </div>
    );
  if (error && !items.length)
    return (
      <div className="podcasts-page pc-empty" role="alert">
        <PodcastGlyph size={48} />
        <h1>We couldn’t tune in.</h1>
        <p>{error}</p>
        <Button onClick={() => setRetry((x) => x + 1)}>Try again</Button>
      </div>
    );
  const featured: Podcast | undefined = data ?? items[0];
  return (
    <div className="podcasts-page">
      {id && (
        <Link className="pc-back" to="/podcasts">
          ← All podcasts
        </Link>
      )}
      <section className="pc-hero">
        {featured?.coverUrl && (
          <HeroBackdrop
            poster={featured.coverUrl}
            featureUrl={featured.featureUrl}
          />
        )}
        <div className="pc-hero-copy">
          <p className="pc-kicker">
            <PodcastGlyph size={18} />
            MGTV PODCASTS ·{" "}
            {id ? featured?.category : "MORE THAN A CONVERSATION"}
          </p>
          <h1>{id ? featured?.title : "Pull up a chair."}</h1>
          <p>
            {id
              ? featured?.description
              : "Big ideas. Familiar voices. Stories that stay with you. Discover conversations from Jamaica and beyond—on mic and on screen."}
          </p>
          <div className="pc-hero-meta">
            {id ? (
              <>
                <span>{featured?.host}</span>
                <span>
                  {featured?.format === "mixed"
                    ? "Audio & video"
                    : featured?.format}
                </span>
                <span>{featured?.classification}</span>
                {featured?.accessTier === "premium" && (
                  <span className="pc-gold">MGTV+</span>
                )}
              </>
            ) : (
              <span>Listen closer. See the whole story.</span>
            )}
          </div>
          {id ? (
            <a className="pc-primary" href="#podcast-episodes">
              <PodcastGlyph name="play" size={18} />
              Explore episodes
            </a>
          ) : (
            featured && (
              <ButtonLink to={"/podcasts/" + featured.id}>
                Discover {featured.title}
              </ButtonLink>
            )
          )}
        </div>
      </section>
      {!id && (
        <form
          className="pc-search"
          onSubmit={(e) => {
            e.preventDefault();
            setParams(search.trim() ? { q: search.trim() } : {});
          }}
        >
          <label htmlFor="podcast-search">Find your next conversation</label>
          <div>
            <input
              id="podcast-search"
              placeholder="Search podcasts…"
              maxLength={160}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
            {query && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setParams({});
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      )}
      {!id && resume.length > 0 && (
        <section className="pc-section">
          <div className="pc-section-title">
            <div>
              <p>Pick up where the conversation left off.</p>
              <h2>Continue listening & watching</h2>
            </div>
          </div>
          <div className="pc-grid">
            {resume.map((item) => (
              <PodcastCard key={item.id} item={item} resume />
            ))}
          </div>
        </section>
      )}
      <section className="pc-section" id="podcast-episodes">
        <div className="pc-section-title">
          <div>
            <p>
              {id
                ? "One voice leads to another."
                : "Find a voice that speaks to you."}
            </p>
            <h2>
              {id
                ? "Episodes"
                : query
                  ? "Search results"
                  : "Find your frequency"}
            </h2>
          </div>
          {id && (
            <ShareBar title={featured?.title ?? "MGTV Podcasts"} compact />
          )}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="pc-grid">
          {items.map((item) => (
            <PodcastCard key={item.id} item={item} />
          ))}
        </div>
        {!items.length && (
          <div className="pc-empty">
            <PodcastGlyph size={42} />
            <h3>
              {query
                ? "No conversations found."
                : "The conversation is coming."}
            </h3>
            <p>
              {query
                ? "Try a different title."
                : "Episodes will appear here when they’re ready."}
            </p>
          </div>
        )}
        {next && (
          <Button className="mt-8" disabled={busy} onClick={more}>
            {busy ? "Loading…" : "Explore more"}
          </Button>
        )}
      </section>
    </div>
  );
}
