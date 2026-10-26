import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SessionDialog } from "@/components/shared/SessionDialog";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
type Nominee = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
};
type Category = {
  id: string;
  name: string;
  section: string;
  description: string;
  nominees: Nominee[];
};
type Program = {
  id: string;
  title: string;
  year: number;
  description: string;
  timezone: string;
  opensAt: string;
  closesAt: string;
  featureUrl: string | null;
  artwork: { landscapeUrl: string; portraitUrl?: string | null };
  phase: string;
  votePolicy: string;
  categories: Category[];
  results: any;
};
async function publicAwards(path = "", signal?: AbortSignal) {
  const r = await fetch("/api/v1/catalog/awards" + path, { signal });
  const b = await r.json();
  if (!r.ok) throw Error(b.message ?? "Awards could not load.");
  return b;
}
async function allPrograms(signal: AbortSignal) {
  const items: Program[] = [];
  let cursor: string | null = null;
  do {
    const page = await publicAwards(
      "?limit=50" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""),
      signal,
    );
    items.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return { items };
}
function AwardsImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return failed || !src ? (
    <div
      role="img"
      aria-label={name + " artwork unavailable"}
      className="flex h-full items-center justify-center bg-bg-surface p-6 text-center text-sm text-text-secondary"
    >
      Artwork unavailable
    </div>
  ) : (
    <img
      src={src}
      alt={name}
      width={1200}
      height={900}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.025]"
    />
  );
}
function AwardsSkeleton() {
  return (
    <section aria-label="Loading Awards nominees" aria-busy="true">
      <p role="status" className="mb-6 text-sm text-text-secondary">
        Bringing the nominees into the spotlight…
      </p>
      <div className="mb-8 flex gap-3">
        <div className="h-11 w-32 rounded-lg bg-white/5" />
        <div className="h-11 w-40 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className="overflow-hidden rounded-xl border border-white/10 bg-bg-surface motion-safe:animate-pulse"
          >
            <div className="aspect-[4/3] bg-white/5" />
            <div className="min-h-[300px] space-y-4 p-5 md:p-6">
              <div className="h-6 w-2/3 rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/5" />
              <div className="h-12 rounded bg-white/5" />
              <div className="h-11 rounded-lg bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function ConnectedAwards() {
  const { session, loading, error: authError } = useCustomerSession(),
    [params, setParams] = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]),
    [program, setProgram] = useState<Program | null>(null),
    [section, setSection] = useState(""),
    [votes, setVotes] = useState<any[]>([]),
    [eligible, setEligible] = useState(false),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [pending, setPending] = useState<{
      category: Category;
      nominee: Nominee;
      profile: string;
    } | null>(null),
    [revision, setRevision] = useState(0);
  const retry = useRef<{ payload: string; key: string } | null>(null),
    audience = session?.activeProfileId ?? "guest",
    selected = params.get("program");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoaded(false);
    setError("");
    allPrograms(controller.signal)
      .then((b) => {
        if (active)
          setPrograms(
            b.items.sort(
              (a: Program, b: Program) =>
                ["open", "upcoming", "closed"].indexOf(a.phase) -
                ["open", "upcoming", "closed"].indexOf(b.phase),
            ),
          );
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [revision]);
  const id = selected ?? programs[0]?.id;
  useEffect(() => {
    let active = true;
    setError("");
    setProgram(null);
    setVotes([]);
    setEligible(false);
    setPending(null);
    setNotice("");
    if (!id || loading) return;
    Promise.all([
      publicAwards("/" + id),
      session?.activeProfileId
        ? customerApi("/awards/" + id + "/votes")
        : Promise.resolve(null),
    ])
      .then(([p, own]) => {
        if (!active) return;
        setProgram(p);
        setSection(p.categories[0]?.section ?? "");
        setVotes(own?.votes ?? []);
        setEligible(own?.eligible ?? false);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, audience, loading, revision]);
  async function submit() {
    if (!program || !pending || pending.profile !== audience) return;
    setBusy(true);
    setError("");
    const payload = JSON.stringify([
      program.id,
      pending.category.id,
      pending.nominee.id,
      audience,
    ]);
    if (retry.current?.payload !== payload)
      retry.current = { payload, key: crypto.randomUUID() };
    try {
      const v = await customerApi(
        "/awards/" +
          program.id +
          "/categories/" +
          pending.category.id +
          "/votes",
        "POST",
        { nomineeId: pending.nominee.id },
        {
          "If-Match": '"v0"',
          "Idempotency-Key": retry.current.key,
          "X-Profile-Context": audience,
        },
      );
      setVotes((old) => [
        ...old.filter((x) => x.categoryId !== v.categoryId),
        v,
      ]);
      setNotice("Your vote is in. Thank you for backing Caribbean excellence.");
      setPending(null);
      retry.current = null;
    } catch (e) {
      setError((e as Error).message);
      try {
        const own = await customerApi("/awards/" + program.id + "/votes");
        setVotes(own.votes);
      } catch {
        /* Keep the original error. */
      }
    } finally {
      setBusy(false);
    }
  }
  const sections = [
    ...new Set(program?.categories.map((c) => c.section) ?? []),
  ];
  const ballotLoading = !loaded || (!!id && !program && !error && !authError);
  const totalNominees =
    program?.categories.reduce((sum, c) => sum + c.nominees.length, 0) ?? 0;
  const visibleCategories =
    program?.categories.filter((c) => c.section === section) ?? [];
  const recorded =
    program?.categories.filter((c) => votes.some((v) => v.categoryId === c.id))
      .length ?? 0;
  return (
    <main className="min-h-screen bg-bg-base pb-16 pt-24">
      <div className="mx-auto max-w-[1760px] px-6 md:px-8">
        <section
          aria-label="MGTV Awards spotlight"
          className="relative isolate flex min-h-[680px] overflow-hidden rounded-tl-[40px] rounded-br-[40px] border border-gold/20 bg-bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:min-h-[600px]"
        >
          {program && (
            <HeroBackdrop
              poster={program.artwork.landscapeUrl}
              portraitPoster={program.artwork.portraitUrl}
              featureUrl={program.featureUrl}
            />
          )}
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="pointer-events-none relative z-10 flex w-full flex-col justify-end px-6 py-10 md:px-12 md:py-12 lg:px-16">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              From our islands. Into the spotlight.
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full border border-gold/40 bg-black/50 px-3 py-1.5 text-gold">
                {!program
                  ? "MGTV Awards"
                  : program.results
                    ? "Results released"
                    : program?.phase === "open"
                      ? "Voting is open"
                      : program?.phase === "upcoming"
                        ? "The next celebration"
                        : "Voting closed"}
              </span>
              {program && (
                <span className="text-white/75">{program.year} edition</span>
              )}
            </div>
            <Text
              as="h1"
              className="max-w-3xl font-display text-5xl leading-[0.95] text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {program?.title ?? "MGTV Awards"}
            </Text>
            <Text className="mb-7 mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              {program?.description ??
                "The voices. The vision. The people moving Caribbean culture forward."}
            </Text>
            <div className="pointer-events-auto flex flex-wrap gap-3">
              <a
                href="#awards-ballot"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {program?.results ? "Explore the winners" : "Meet the nominees"}
                <span aria-hidden="true" className="ml-4">
                  ↓
                </span>
              </a>
              <a
                href="#awards-rules"
                className="inline-flex min-h-11 items-center rounded-lg border border-white/30 bg-black/30 px-5 py-3 text-sm font-semibold text-white hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                How voting works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-5 text-xs text-white/70">
              <span>
                <strong className="mr-2 text-lg text-gold">
                  {program?.categories.length ?? "—"}
                </strong>
                categories
              </span>
              <span>
                <strong className="mr-2 text-lg text-gold">
                  {program ? totalNominees : "—"}
                </strong>
                nominees
              </span>
              <span className="self-center">
                {program?.results
                  ? "Chosen by the audience. Released after review."
                  : "One account. One final choice per category."}
              </span>
            </div>
          </div>
        </section>
        <section
          id="awards-rules"
          className="scroll-mt-24 mt-6 rounded-xl border border-white/10 bg-bg-surface/60 px-5 py-5 md:px-7"
        >
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-text-primary">
              Your voice. Their moment.{" "}
              <span className="ml-2 font-normal text-text-secondary">
                The voting guide
              </span>
            </summary>
            <div className="mt-5 grid gap-5 text-sm leading-relaxed text-text-secondary md:grid-cols-3">
              <p>
                <strong className="mb-1 block text-gold">
                  Choose with confidence
                </strong>
                Sign in and select an adult profile. Every account gets one
                final vote per category; switching profiles does not add another
                vote.
              </p>
              <p>
                <strong className="mb-1 block text-gold">Make it count</strong>
                Review your nominee before confirming. Once recorded, your
                choice cannot be changed.
              </p>
              <p>
                <strong className="mb-1 block text-gold">A fair finish</strong>
                Tied nominees share the win. Results stay private until voting
                closes and staff complete their review.
              </p>
            </div>
            {program && (
              <p className="mt-5 border-t border-white/10 pt-4 text-xs text-text-secondary">
                Voting window ·{" "}
                {new Intl.DateTimeFormat("en-JM", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: program.timezone,
                }).format(new Date(program.opensAt))}{" "}
                –{" "}
                {new Intl.DateTimeFormat("en-JM", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: program.timezone,
                }).format(new Date(program.closesAt))}{" "}
                · {program.timezone}
              </p>
            )}
          </details>
        </section>
        <section id="awards-ballot" className="scroll-mt-24 pt-12 md:pt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                The people. The stories. The impact.
              </p>
              <Text as="h2" className="font-display text-4xl md:text-5xl">
                {program?.results
                  ? "A moment for the winners"
                  : "Meet this edition’s nominees"}
              </Text>
            </div>
            {programs.length > 1 && (
              <label className="grid min-w-0 w-full gap-2 text-xs text-text-secondary sm:w-auto">
                Award program
                <select
                  aria-label="Award program"
                  className="min-h-11 w-full max-w-full rounded-lg border border-gold/30 bg-bg-surface px-4 text-sm text-text-primary sm:max-w-sm"
                  value={id ?? ""}
                  disabled={busy}
                  onChange={(e) => setParams({ program: e.target.value })}
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} · {p.year}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {(error || authError) && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-gold/30 bg-bg-surface p-5"
            >
              <p>{error || authError}</p>
              <Button
                className="mt-3"
                variant="outline"
                onClick={() => setRevision((n) => n + 1)}
              >
                Try again
              </Button>
            </div>
          )}
          {ballotLoading && <AwardsSkeleton />}
          {loaded && !programs.length && !error && (
            <div className="rounded-xl border border-white/10 bg-bg-surface p-8">
              <Text as="h3" className="font-display text-3xl">
                The next spotlight is taking shape.
              </Text>
              <p className="mt-3 text-sm text-text-secondary">
                No award programs have been announced yet. Come back for the
                next celebration.
              </p>
            </div>
          )}
          {program && (
            <>
              {program.phase === "open" && !eligible && (
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/30 bg-bg-surface p-5">
                  <div>
                    <p className="font-semibold text-text-primary">
                      Back the voices moving us forward.
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {!session
                        ? "Sign in and choose an adult profile to cast your final choices."
                        : !session.activeProfileId
                          ? "Choose your adult profile to vote."
                          : "Voting is available to adult profiles only."}
                    </p>
                  </div>
                  <ButtonLink
                    to={
                      !session
                        ? "/auth/sign-in?returnTo=%2Fawards"
                        : "/profiles"
                    }
                    variant="outline"
                  >
                    {!session ? "Sign in to vote" : "Choose profile"}
                  </ButtonLink>
                </div>
              )}
              {notice && (
                <p
                  role="status"
                  className="mb-6 rounded-lg border border-gold/30 p-4 text-sm text-gold"
                >
                  {notice}
                </p>
              )}
              {eligible && (
                <p className="mb-6 text-sm text-text-secondary">
                  <span className="font-semibold text-gold">
                    {recorded} of {program.categories.length}
                  </span>{" "}
                  category choices recorded for your account.
                </p>
              )}
              {program.phase === "closed" && !program.results && (
                <p className="mb-8 rounded-xl border border-white/10 bg-bg-surface p-5 text-sm text-text-secondary">
                  The audience has spoken. Voting is closed; results will appear
                  here after review.
                </p>
              )}
              <nav
                aria-label="Awards sections"
                className="mb-10 flex flex-wrap gap-3"
              >
                {sections.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={name === section}
                    onClick={() => setSection(name)}
                    className={`inline-flex min-h-11 items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${name === section ? "border-gold bg-gold text-black" : "border-white/15 bg-bg-surface text-text-primary hover:border-gold/60"}`}
                  >
                    {name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${name === section ? "bg-black/10" : "bg-white/5 text-text-secondary"}`}
                    >
                      {
                        program.categories.filter((c) => c.section === name)
                          .length
                      }
                    </span>
                  </button>
                ))}
              </nav>
              <div className="space-y-14">
                {visibleCategories.map((category) => {
                  const vote = votes.find((v) => v.categoryId === category.id),
                    result = program.results?.categories.find(
                      (c: any) => c.id === category.id,
                    );
                  return (
                    <section
                      key={category.id}
                      aria-labelledby={"award-category-" + category.id}
                    >
                      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <Text
                            as="h3"
                            id={"award-category-" + category.id}
                            className="font-display text-3xl md:text-4xl"
                          >
                            {category.name}
                          </Text>
                          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                            {category.description}
                          </p>
                        </div>
                        {vote && (
                          <span className="rounded-full border border-gold/40 px-3 py-2 text-xs font-medium text-gold">
                            ✓ Your account’s choice is recorded
                          </span>
                        )}
                      </div>
                      {result?.outcome === "no_votes" && (
                        <p className="mb-5 text-sm text-gold">
                          No votes were cast. No winner has been named.
                        </p>
                      )}
                      <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {category.nominees.map((n, index) => {
                          const chosen = vote?.nomineeId === n.id,
                            winner = result?.winnerIds?.includes(n.id),
                            count =
                              result?.nominees.find((v: any) => v.id === n.id)
                                ?.votes ?? 0;
                          return (
                            <article
                              key={n.id}
                              className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-bg-surface ${winner || chosen ? "border-gold shadow-[0_0_0_1px_rgba(201,168,76,0.12)]" : "border-white/10"}`}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface">
                                <AwardsImage src={n.imageUrl} name={n.name} />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                <span className="absolute bottom-4 left-4 text-xs font-semibold tracking-[0.15em] text-white/85">
                                  NOMINEE {String(index + 1).padStart(2, "0")}
                                </span>
                                {(winner || chosen) && (
                                  <span className="absolute right-3 top-3 rounded-full border border-gold/50 bg-black/80 px-3 py-1.5 text-xs font-semibold text-gold">
                                    {winner
                                      ? result.winnerIds.length > 1
                                        ? "Joint winner"
                                        : "Winner"
                                      : "Your choice"}
                                  </span>
                                )}
                              </div>
                              <div className="flex min-h-[300px] flex-1 flex-col p-5 md:p-6">
                                <h4 className="break-words text-xl font-semibold leading-snug text-text-primary">
                                  {n.name}
                                </h4>
                                <p className="mt-2 text-sm text-gold">
                                  {n.subtitle}
                                </p>
                                <p className="mb-6 mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                                  {n.description}
                                </p>
                                <div className="mt-auto border-t border-white/10 pt-4">
                                  {result ? (
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                      <span
                                        className={
                                          winner
                                            ? "font-semibold text-gold"
                                            : "text-text-secondary"
                                        }
                                      >
                                        {winner
                                          ? result.winnerIds.length > 1
                                            ? "Joint winner"
                                            : "Winner"
                                          : "Nominee"}
                                      </span>
                                      <span className="text-text-secondary">
                                        {count} {count === 1 ? "vote" : "votes"}
                                      </span>
                                    </div>
                                  ) : (
                                    <Button
                                      className="min-h-11 w-full"
                                      variant={chosen ? "primary" : "outline"}
                                      disabled={
                                        busy ||
                                        !eligible ||
                                        !!vote ||
                                        program.phase !== "open"
                                      }
                                      onClick={() =>
                                        setPending({
                                          category,
                                          nominee: n,
                                          profile: audience,
                                        })
                                      }
                                    >
                                      {chosen
                                        ? "✓ Your final choice"
                                        : vote
                                          ? "Your account has voted"
                                          : program.phase === "open"
                                            ? "Choose nominee"
                                            : program.phase === "upcoming"
                                              ? "Voting opens soon"
                                              : "Voting closed"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
      {pending && pending.profile === audience && (
        <SessionDialog
          title="Give this moment your voice"
          onClose={() => {
            if (!busy) setPending(null);
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            {pending.category.name}
          </p>
          <div className="my-5 aspect-[4/3] overflow-hidden rounded-lg">
            <AwardsImage
              src={pending.nominee.imageUrl}
              name={pending.nominee.name}
            />
          </div>
          <Text className="mb-3 font-display text-4xl text-text-primary">
            {pending.nominee.name}
          </Text>
          <p className="mb-6 text-sm leading-relaxed text-text-secondary">
            This is your account’s final choice for this category. You cannot
            change it or vote again using another profile.
          </p>
          {error && (
            <p role="alert" className="mb-4 text-gold">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} onClick={() => void submit()}>
              {busy ? "Recording your choice…" : "Confirm final vote"}
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setPending(null)}
            >
              Keep looking
            </Button>
          </div>
        </SessionDialog>
      )}
    </main>
  );
}
