import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "@/components/shared/SessionDialog"
import { AccessGate } from "@/components/shared/AccessGate"
import { ProfileForm } from "@/components/shared/ProfileForm"
import {
  MAX_PROFILES,
  avatarStyles,
  newProfile,
  safeReturnTo,
  type Profile,
} from "@/lib/appState"

export function ProfilesPage() {
  const app = useAppState()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [selected, setSelected] = useState(app.profile?.id ?? "")
  const [draft, setDraft] = useState<Profile | null>(null)
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<Profile | null>(null)
  if (app.state.session !== "signedIn") return <AccessGate />
  const adult = app.profile?.type === "adult"
  const target = app.state.profiles.find((p) => p.id === selected)
  const needsPin =
    app.profile &&
    app.profile.type !== "adult" &&
    target?.type === "adult" &&
    target.controls.requirePin
  const close = () => {
    setDraft(null)
    setDeleting(null)
    setPin("")
    setError("")
  }
  return (
    <main className="min-h-screen bg-bg-base px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
          MGTV profiles
        </Text>
        <Text as="h1" className="mb-3 font-display text-5xl md:text-7xl">
          Who's watching?
        </Text>
        <Text className="mb-12 text-sm text-text-secondary">
          One account. A personal experience for every profile.
        </Text>
        <div className="mb-10 flex flex-wrap justify-center gap-6">
          {app.state.profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex w-28 flex-col items-center gap-2"
            >
              <Button
                variant="ghost"
                className={`h-28 w-28 rounded-xl font-display text-5xl ${avatarStyles[profile.avatar]} ${
                  selected === profile.id
                    ? "ring-2 ring-gold ring-offset-4 ring-offset-bg-base"
                    : ""
                }`}
                aria-label={`Select ${profile.name}, ${profile.type}`}
                aria-pressed={selected === profile.id}
                onClick={() => {
                  setSelected(profile.id)
                  setError("")
                  setPin("")
                }}
              >
                {profile.name[0].toUpperCase()}
              </Button>
              <Text className="mt-2 font-semibold">{profile.name}</Text>
              <Text className="text-xs text-text-secondary">
                {profile.type}
                {profile.isMain ? " · Main" : ""}
              </Text>
              {adult && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDraft(profile)}
                  aria-label={`Edit ${profile.name}`}
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
        {needsPin && (
          <div className="mx-auto mb-5 max-w-xs text-left">
            <Text
              as="label"
              htmlFor="switch-pin"
              className="mb-2 block text-sm"
            >
              Adult profile demo PIN
            </Text>
            <Input
              id="switch-pin"
              inputMode="numeric"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              aria-describedby="switch-help"
            />
            <Text id="switch-help" className="mt-2 text-xs text-text-secondary">
              Demo only: 1234. This is not secure protection.
            </Text>
          </div>
        )}
        {error && (
          <Text role="alert" className="mb-4 text-sm text-rose-300">
            {error}
          </Text>
        )}
        {target && (
          <Button
            size="lg"
            onClick={() => {
              const result = app.execute(
                { type: "select", id: target.id, pin },
                true,
              )
              if (result.ok) navigate(safeReturnTo(params.get("returnTo")))
              else setError(result.reason)
            }}
          >
            Continue as {target.name}
          </Button>
        )}
        {(adult || !app.state.profiles.length) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {app.state.profiles.length < MAX_PROFILES ? (
              <>
                <ButtonLink to="/profiles/create" variant="outline">
                  Guided profile setup
                </ButtonLink>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setDraft(
                      newProfile(crypto.randomUUID(), "", "adult", "blue"),
                    )
                  }
                >
                  Quick add
                </Button>
              </>
            ) : (
              <Text role="status" className="text-sm text-text-secondary">
                All five profile slots are in use. Delete a non-main profile to
                add another.
              </Text>
            )}
          </div>
        )}
        <Text className="mt-8 text-xs text-text-secondary">
          {app.state.profiles.length} of {MAX_PROFILES} profiles · Demo limit:
          five total, awaiting product confirmation.
        </Text>
        <Text className="mt-3 text-xs text-text-secondary">
          Saved items, preferences, notifications and viewing history are
          separate for each profile.
        </Text>
        {adult && (
          <ButtonLink to="/parental-controls" variant="ghost" className="mt-4">
            Manage parental controls
          </ButtonLink>
        )}
      </div>
      {draft && (
        <SessionDialog
          title={
            app.state.profiles.some((p) => p.id === draft.id)
              ? `Edit ${draft.name}`
              : "Quick add profile"
          }
          onClose={close}
        >
          <ProfileForm
            initial={draft}
            adultOnly={!app.state.profiles.length}
            editing={app.state.profiles.some((p) => p.id === draft.id)}
            onCancel={close}
            onSave={(profile, enteredPin) => {
              const result = app.execute(
                app.state.profiles.some((p) => p.id === profile.id)
                  ? { type: "edit", profile, pin: enteredPin }
                  : { type: "create", profile },
                true,
              )
              if (result.ok) {
                setSelected(profile.id)
                close()
                return
              }
              return result.reason
            }}
          />
          {app.state.profiles.some((p) => p.id === draft.id) &&
            !draft.isMain && (
              <Button
                variant="ghost"
                className="mt-6 text-rose-300"
                onClick={() => {
                  setDeleting(draft)
                  setDraft(null)
                }}
              >
                Delete profile…
              </Button>
            )}
        </SessionDialog>
      )}
      {deleting && (
        <SessionDialog title={`Delete ${deleting.name}?`} onClose={close}>
          <Text className="mb-5 text-sm text-text-secondary">
            This removes this profile's saved items, preferences, playlists,
            notifications and viewing history from this demo.
          </Text>
          {deleting.controls.requirePin && (
            <>
              <Text
                as="label"
                htmlFor="delete-pin"
                className="mb-2 block text-sm"
              >
                Demo PIN (1234)
              </Text>
              <Input
                id="delete-pin"
                inputMode="numeric"
                type="password"
                value={pin}
                maxLength={4}
                onChange={(event) => setPin(event.target.value)}
              />
            </>
          )}
          {error && (
            <Text role="alert" className="mt-3 text-rose-300">
              {error}
            </Text>
          )}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => {
                const result = app.execute(
                  { type: "delete", id: deleting.id, pin },
                  true,
                )
                if (result.ok) {
                  setSelected("")
                  close()
                } else setError(result.reason)
              }}
            >
              Confirm deletion
            </Button>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
          </div>
        </SessionDialog>
      )}
    </main>
  )
}
