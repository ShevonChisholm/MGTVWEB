import { useState } from "react"
import { useNavigate } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { ProfileForm } from "@/components/shared/ProfileForm"
import { AccessGate } from "@/components/shared/AccessGate"
import { newProfile, MAX_PROFILES, type Profile } from "@/lib/appState"
const genres = [
  "Reggae",
  "Dancehall",
  "Soca",
  "Gospel",
  "Drama",
  "Comedy",
  "Documentary",
  "Sports",
  "Culture",
  "News",
]
const regions = [
  "Jamaica",
  "Trinidad & Tobago",
  "Barbados",
  "Guyana",
  "Saint Lucia",
]
export function CreateProfilePage() {
  const app = useAppState()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Profile>(() =>
    newProfile(crypto.randomUUID(), "", "adult"),
  )
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  if (
    app.state.session !== "signedIn" ||
    (app.state.profiles.length > 0 && app.profile?.type !== "adult")
  )
    return (
      <AccessGate reason="An adult profile is required to add a profile." />
    )
  if (app.state.profiles.length >= MAX_PROFILES)
    return (
      <AccessGate reason="The five-total-profile demo limit has been reached. Manage profiles to free a slot." />
    )
  const preferences = draft.preferences
  const pick = (field: "genres" | "regions", value: string) =>
    setDraft({
      ...draft,
      preferences: {
        ...preferences,
        [field]: preferences[field].includes(value)
          ? preferences[field].filter((v) => v !== value)
          : [...preferences[field], value],
      },
    })
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-xl">
        <ButtonLink to="/profiles" variant="ghost" className="mb-8">
          Back to profiles
        </ButtonLink>
        <Text className="mb-5 text-xs uppercase tracking-widest text-gold">
          Profile setup · Step {step} of 3
        </Text>
        <Text as="h1" className="mb-3 font-display text-5xl">
          {step === 1
            ? "Create your profile"
            : step === 2
              ? "Choose your interests"
              : "Ready to make it yours?"}
        </Text>
        <Text className="mb-8 text-sm text-text-secondary">
          Personal preferences, saved items and viewing activity. Local demo
          only.
        </Text>
        {step === 1 && (
          <ProfileForm
            initial={draft}
            adultOnly={!app.state.profiles.length}
            onCancel={() => navigate("/profiles")}
            onSave={(profile) => {
              setDraft(profile)
              setStep(2)
              return undefined
            }}
          />
        )}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <Text
                as="label"
                htmlFor="new-language"
                className="mb-2 block text-sm"
              >
                Preferred language
              </Text>
              <Input
                id="new-language"
                value={preferences.language}
                maxLength={40}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    preferences: {
                      ...preferences,
                      language: event.target.value,
                    },
                  })
                }
              />
              <Text className="mt-2 text-xs text-text-secondary">
                Preference only; interface translation is not connected.
              </Text>
            </div>
            {(["genres", "regions"] as const).map((field) => (
              <fieldset key={field}>
                <legend className="mb-3 text-sm capitalize text-gold">
                  Favourite {field}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(field === "genres" ? genres : regions).map((value) => (
                    <Button
                      key={value}
                      variant={
                        preferences[field].includes(value)
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      aria-pressed={preferences[field].includes(value)}
                      onClick={() => pick(field, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Review profile</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-xl bg-bg-surface p-6">
              <Text as="h2" className="font-display text-3xl">
                {draft.name}
              </Text>
              <Text className="mt-3 text-sm text-text-secondary">
                {draft.type} · {preferences.language || "English"}
              </Text>
              <Text className="mt-3 text-sm">
                {preferences.genres.join(" · ") || "All genres"}
                <br />
                {preferences.regions.join(" · ") || "Across the Caribbean"}
              </Text>
            </div>
            {error && (
              <Text role="alert" className="text-rose-300">
                {error}
              </Text>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const result = app.execute(
                    { type: "create", profile: draft },
                    true,
                  )
                  if (!result.ok) {
                    setError(result.reason)
                    return
                  }
                  app.execute({ type: "select", id: draft.id })
                  navigate("/")
                }}
              >
                Create profile & start watching
              </Button>
              <Button variant="ghost" onClick={() => setStep(2)}>
                Edit preferences
              </Button>
            </div>
            <Text className="text-xs text-text-secondary">
              Five total profiles is a provisional demo limit awaiting product
              confirmation.
            </Text>
          </div>
        )}
      </div>
    </main>
  )
}
