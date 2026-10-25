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
  artwork: { landscapeUrl: string };
  phase: string;
  votePolicy: string;
  categories: Category[];
  results: any;
};
async function publicAwards(path = "", signal?:AbortSignal) {
  const r = await fetch("/api/v1/catalog/awards" + path,{signal});
  const b = await r.json();
  if (!r.ok) throw Error(b.message ?? "Awards could not load.");
  return b;
}
async function allPrograms(signal:AbortSignal){const items:Program[]=[];let cursor:string|null=null;do{const page=await publicAwards("?limit=50"+(cursor?"&cursor="+encodeURIComponent(cursor):""),signal);items.push(...page.items);cursor=page.nextCursor;}while(cursor);return {items};}
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
    let active = true;const controller=new AbortController();
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
      active = false;controller.abort();
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
  return (
    <main className="min-h-screen">
      <section className="relative isolate overflow-hidden border-b border-gold/20 bg-gradient-to-b from-gold-dim/50 to-bg-base px-6 py-20 text-center">
        {program && (
          <HeroBackdrop
            poster={program.artwork.landscapeUrl}
            featureUrl={program.featureUrl}
          />
        )}
        <div className="relative z-10 pointer-events-none">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Celebrating Caribbean excellence
          </Text>
          <Text
            as="h1"
            className="font-display text-6xl leading-none md:text-8xl"
          >
            {program?.title ?? "MGTV Awards"}
            <br />
            <span className="text-gold">{program?.year}</span>
          </Text>
          <Text className="mx-auto mb-6 mt-6 max-w-lg text-text-secondary">
            {program?.description ??
              "The voices. The vision. The people moving us forward."}
          </Text>
          {program && (
            <>
              <Text className="font-semibold text-gold">
                {program.results
                  ? "The results are in"
                  : program.phase === "open"
                    ? "Your voice. Their moment."
                    : program.phase === "upcoming"
                      ? "The next moment is coming"
                      : "Voting has closed"}
              </Text>
              <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
                One final vote per account in each category. Adult profiles
                only. Tied nominees share the win. Results follow staff review.
              </p>
              <p className="mt-3 text-xs text-text-secondary">
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
            </>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        {(error || authError) && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-gold/30 p-5"
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
        {!loaded && (
          <p role="status">Bringing the nominees into the spotlight…</p>
        )}
        {loaded && !programs.length && !error && (
          <p>
            No award programs have been announced yet. Come back for the next
            celebration.
          </p>
        )}
        {programs.length > 1 && (
          <label className="mb-8 block text-sm text-text-secondary">
            Award program
            <select
              aria-label="Award program"
              className="ml-3 max-w-full rounded-lg border border-gold/30 bg-bg-surface p-3 text-text-primary"
              value={id ?? ""}
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
        {program && program.phase === "open" && !eligible && (
          <div className="mb-10 rounded-xl border border-gold/30 bg-bg-surface p-5">
            <p>
              {!session
                ? "Sign in and choose an adult profile to make your vote count."
                : !session.activeProfileId
                  ? "Choose your adult profile to vote."
                  : "Voting is available to adult profiles only."}
            </p>
            <ButtonLink
              to={!session ? "/auth/sign-in?returnTo=%2Fawards" : "/profiles"}
              variant="outline"
              className="mt-4"
            >
              {!session ? "Sign in to vote" : "Choose profile"}
            </ButtonLink>
          </div>
        )}
        {notice && (
          <p role="status" className="mb-6 text-gold">
            {notice}
          </p>
        )}
        {program?.phase === "closed" && !program.results && (
          <p className="mb-8 text-sm text-text-secondary">
            Voting is closed. Results will appear here after review.
          </p>
        )}
        <div
          className="mb-12 flex flex-wrap gap-3"
          aria-label="Awards sections"
        >
          {sections.map((s) => (
            <Button
              key={s}
              variant={s === section ? "primary" : "outline"}
              aria-pressed={s === section}
              onClick={() => setSection(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="space-y-14">
          {program?.categories
            .filter((c) => c.section === section)
            .map((category) => {
              const vote = votes.find((v) => v.categoryId === category.id),
                result = program.results?.categories.find(
                  (c: any) => c.id === category.id,
                );
              return (
                <section key={category.id}>
                  <div className="mb-5 flex flex-wrap items-center gap-4">
                    <Text as="h2" className="font-display text-3xl md:text-4xl">
                      {category.name}
                    </Text>
                    {vote && (
                      <span className="text-xs text-gold">
                        Your account’s vote is recorded
                      </span>
                    )}
                  </div>
                  <p className="mb-5 text-sm text-text-secondary">
                    {category.description}
                  </p>
                  {result?.outcome === "no_votes" && (
                    <p className="mb-5 text-gold">
                      No votes were cast. No winner has been named.
                    </p>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {category.nominees.map((n) => {
                      const chosen = vote?.nomineeId === n.id,
                        winner = result?.winnerIds.includes(n.id);
                      return (
                        <article
                          key={n.id}
                          className={`overflow-hidden rounded-xl border bg-bg-surface ${chosen || winner ? "border-gold" : "border-text-muted/20"}`}
                        >
                          <img
                            src={n.imageUrl}
                            alt={n.name}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="p-5">
                            <Text as="h3" className="text-lg font-semibold">
                              {n.name}
                            </Text>
                            <p className="mt-1 text-sm text-gold">
                              {n.subtitle}
                            </p>
                            <p className="mb-5 mt-2 text-xs text-text-secondary">
                              {n.description}
                            </p>
                            {result ? (
                              <p className="text-gold">
                                {winner
                                  ? result.winnerIds.length > 1
                                    ? "Joint winner"
                                    : "Winner"
                                  : "Nominee"}{" "}
                                ·{" "}
                                {result.nominees.find((v: any) => v.id === n.id)
                                  ?.votes ?? 0}{" "}
                                {(result.nominees.find(
                                  (v: any) => v.id === n.id,
                                )?.votes ?? 0) === 1
                                  ? "vote"
                                  : "votes"}
                              </p>
                            ) : (
                              <Button
                                className="w-full"
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
                                  ? "Your vote"
                                  : vote
                                    ? "Account already voted"
                                    : program.phase === "open"
                                      ? "Choose nominee"
                                      : program.phase === "upcoming"
                                        ? "Voting opens soon"
                                        : "Voting closed"}
                              </Button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
      {pending && pending.profile === audience && (
        <SessionDialog
          title="Make your vote count"
          onClose={() => {
            if (!busy) setPending(null);
          }}
        >
          <p className="text-sm text-text-secondary">{pending.category.name}</p>
          <Text className="my-5 font-display text-4xl text-gold">
            {pending.nominee.name}
          </Text>
          <p className="mb-6 text-sm text-text-secondary">
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
              {busy ? "Recording vote…" : "Confirm final vote"}
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
