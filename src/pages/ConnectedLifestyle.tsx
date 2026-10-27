import LifestyleArtwork from "@/components/lifestyle/LifestyleArtwork";
import LifestyleCard from "@/components/lifestyle/LifestyleCard";
import LifestyleSkeleton from "@/components/lifestyle/LifestyleSkeleton";
import { SessionDialog } from "@/components/shared/SessionDialog";
import { lifestyleItem } from "@/lib/lifestyle";
import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
import { useHomepage } from "@/lib/homepage";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import {
  lifestyleCategories,
  useLifestyle,
  type LifestyleStory,
} from "@/lib/lifestyle";
import { useMusic } from "@/context/MusicContext";
import { customerApi } from "@/lib/customerAuth";
import { ShareBar } from "@/components/shared/ShareBar";
const colors = {
  food: "bg-[#FB923C]/15 text-[#FB923C]",
  travel: "bg-[#22D3EE]/15 text-[#22D3EE]",
  fashion: "bg-[#818CF8]/15 text-[#818CF8]",
  culture: "bg-gold/15 text-gold",
  wellness: "bg-[#4ADE80]/15 text-[#4ADE80]",
};
export function LifestyleStoryCard({
  story,
  fluid = true,
}: {
  story: LifestyleStory;
  fluid?: boolean;
}) {
  return <LifestyleCard item={lifestyleItem(story)} />;
}
export function ConnectedLifestyleEditorial() {
  const featuredPage = useHomepage("lifestyle");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "",
    query = params.get("q") ?? "";
  const [search, setSearch] = useState(query),
    [extra, setExtra] = useState<LifestyleStory[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [moreError, setMoreError] = useState("");
  const path =
      "/lifestyle?limit=12&category=" +
      encodeURIComponent(category) +
      "&q=" +
      encodeURIComponent(query),
    page = useLifestyle(path);
  const requestSerial = useRef(0);
  useEffect(() => {
    setExtra([]);
    setCursor(null);
    setSearch(query);
    setMoreError("");
    setBusy(false);
    requestSerial.current++;
  }, [path]);
  function filter(nextCategory: string, nextQuery = query) {
    const next = new URLSearchParams(params);
    if (nextCategory) next.set("category", nextCategory);
    else next.delete("category");
    if (nextQuery) next.set("q", nextQuery);
    else next.delete("q");
    setParams(next);
  }
  async function more() {
    const serial = ++requestSerial.current;
    setBusy(true);
    setMoreError("");
    try {
      const r = await fetch(
        "/api/v1/catalog" +
          path +
          "&after=" +
          encodeURIComponent(cursor ?? page.data.nextCursor),
      );
      const b = await r.json();
      if (!r.ok) throw Error(b.message ?? "More stories could not be loaded.");
      if (serial === requestSerial.current) {
        setExtra((old) => [...old, ...b.items]);
        setCursor(b.nextCursor ?? "");
      }
    } catch (e) {
      if (serial === requestSerial.current) setMoreError((e as Error).message);
    } finally {
      if (serial === requestSerial.current) setBusy(false);
    }
  }
  const stories: LifestyleStory[] = [...(page.data?.items ?? []), ...extra],
    featured = featuredPage.hero[0]?.content as LifestyleStory | undefined;
  return (
    <>
      <header className="border-b border-white/6 px-6 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1760px] items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.4em] text-gold">
              MGTV · Caribbean Lifestyle
            </p>
            <h1 className="font-display text-5xl tracking-wide text-text-primary md:text-6xl">
              Lifestyle
            </h1>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm text-text-secondary hover:text-gold md:block"
          >
            Visit Shop →
          </Link>
        </div>
      </header>
      <FeaturedStatus page={featuredPage} />
      {featured && (
        <div className="mx-auto max-w-[1760px] px-6 md:px-8">
          <Link
            to={"/lifestyle/" + featured.id}
            className="lifestyle-feature group relative block overflow-hidden"
          >
            <div className="lifestyle-feature__art">
              <LifestyleArtwork
                key={featured.coverUrl}
                src={featured.coverUrl}
                alt={featured.imageAlt}
                priority
              />
            </div>
            <div className="lifestyle-feature__shade" aria-hidden="true" />
            <span
              className={
                "absolute left-4 top-4 px-2.5 py-1.5 text-xs font-black uppercase tracking-widest " +
                colors[featured.category]
              }
            >
              {lifestyleCategories[featured.category]}
            </span>
            <div className="lifestyle-feature__copy relative px-6 pb-8 pt-40 md:max-w-3xl md:px-10 md:pt-52">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-gold">
                Featured Story
              </p>
              <h2 className="mb-3 break-words font-display text-4xl leading-tight text-text-primary md:text-6xl">
                {featured.title}
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                {featured.summary}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-gold px-6 py-2.5 text-xs font-black uppercase tracking-widest text-bg-base">
                  Read story
                </span>
                <span className="text-xs text-text-secondary">
                  {new Date(featured.publishedAt).toLocaleDateString("en-JM")} ·{" "}
                  {featured.readMinutes} min read
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
      <section className="mx-auto max-w-[1760px] px-6 py-12 md:px-8">
        <h2 className="mb-8 font-display text-3xl text-text-primary">
          Explore lifestyle
        </h2>
        <div className="flex min-w-0 flex-col gap-5">
          <div className="discovery-filter-trigger">
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(true)}
              className="min-h-11 rounded-lg border border-white/50 px-6 text-sm text-text-primary"
            >
              Filters{category ? " · 1" : ""}
            </button>
          </div>
          {filtersOpen && (
            <SessionDialog
              title="Lifestyle filters"
              placement="drawer"
              onClose={() => setFiltersOpen(false)}
            >
              <p className="mb-5 text-sm text-text-secondary">
                Find a story for your kind of day. Category changes apply
                immediately.
              </p>
              <h3 className="mb-3 text-xs uppercase tracking-widest text-gold">
                Category
              </h3>
              <div className="space-y-2">
                {[
                  ["", "All stories"],
                  ...Object.entries(lifestyleCategories),
                ].map(([v, label]) => (
                  <button
                    key={v}
                    aria-pressed={category === v}
                    className={
                      "block min-h-11 w-full rounded-lg border px-4 text-left text-sm " +
                      (category === v
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-white/10 text-text-secondary hover:text-gold")
                    }
                    onClick={() => filter(v)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="min-h-11 rounded-lg bg-gold px-6 text-bg-base"
                  onClick={() => setFiltersOpen(false)}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="min-h-11 text-gold"
                  onClick={() => filter("", "")}
                >
                  Clear filters
                </button>
              </div>
            </SessionDialog>
          )}
          <div className="min-w-0 flex-1">
            <form
              className="mb-6 flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                filter(category, search.trim());
              }}
            >
              <label className="min-w-0 flex-1 text-sm text-text-secondary">
                Search stories
                <input
                  className="mt-2 block min-h-11 w-full rounded-lg border border-white/20 bg-bg-surface px-3 text-text-primary"
                  maxLength={180}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <button className="min-h-11 rounded-lg border border-gold px-5 text-gold">
                Search
              </button>
              {(category || query) && (
                <button
                  type="button"
                  className="min-h-11 text-gold"
                  onClick={() => filter("", "")}
                >
                  Clear filters
                </button>
              )}
            </form>
            {page.loading ? (
              <LifestyleSkeleton />
            ) : page.error ? (
              <div role="alert" className="text-text-primary">
                <p>{page.error}</p>
                <button
                  className="mt-3 min-h-11 text-gold"
                  onClick={page.retry}
                >
                  Try again
                </button>
              </div>
            ) : !stories.length ? (
              <p className="py-8 text-text-secondary">
                {category || query
                  ? "No stories match these filters."
                  : "The next story is on its way. No lifestyle stories have been published yet."}
              </p>
            ) : (
              <div className="lifestyle-results-grid">
                {stories.map((a) => (
                  <LifestyleStoryCard key={a.id} story={a} />
                ))}
              </div>
            )}
            {moreError && (
              <p role="alert" className="mt-4 text-text-primary">
                {moreError}
              </p>
            )}
            {(cursor === null ? page.data?.nextCursor : cursor) && (
              <button
                disabled={busy || page.loading}
                className="mt-8 min-h-11 rounded-lg border border-gold px-6 text-gold"
                onClick={() => void more()}
              >
                {busy ? "Loading…" : "More stories"}
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function SaveStory({ id }: { id: string }) {
  const music = useMusic();
  return <ProfileSaveStory key={id + music.audience} id={id} />;
}
function ProfileSaveStory({ id }: { id: string }) {
  const state = useLifestyle("/lifestyle/" + id + "/preference", true);
  const [value, setValue] = useState<any>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    setValue(state.data);
  }, [state.data]);
  async function toggle() {
    setBusy(true);
    setError("");
    try {
      const b = await customerApi(
        "/lifestyle/" + id + "/preference",
        "PUT",
        { saved: !value.saved },
        {
          "X-Profile-Context": state.session.activeProfileId,
          "If-Match": '"v' + value.version + '"',
        },
      );
      if (alive.current) setValue(b);
    } catch (e) {
      if (alive.current) setError((e as Error).message);
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  if (!state.session)
    return (
      <Link
        to="/auth/sign-in"
        className="inline-flex min-h-11 items-center rounded-lg border border-gold px-5 text-gold"
      >
        Sign in to save story
      </Link>
    );
  if (!state.session.activeProfileId)
    return (
      <Link
        to="/profiles"
        className="inline-flex min-h-11 items-center text-gold"
      >
        Choose a profile to save story
      </Link>
    );
  return (
    <div>
      {state.error ? (
        <button className="min-h-11 text-gold" onClick={state.retry}>
          Retry saved status
        </button>
      ) : (
        <button
          disabled={state.loading || busy || !value}
          aria-pressed={!!value?.saved}
          onClick={() => void toggle()}
          className="min-h-11 rounded-lg border border-gold px-5 text-gold"
        >
          {busy ? "Saving…" : value?.saved ? "Saved to My List" : "Save story"}
        </button>
      )}
      {(error || state.error) && (
        <p role="alert" className="mt-3 text-sm text-text-secondary">
          {error || state.error}{" "}
          <button onClick={state.retry} className="text-gold">
            Refresh status
          </button>
        </p>
      )}
    </div>
  );
}
export function ConnectedLifestyleArticle() {
  const { id } = useParams();
  const page = useLifestyle("/lifestyle/" + id),
    related = useLifestyle("/lifestyle?limit=4");
  const a = page.data as LifestyleStory | undefined;
  if (page.loading || page.error || !a)
    return (
      <main className="min-h-screen bg-bg-base px-6 pt-28 text-text-primary">
        <h1 className="font-display text-4xl">Lifestyle & Culture</h1>
        {page.loading ? (
          <LoadingSkeleton label="Loading story…" variant="article" />
        ) : (
          <ErrorState
            message={page.error || "This story is unavailable."}
            onRetry={page.retry}
          />
        )}
        <Link to="/lifestyle" className="min-h-11 text-gold">
          Browse Lifestyle
        </Link>
      </main>
    );
  return (
    <main className="bg-bg-base pt-16">
      <figure className="lifestyle-article-figure">
        <div className="aspect-video max-h-96 overflow-hidden">
          <LifestyleArtwork
            key={a.coverUrl}
            src={a.coverUrl}
            alt={a.imageAlt}
            priority
          />
        </div>
        {a.imageCaption && (
          <figcaption className="mx-auto max-w-3xl px-6 pt-3 text-xs text-text-secondary">
            {a.imageCaption}
          </figcaption>
        )}
      </figure>
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-4 text-sm font-semibold tracking-wide text-gold">
          {lifestyleCategories[a.category]} ·{" "}
          <time dateTime={a.publishedAt}>
            {new Date(a.publishedAt).toLocaleDateString("en-JM")}
          </time>{" "}
          · {a.readMinutes} min read
        </p>
        <h1 className="mb-5 break-words font-display text-5xl leading-tight text-text-primary md:text-6xl">
          {a.title}
        </h1>
        <p className="mb-5 text-xl leading-relaxed text-text-primary">
          {a.summary}
        </p>
        <p className="mb-8 text-sm text-text-secondary">By {a.author}</p>
        <div className="mb-10 space-y-6 break-words">
          {a.blocks?.map((b, i) =>
            b.type === "heading" ? (
              <h2 className="font-display text-3xl text-text-primary" key={i}>
                {b.text}
              </h2>
            ) : b.type === "quote" ? (
              <blockquote
                key={i}
                className="border-l-2 border-gold pl-5 text-xl italic leading-relaxed text-text-primary"
              >
                {b.text}
              </blockquote>
            ) : (
              <p
                className="whitespace-pre-wrap text-base leading-loose text-text-secondary"
                key={i}
              >
                {b.text}
              </p>
            ),
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SaveStory id={a.id} />
          <ShareBar title={a.title} compact />
          <Link
            to="/lifestyle"
            className="inline-flex min-h-11 items-center text-gold"
          >
            All Lifestyle
          </Link>
        </div>
      </article>
      {related.data?.items.some((s: LifestyleStory) => s.id !== id) && (
        <section className="mx-auto max-w-[1760px] px-6 pb-16 md:px-8">
          <h2 className="mb-8 font-display text-3xl text-text-primary">
            More Stories
          </h2>
          <div className="lifestyle-results-grid">
            {related.data.items
              .filter((s: LifestyleStory) => s.id !== id)
              .slice(0, 3)
              .map((s: LifestyleStory) => (
                <LifestyleStoryCard key={s.id} story={s} />
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
export function SavedLifestyleStories() {
  const music = useMusic();
  return <ProfileSavedStories key={music.audience} />;
}
function ProfileSavedStories() {
  const page = useLifestyle("/lifestyle/saved?limit=50", true);
  const [extra, setExtra] = useState<LifestyleStory[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    setExtra([]);
    setCursor(null);
    setError("");
  }, [page.audience]);
  async function more() {
    setBusy(true);
    setError("");
    try {
      const b = await customerApi(
        "/lifestyle/saved?limit=50&after=" +
          encodeURIComponent(cursor ?? page.data.nextCursor),
        "GET",
        undefined,
        { "X-Profile-Context": page.session.activeProfileId },
      );
      setExtra((x) => [...x, ...b.items]);
      setCursor(b.nextCursor ?? "");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const stories: LifestyleStory[] = [...(page.data?.items ?? []), ...extra];
  return (
    <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
      <h2 className="mb-6 font-display text-3xl text-text-primary">
        Saved lifestyle stories
      </h2>
      {!page.session?.activeProfileId ? (
        <p className="text-text-secondary">
          Sign in and choose a profile to see your saved stories.
        </p>
      ) : page.loading ? (
        <LoadingSkeleton label={<>Loading saved stories…</>} variant="cards" />
      ) : page.error ? (
        <p role="alert" className="text-text-secondary">
          {page.error}{" "}
          <button className="text-gold" onClick={page.retry}>
            Try again
          </button>
        </p>
      ) : stories.length ? (
        <div className="lifestyle-results-grid">
          {stories.map((s) => (
            <LifestyleStoryCard key={s.id} story={s} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary">
          Your next good read belongs here. Save a lifestyle story to find it
          again.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-text-secondary">
          {error}
        </p>
      )}
      {(cursor === null ? page.data?.nextCursor : cursor) && (
        <button
          className="mt-6 min-h-11 text-gold"
          disabled={busy}
          onClick={() => void more()}
        >
          More saved stories
        </button>
      )}
    </section>
  );
}
