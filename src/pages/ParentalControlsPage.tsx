import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { Toggle } from "@/components/ui/Toggle"
import { AccessGate } from "@/components/shared/AccessGate"
import { ceiling, type Profile } from "@/lib/appState"
const ratings = ["G / TV-G", "PG / TV-PG", "PG-13", "TV-14", "R / TV-MA"]
export function ParentalControlsPage() {
  const app = useAppState()
  const [target, setTarget] = useState(app.profile?.id ?? "p1")
  const profile = app.state.profiles.find((p) => p.id === target)
  if (!app.profile) return <AccessGate />
  if (app.profile.type !== "adult")
    return (
      <AccessGate
        reason={`Your ${app.profile.type} profile allows content up to ${ratings[Math.min(ceiling(app.profile.type), app.profile.controls.maxRating)]}. Only an adult can change controls.`}
      />
    )
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <ButtonLink to="/account" variant="ghost" className="mb-6">
        Back to account
      </ButtonLink>
      <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
        Family viewing
      </Text>
      <Text as="h1" className="mb-3 font-display text-5xl">
        Parental controls
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        Choose a profile. Restrictions affect discovery and every playback entry
        point. Ratings, limits and PIN protection are provisional demo rules,
        not secure parental protection.
      </Text>
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Profile to manage">
        {app.state.profiles.map((p) => (
          <Button
            key={p.id}
            variant={target === p.id ? "primary" : "outline"}
            onClick={() => setTarget(p.id)}
            aria-pressed={target === p.id}
          >
            {p.name} · {p.type}
          </Button>
        ))}
      </div>
      {profile && <ControlForm key={profile.id} profile={profile} />}
    </main>
  )
}
function ControlForm({ profile }: { profile: Profile }) {
  const app = useAppState()
  const [draft, setDraft] = useState(profile.controls)
  const [pin, setPin] = useState("")
  const [message, setMessage] = useState("")
  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        const result = app.execute(
          { type: "controls", id: profile.id, controls: draft, pin },
          true,
        )
        setMessage(
          result.ok
            ? "Settings saved. Browsing and playback now use these controls."
            : result.reason,
        )
        if (result.ok) setPin("")
      }}
    >
      <fieldset className="rounded-xl bg-bg-surface p-6">
        <legend className="font-display text-2xl">Content rating limit</legend>
        <div className="grid gap-2">
          {ratings.map((rating, index) => (
            <Button
              key={rating}
              variant={draft.maxRating === index ? "primary" : "ghost"}
              className="justify-start"
              aria-pressed={draft.maxRating === index}
              disabled={index > ceiling(profile.type)}
              onClick={() => setDraft({ ...draft, maxRating: index })}
            >
              {rating}
            </Button>
          ))}
        </div>
        <Text className="mt-4 text-xs text-text-secondary">
          Restricted items are hidden. Unrated items are blocked for teen and
          child profiles.
        </Text>
      </fieldset>
      <div className="rounded-xl bg-bg-surface p-6">
        <Toggle
          label="Require PIN for parental changes and adult profile switching"
          checked={draft.requirePin}
          onChange={() => setDraft({ ...draft, requirePin: !draft.requirePin })}
        />
        <Toggle
          label="Daily video viewing limit"
          checked={draft.dailyLimit > 0}
          onChange={() =>
            setDraft({ ...draft, dailyLimit: draft.dailyLimit ? 0 : 7200 })
          }
          description="Only time spent playing a simulated video counts, including live demos. Audio, seeking and buffering do not count."
        />
        {draft.dailyLimit > 0 && (
          <div className="mt-5">
            <Text
              as="label"
              htmlFor="daily-hours"
              className="mb-2 block text-sm"
            >
              Daily hours (1–8)
            </Text>
            <Input
              id="daily-hours"
              type="number"
              min={1}
              max={8}
              value={draft.dailyLimit / 3600}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  dailyLimit:
                    Math.max(1, Math.min(8, Number(event.target.value))) * 3600,
                })
              }
            />
          </div>
        )}
        <Text className="mt-3 text-xs text-text-secondary">
          Fixed demo day: September 10, 2026 · Used:{" "}
          {Math.floor(app.state.profileData[profile.id].usedSeconds / 60)}{" "}
          minutes.
        </Text>
        <Toggle
          label="Require PIN for mock purchase actions"
          checked={draft.purchasePin}
          onChange={() =>
            setDraft({ ...draft, purchasePin: !draft.purchasePin })
          }
          description="No payment, upgrade or checkout will take place."
        />
      </div>
      {profile.controls.requirePin && (
        <div>
          <Text as="label" htmlFor="parent-pin" className="mb-2 block text-sm">
            Current demo PIN
          </Text>
          <Input
            id="parent-pin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            aria-describedby="pin-help"
          />
          <Text id="pin-help" className="mt-2 text-xs text-text-secondary">
            Use 1234. This is a visible prototype PIN, not a real security
            control.
          </Text>
        </div>
      )}
      {message && (
        <Text role="status" className="text-sm text-gold">
          {message}
        </Text>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit">Save controls</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setDraft(profile.controls)
            setPin("")
            setMessage("Unsaved changes discarded.")
          }}
        >
          Cancel changes
        </Button>
      </div>
    </form>
  )
}
