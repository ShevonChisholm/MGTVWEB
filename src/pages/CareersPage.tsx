import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
const ArrowUpRight = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M6 18 18 6M6 6h12v12" />
  </svg>
);
const MapPin = ({ size = 16 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
const BriefcaseBusiness = ({ size = 16 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V3h8v4M3 12h18M12 10v4" />
  </svg>
);
type Vacancy = {
  id: string;
  body: {
    title: string;
    department: string;
    location: string;
    workplace: string;
    employment: string;
    summary: string;
    description: string;
    requirements: string;
    applicationUrl: string;
    closesAt: string;
  };
};
async function read(path: string, signal: AbortSignal) {
  const r = await fetch("/api/v1/catalog/careers" + path, {
    credentials: "omit",
    cache: "no-store",
    signal,
  });
  const b = await r.json();
  if (!r.ok)
    throw Error(
      b.message ?? "We couldn’t load these opportunities. Please try again.",
    );
  return b;
}
export default function CareersPage() {
  const { id } = useParams();
  const [items, setItems] = useState<Vacancy[]>([]),
    [record, setRecord] = useState<Vacancy | null>(null),
    [next, setNext] = useState<string | null>(null),
    [search, setSearch] = useState(""),
    [query, setQuery] = useState(""),
    [retry, setRetry] = useState(0),
    [busy, setBusy] = useState(true),
    [error, setError] = useState(""),
    [moreBusy, setMoreBusy] = useState(false);
  useEffect(() => {
    const c = new AbortController();
    setBusy(true);
    setError("");
    setRecord(null);
    setItems([]);
    setCursor(null);
    setNext(null);
    setMoreBusy(false);
    read(
      id ? "/" + encodeURIComponent(id) : "?q=" + encodeURIComponent(query),
      c.signal,
    )
      .then((b) => {
        if (c.signal.aborted) return;
        if (id) setRecord(b);
        else {
          setItems(b.items);
          setNext(b.next);
        }
      })
      .catch((e) => {
        if (!c.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!c.signal.aborted) setBusy(false);
      });
    return () => c.abort();
  }, [id, query, retry]);
  // Pagination is aborted when the query/route changes so stale results cannot join a new list.
  const [cursor, setCursor] = useState<{ value: string; query: string } | null>(
    null,
  );
  useEffect(() => {
    if (!cursor || id || cursor.query !== query) return;
    const c = new AbortController();
    setMoreBusy(true);
    setError("");
    read("?q=" + encodeURIComponent(query) + "&after=" + cursor.value, c.signal)
      .then((b) => {
        if (!c.signal.aborted) {
          setItems((v) => [
            ...v,
            ...b.items.filter((x: Vacancy) => !v.some((y) => y.id === x.id)),
          ]);
          setNext(b.next);
        }
      })
      .catch((e) => {
        if (!c.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!c.signal.aborted) setMoreBusy(false);
      });
    return () => c.abort();
  }, [cursor, id, query]);
  useEffect(() => {
    if (!record) return;
    const check = () => {
      if (Date.parse(record.body.closesAt) <= Date.now()) {
        setRecord(null);
        setError("Applications for this opportunity have closed.");
      }
    };
    check();
    const timer = window.setInterval(check, 30000);
    return () => window.clearInterval(timer);
  }, [record]);
  const date = (value: string) =>
    new Intl.DateTimeFormat("en-JM", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Jamaica",
    }).format(new Date(value));
  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <Link
          to={id ? "/careers" : "/"}
          className="text-sm text-text-secondary hover:text-gold"
        >
          ← {id ? "All opportunities" : "Home"}
        </Link>
        {!id && (
          <header className="border-b border-white/10 py-12 md:py-16">
            <p className="text-gold uppercase tracking-[0.2em] text-xs font-semibold mb-4">
              Build what moves us
            </p>
            <h1 className="font-display text-5xl md:text-7xl max-w-3xl">
              Your next chapter. Our shared story.
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mt-5">
              Bring your craft to MGTV. Help Caribbean stories, sounds and
              culture reach their next audience.
            </p>
          </header>
        )}
        {busy ? (
          <div
            aria-busy="true"
            aria-label="Loading opportunities"
            className="py-10 space-y-5 min-h-[460px]"
          >
            {id ? (
              <div
                className="max-w-3xl space-y-6 motion-safe:animate-pulse"
                aria-hidden="true"
              >
                <div className="h-4 w-28 bg-white/10 rounded" />
                <div className="h-32 md:h-20 w-full bg-white/10 rounded" />
                <div className="h-5 w-3/4 bg-white/10 rounded" />
                <div className="h-24 bg-white/5 rounded" />
                <div className="h-8 w-48 bg-white/10 rounded" />
                <div className="h-48 bg-white/5 rounded" />
                <div className="h-8 w-48 bg-white/10 rounded" />
                <div className="h-40 bg-white/5 rounded" />
              </div>
            ) : (
              <>
                <div className="h-12 w-64 bg-white/5 rounded" />
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-56 border border-white/10 rounded-xl bg-white/5 motion-safe:animate-pulse"
                  />
                ))}
              </>
            )}
          </div>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                className="my-8 p-6 rounded-xl border border-gold/30"
              >
                {id && (
                  <h1 className="font-display text-4xl mb-4">
                    Opportunity unavailable
                  </h1>
                )}
                <p>{error}</p>
                <button
                  className="mt-4 text-gold underline"
                  onClick={() => {
                    if (cursor && items.length) setCursor({ ...cursor });
                    else setRetry((v) => v + 1);
                  }}
                >
                  Try again
                </button>
              </div>
            )}
            {record && (
              <article className="max-w-3xl pt-10">
                <p className="text-gold text-sm tracking-widest uppercase">
                  {record.body.department}
                </p>
                <h1 className="font-display text-5xl md:text-7xl mt-3 break-words">
                  {record.body.title}
                </h1>
                <div className="flex flex-wrap gap-5 text-text-secondary my-6">
                  <span>
                    {record.body.location} · {record.body.workplace}
                  </span>
                  <span>{record.body.employment.replace(/-/g, " ")}</span>
                </div>
                <p className="text-xl leading-relaxed mb-10">
                  {record.body.summary}
                </p>
                <h2 className="font-display text-3xl mb-4">The opportunity</h2>
                <p className="whitespace-pre-line text-text-secondary leading-relaxed break-words">
                  {record.body.description}
                </p>
                <h2 className="font-display text-3xl mt-10 mb-4">
                  What you’ll bring
                </h2>
                <p className="whitespace-pre-line text-text-secondary leading-relaxed break-words">
                  {record.body.requirements}
                </p>
                <div className="mt-12 border border-gold/25 bg-gold/5 p-6 rounded-tl-3xl rounded-br-3xl">
                  <h2 className="font-display text-3xl">Make your next move</h2>
                  <p className="text-text-secondary text-sm my-4">
                    Applications close {date(record.body.closesAt)} (Jamaica
                    time).
                  </p>
                  <a
                    href={record.body.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (Date.parse(record.body.closesAt) <= Date.now()) {
                        e.preventDefault();
                        setRecord(null);
                        setError(
                          "Applications for this opportunity have closed.",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-gold text-black font-semibold rounded-lg px-6 py-3"
                  >
                    Apply on external site <ArrowUpRight size={18} />
                  </a>
                  <p className="text-xs text-text-secondary mt-4 break-words">
                    Opens {new URL(record.body.applicationUrl).hostname} in a
                    new tab. Applications are handled by that site under its
                    privacy terms.
                  </p>
                </div>
              </article>
            )}
            {!id && (
              <section className="pt-10" aria-labelledby="opportunities">
                <div className="flex flex-wrap gap-5 items-end justify-between mb-7">
                  <h2 id="opportunities" className="font-display text-3xl">
                    Find your place
                  </h2>
                  <form
                    className="flex gap-2 max-w-full"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCursor(null);
                      setQuery(search.trim());
                    }}
                  >
                    <label className="sr-only" htmlFor="career-search">
                      Search opportunities
                    </label>
                    <input
                      id="career-search"
                      value={search}
                      maxLength={120}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Role, team or location"
                      className="min-w-0 w-56 bg-white/5 rounded-lg border border-white/15 px-3 py-2"
                    />
                    <button className="text-gold border border-gold/40 rounded-lg px-4">
                      Search
                    </button>
                  </form>
                </div>
                {!error && !items.length && (
                  <div className="border border-white/10 rounded-xl p-10 min-h-56">
                    <h3 className="font-display text-3xl">
                      {query
                        ? "No matching opportunities"
                        : "Our next chapter is taking shape"}
                    </h3>
                    <p className="text-text-secondary mt-3">
                      {query
                        ? "Try another role, team or location."
                        : "There are no open roles right now. Check back for your next opportunity."}
                    </p>
                    {query && (
                      <button
                        className="text-gold underline mt-5"
                        onClick={() => {
                          setSearch("");
                          setCursor(null);
                          setQuery("");
                        }}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
                <div className="grid gap-4">
                  {items.map((v) => (
                    <Link
                      key={v.id}
                      to={"/careers/" + v.id}
                      className="group border border-white/10 rounded-tl-3xl rounded-br-3xl p-6 md:p-8 bg-white/[0.025] hover:border-gold/50 transition-colors"
                    >
                      <p className="text-gold text-xs tracking-widest uppercase">
                        {v.body.department}
                      </p>
                      <div className="flex items-start justify-between gap-5 mt-3">
                        <h3 className="font-display text-3xl break-words">
                          {v.body.title}
                        </h3>
                        <ArrowUpRight className="shrink-0 text-gold" />
                      </div>
                      <p className="text-text-secondary mt-3 max-w-3xl break-words">
                        {v.body.summary}
                      </p>
                      <div className="flex flex-wrap gap-5 text-sm text-text-secondary mt-5">
                        <span className="inline-flex gap-2 items-center">
                          <MapPin size={15} />
                          {v.body.location} · {v.body.workplace}
                        </span>
                        <span className="inline-flex gap-2 items-center">
                          <BriefcaseBusiness size={15} />
                          {v.body.employment.replace(/-/g, " ")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {next && (
                  <button
                    disabled={moreBusy}
                    className="mt-7 border border-gold/40 rounded-lg px-6 py-3 text-gold disabled:opacity-50"
                    onClick={() => setCursor({ value: next, query })}
                  >
                    {moreBusy ? "Loading…" : "More opportunities"}
                  </button>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
