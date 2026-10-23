import { useEffect, useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { awardCategories } from "@/data/mockAwards"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "@/components/shared/SessionDialog"
export function AwardsPage() {
  const app = useAppState()
  const [section, setSection] = useState("Music")
  const [pending, setPending] = useState<{
    category: string
    id: string
    name: string
    profileId: string
    revision: number
  } | null>(null)
  const [message, setMessage] = useState("")
  const adult = app.profile?.type === "adult"
  const eligibility = !app.profile
    ? "Sign in and choose an adult profile to try mock voting."
    : !adult
      ? "Mock voting is available to adult profiles only."
      : undefined
  const phase = app.state.phase
  useEffect(
    () => setPending(null),
    [app.profile?.id, app.state.session, app.state.revision, phase],
  )
  const validPending =
    pending &&
    adult &&
    app.profile?.id === pending.profileId &&
    app.state.revision === pending.revision &&
    phase === "open" &&
    !app.state.votes[pending.category]
  return (
    <main className="min-h-screen">
      <section className="border-b border-gold/20 bg-gradient-to-b from-gold-dim/50 to-bg-base px-6 py-20 text-center">
        <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
          Celebrating Caribbean excellence
        </Text>
        <Text
          as="h1"
          className="font-display text-7xl leading-none md:text-9xl"
        >
          MGTV Awards
          <br />
          <Text as="span" className="text-gold">
            2026
          </Text>
        </Text>
        <Text className="mx-auto mb-6 mt-6 max-w-lg text-text-secondary">
          Music. Culture. Sport. Explore the nominees and demonstrate your
          choice.
        </Text>
        <Text role="status" className="font-semibold text-gold">
          {phase === "open"
            ? "Mock voting open"
            : phase === "closed"
              ? "Mock voting closed"
              : "Results have not been released"}
        </Text>
        <Text className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">
          Mock voting — no real submissions. Adult profiles only; one
          non-editable vote per account/category. Provisional rules awaiting
          product confirmation.
        </Text>
      </section>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        {eligibility && (
          <div className="mb-10 rounded-xl border border-gold/30 bg-bg-surface p-5">
            <Text role="status" className="text-sm">
              {eligibility}
            </Text>
            {!app.profile && (
              <ButtonLink
                to="/auth/sign-in?returnTo=%2Fawards"
                variant="outline"
                className="mt-4"
              >
                Demo sign in
              </ButtonLink>
            )}
          </div>
        )}
        {phase === "resultsPending" && (
          <Text className="mb-8 text-sm text-text-secondary">
            Voting is closed. No winners, totals or rankings are published. Your
            previous demo choices are shown separately below.
          </Text>
        )}
        {message && (
          <Text role="status" className="mb-6 text-gold">
            {message}
          </Text>
        )}
        <div className="mb-12 flex gap-3" aria-label="Awards sections">
          {["Music", "Sports"].map((value) => (
            <Button
              key={value}
              variant={section === value ? "primary" : "outline"}
              aria-pressed={section === value}
              onClick={() => setSection(value)}
            >
              {value}
            </Button>
          ))}
        </div>
        <div className="space-y-14">
          {awardCategories
            .filter((c) => c.section === section)
            .map((category) => {
              const vote = app.state.votes[category.id]
              return (
                <section key={category.id}>
                  <div className="mb-5 flex flex-wrap items-center gap-4">
                    <Text as="h2" className="font-display text-3xl md:text-4xl">
                      {category.title}
                    </Text>
                    {vote && adult && (
                      <Text className="text-xs text-gold">
                        Already voted · This account chose {vote.nomineeName}
                      </Text>
                    )}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {category.nominees.map((nominee) => {
                      const selected = adult && vote?.nomineeId === nominee.id
                      return (
                        <article
                          key={nominee.id}
                          className={`overflow-hidden rounded-xl border bg-bg-surface ${
                            selected ? "border-gold" : "border-text-muted/20"
                          }`}
                        >
                          <img
                            src={nominee.image}
                            alt={nominee.name}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="p-5">
                            <Text as="h3" className="text-lg font-semibold">
                              {nominee.name}
                            </Text>
                            <Text className="mb-5 mt-2 text-xs text-text-secondary">
                              {nominee.description}
                            </Text>
                            {category.section === "Music" && (
                              <ButtonLink
                                to={`/music/artist/${nominee.id}`}
                                variant="ghost"
                                size="sm"
                                className="mb-3"
                              >
                                Explore artist
                              </ButtonLink>
                            )}
                            <Button
                              className="w-full"
                              variant={selected ? "primary" : "outline"}
                              disabled={!adult || !!vote || phase !== "open"}
                              onClick={() =>
                                setPending({
                                  category: category.id,
                                  id: nominee.id,
                                  name: nominee.name,
                                  profileId: app.profile!.id,
                                  revision: app.state.revision,
                                })
                              }
                            >
                              {selected
                                ? "Your mock vote"
                                : vote && adult
                                  ? "Account already voted"
                                  : phase === "open"
                                    ? "Choose nominee"
                                    : "Voting closed"}
                            </Button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
        </div>
      </div>
      {validPending && (
        <SessionDialog
          title="Confirm mock vote"
          onClose={() => setPending(null)}
        >
          <Text className="text-sm text-text-secondary">
            {awardCategories.find((c) => c.id === pending.category)?.title}
          </Text>
          <Text className="my-5 font-display text-4xl text-gold">
            {pending.name}
          </Text>
          <Text className="mb-6 text-sm leading-relaxed text-text-secondary">
            No real vote will be submitted. This account gets one non-editable
            demo choice per category, shared across adult profiles.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                const result = app.execute(
                  {
                    type: "vote",
                    category: pending.category,
                    nomineeId: pending.id,
                    nomineeName: pending.name,
                  },
                  true,
                )
                setMessage(
                  result.ok
                    ? "Mock vote recorded for this demo session. No real submission."
                    : result.reason,
                )
                setPending(null)
              }}
            >
              Confirm mock vote
            </Button>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
          </div>
        </SessionDialog>
      )}
    </main>
  )
}
