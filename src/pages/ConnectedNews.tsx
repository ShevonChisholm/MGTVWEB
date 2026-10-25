import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
import { useHomepage } from "@/lib/homepage";
import { FeaturedStatus } from "@/components/home/FeaturedStatus";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useNews, type NewsArticle } from "@/lib/news";
import { ShareBar } from "@/components/shared/ShareBar";
function Status({
  loading,
  error,
  retry,
  detail = false,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
  detail?: boolean;
}) {
  return (
    <main className="min-h-screen bg-bg-base px-6 pt-28 text-text-primary">
      <h1 className="font-display text-4xl">The Current</h1>
      {loading ? (
        <LoadingSkeleton
          label="Loading stories…"
          variant={detail ? "article" : "landscape"}
          columns={3}
        />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <p className="my-5 text-text-secondary">
          {detail
            ? "This story is unavailable."
            : "No stories have been published yet."}
        </p>
      )}
      <Link className="ml-4 text-gold" to="/news">
        Back to News
      </Link>
    </main>
  );
}
export function StoryCard({ a }: { a: NewsArticle }) {
  return (
    <Link
      to={"/news/" + a.id}
      className="group overflow-hidden rounded-xl border border-white/5 bg-bg-surface hover:border-gold/30"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={a.coverUrl}
          alt={a.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-gold">
          {a.category}
        </p>
        <h2 className="mt-2 font-display text-2xl text-text-primary group-hover:text-gold">
          {a.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          {a.summary}
        </p>
        <p className="mt-4 text-xs text-text-secondary">
          {new Date(a.publishedAt).toLocaleDateString("en-JM")} ·{" "}
          {a.readMinutes} min read
        </p>
      </div>
    </Link>
  );
}
export function ConnectedNewsPage() {
  const featuredPage = useHomepage("news");
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState(""),
    [extra, setExtra] = useState<NewsArticle[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [moreError, setMoreError] = useState(""),
    [busy, setBusy] = useState(false);
  const page = useNews("/news?limit=12&q=" + encodeURIComponent(filter));
  const articles: NewsArticle[] = [...(page.data?.items ?? []), ...extra],
    featured = featuredPage.hero[0]?.content as NewsArticle | undefined;
  async function more() {
    setBusy(true);
    setMoreError("");
    try {
      const r = await fetch(
        "/api/v1/catalog/news?limit=12&q=" +
          encodeURIComponent(filter) +
          "&after=" +
          encodeURIComponent(cursor ?? page.data.nextCursor),
      );
      const b = await r.json();
      if (!r.ok) throw Error(b.message ?? "Could not load more stories.");
      setExtra((a) => [...a, ...b.items]);
      setCursor(b.nextCursor ?? "");
    } catch (e) {
      setMoreError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!page.loading && !page.error && !articles.length && filter)
    return (
      <main className="min-h-screen bg-bg-base px-6 pt-28 text-text-primary">
        <h1 className="font-display text-4xl">No matching stories</h1>
        <p className="my-5 text-text-secondary">
          Try another search or return to the full edition.
        </p>
        <button
          className="min-h-11 text-gold"
          onClick={() => {
            setFilter("");
            setQ("");
            setExtra([]);
            setCursor(null);
          }}
        >
          Show all stories
        </button>
      </main>
    );
  if (page.loading || page.error) return <Status {...page} />;
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <FeaturedStatus page={featuredPage} />
      {!featured && (
        <h1 className="px-6 py-8 font-display text-5xl md:px-8">The Current</h1>
      )}
      <section className="border-b border-gold/20 bg-bg-surface">
        <div className="mx-auto max-w-[1760px] px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-muted/20 py-5">
            <p className="font-display text-2xl tracking-widest text-text-primary">
              The Current
            </p>
            <p className="text-sm text-text-secondary">Stories from MGTV</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Caribbean perspectives
            </p>
          </div>
          {featured && (
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center py-10 md:py-14 lg:pr-10">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">
                  Featured · {featured.category}
                </p>
                <h1 className="mb-5 font-display text-4xl leading-tight text-text-primary md:text-6xl">
                  {featured.title}
                </h1>
                <p className="mb-5 text-sm text-text-secondary">
                  {new Date(featured.publishedAt).toLocaleDateString("en-JM")} ·{" "}
                  {featured.readMinutes} min read · By {featured.author}
                </p>
                <p className="mb-6 max-w-md text-base leading-relaxed text-text-secondary">
                  {featured.summary}
                </p>
                <Link
                  to={"/news/" + featured.id}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-gold"
                >
                  Read story →
                </Link>
                <div className="mt-6 space-y-3 border-t border-text-muted/20 pt-5">
                  {articles
                    .filter((a) => a.id !== featured.id)
                    .slice(0, 2)
                    .map((a) => (
                      <Link
                        key={a.id}
                        to={"/news/" + a.id}
                        className="block text-sm text-text-secondary hover:text-gold"
                      >
                        {a.title}
                      </Link>
                    ))}
                </div>
              </div>
              <div className="relative min-h-64 overflow-hidden">
                <img
                  src={featured.coverUrl}
                  alt={featured.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-surface/60 to-transparent" />
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-text-primary">
            Stories worth your time
          </h2>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setExtra([]);
              setCursor(null);
              setFilter(q.trim());
            }}
          >
            <label className="text-sm text-text-secondary">
              Search stories
              <input
                className="ml-3 rounded border border-white/20 bg-bg-surface p-2 text-text-primary"
                value={q}
                maxLength={180}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <button className="min-h-11 text-gold">Search</button>
          </form>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map((a) => (
            <StoryCard key={a.id} a={a} />
          ))}
        </div>
        {moreError && (
          <p role="alert" className="my-4 text-text-primary">
            {moreError}
          </p>
        )}
        {(cursor === null ? page.data.nextCursor : cursor) && (
          <button
            disabled={busy}
            onClick={() => void more()}
            className="mt-8 min-h-11 rounded border border-gold px-6 text-gold"
          >
            {busy ? "Loading…" : "More stories"}
          </button>
        )}
      </section>
    </main>
  );
}
export function ConnectedNewsArticle() {
  const { id } = useParams();
  const article = useNews("/news/" + id),
    related = useNews("/news?limit=4");
  if (article.loading || article.error || !article.data)
    return <Status {...article} detail />;
  const a = article.data as NewsArticle;
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      <figure>
        <div className="relative h-64 overflow-hidden md:h-96">
          <img
            src={a.coverUrl}
            alt={a.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
        </div>
        {a.imageCaption && (
          <figcaption className="mx-auto max-w-[824px] px-8 pt-3 text-xs text-text-secondary">
            {a.imageCaption}
          </figcaption>
        )}
      </figure>
      <article className="mx-auto max-w-[824px] px-6 py-10 md:px-8">
        <Link
          to="/news"
          className="mb-6 inline-flex min-h-11 items-center text-sm text-gold"
        >
          ← Back to The Current
        </Link>
        <div className="mb-5 flex flex-wrap gap-3 text-xs text-text-secondary">
          <span className="font-bold uppercase tracking-widest text-gold">
            {a.category}
          </span>
          <time dateTime={a.publishedAt}>
            {new Date(a.publishedAt).toLocaleDateString("en-JM", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>By {a.author}</span>
          <span>{a.readMinutes} min read</span>
        </div>
        <h1 className="mb-6 break-words font-display text-4xl leading-tight text-text-primary md:text-6xl">
          {a.title}
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-text-primary">
          {a.summary}
        </p>
        <div className="space-y-5 break-words">
          {a.blocks?.map((b, i) =>
            b.type === "heading" ? (
              <h2
                key={i}
                className="pt-4 font-display text-3xl text-text-primary"
              >
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
                key={i}
                className="whitespace-pre-wrap text-base leading-relaxed text-text-secondary"
              >
                {b.text}
              </p>
            ),
          )}
        </div>
        <div className="mt-10 border-t border-white/10 pt-8">
          <ShareBar title={a.title} />
        </div>
      </article>
      {related.data?.items.some((r: NewsArticle) => r.id !== id) && (
        <section className="mx-auto max-w-[1760px] px-6 pb-16 md:px-8">
          <h2 className="mb-6 font-display text-3xl text-text-primary">
            More from The Current
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {related.data.items
              .filter((r: NewsArticle) => r.id !== id)
              .slice(0, 3)
              .map((r: NewsArticle) => (
                <StoryCard key={r.id} a={r} />
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
