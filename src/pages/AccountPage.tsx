import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { Toggle } from "@/components/ui/Toggle"
import { AccessGate } from "@/components/shared/AccessGate"
import { avatarStyles } from "@/lib/appState"
const tabs = [
  "Overview",
  "Personal info",
  "Profile preferences",
  "Notifications",
  "Subscription",
  "Security",
]
export function AccountPage() {
  const app = useAppState()
  const [tab, setTab] = useState("Overview")
  if (!app.profile) return <AccessGate />
  const profile = app.profile
  const adult = profile.type === "adult"
  return (
    <main className="min-h-screen px-6 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center gap-5">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-xl font-display text-4xl ${avatarStyles[profile.avatar]}`}
          >
            {profile.name[0]}
          </div>
          <div>
            <Text className="mb-1 text-xs uppercase tracking-widest text-gold">
              Your MGTV
            </Text>
            <Text as="h1" className="font-display text-5xl">
              {profile.name}
            </Text>
            <Text className="mt-2 text-sm text-text-secondary">
              {profile.type} profile ·{" "}
              {adult ? app.state.account.email : "Personal viewing profile"}
            </Text>
          </div>
          <ButtonLink to="/profiles" variant="outline" className="md:ml-auto">
            Switch profile
          </ButtonLink>
        </div>
        <div
          className="mb-10 flex overflow-x-auto border-b border-text-muted/30"
          aria-label="Account sections"
        >
          {tabs
            .filter(
              (t) =>
                adult ||
                !["Personal info", "Subscription", "Security"].includes(t),
            )
            .map((value) => (
              <Button
                key={value}
                variant="ghost"
                className={`shrink-0 rounded-none border-b-2 ${
                  tab === value ? "border-gold text-gold" : "border-transparent"
                }`}
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
              >
                {value}
              </Button>
            ))}
        </div>
        {tab === "Overview" && (
          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Account & profile">
              <Text className="text-sm text-text-secondary">
                {adult ? app.state.account.name : profile.name}
                <br />
                {profile.preferences.language} · Autoplay{" "}
                {profile.preferences.autoplay ? "on" : "off"}
              </Text>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setTab("Profile preferences")}
              >
                Edit profile preferences
              </Button>
            </Panel>
            <Panel title="Profiles">
              <Text className="text-sm text-text-secondary">
                {app.state.profiles.length} of 5 total demo profiles.
                Five-profile limit awaits product confirmation.
              </Text>
              <ButtonLink to="/profiles" variant="outline" className="mt-5">
                Manage profiles
              </ButtonLink>
            </Panel>
            <Panel title="Your viewing">
              <Text className="text-sm text-text-secondary">
                {Object.keys(app.data.viewing).length} items in this profile's
                demo progress · {app.data.saved.length} saved items.
              </Text>
              <ButtonLink to="/my-list" variant="ghost" className="mt-4">
                Open My List
              </ButtonLink>
            </Panel>
            <Panel title="Content controls">
              <Text className="text-sm text-text-secondary">
                Profile-specific content and viewing limits.
              </Text>
              <ButtonLink
                to="/parental-controls"
                variant="outline"
                className="mt-5"
              >
                {adult ? "Manage controls" : "View restrictions"}
              </ButtonLink>
            </Panel>
          </div>
        )}
        {tab === "Personal info" && adult && <PersonalInfo />}
        {tab === "Profile preferences" && (
          <ProfilePreferences key={profile.id} />
        )}
        {tab === "Notifications" && (
          <Panel title={`${profile.name}'s in-app notifications`}>
            <Text className="mb-5 text-sm text-text-secondary">
              These preferences affect the notification panel, full feed and
              unread count. No real-time delivery is connected.
            </Text>
            {Object.entries(profile.preferences.notifications).map(
              ([key, value]) => (
                <Toggle
                  key={key}
                  label={key}
                  checked={value}
                  onChange={() =>
                    app.execute({
                      type: "preferences",
                      preferences: {
                        ...profile.preferences,
                        notifications: {
                          ...profile.preferences.notifications,
                          [key]: !value,
                        },
                      },
                    })
                  }
                />
              ),
            )}
            <ButtonLink to="/notifications" variant="outline" className="mt-6">
              View notifications
            </ButtonLink>
          </Panel>
        )}
        {tab === "Subscription" && adult && (
          <Panel title="MGTV+ demo account">
            <Text className="text-gold">Annual · Sample plan</Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              Billing, renewals, payments, upgrades and cancellations are not
              connected. Displayed plans are illustrative and do not create a
              subscription.
            </Text>
            <ButtonLink to="/mgtv-plus" variant="outline" className="mt-6">
              Explore sample plans
            </ButtonLink>
          </Panel>
        )}
        {tab === "Security" && adult && (
          <Panel title="Simulated account security">
            <Text className="text-sm leading-relaxed text-text-secondary">
              This is not real authentication. Password changes, device
              management and email delivery are not connected. Do not enter a
              real password or PIN.
            </Text>
            <Text className="mt-4 text-sm text-gold">
              Demo parental PIN: {app.state.account.pin}
            </Text>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() =>
                app.execute({ type: "scenario", session: "guest" })
              }
            >
              Sign out of demo
            </Button>
          </Panel>
        )}
        <Text className="mt-10 text-xs text-text-secondary">
          Shared while you browse this app session. Reload clears all demo
          changes.
        </Text>
      </div>
    </main>
  )
}
function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-text-muted/20 bg-bg-surface p-6">
      <Text as="h2" className="mb-5 font-display text-2xl">
        {title}
      </Text>
      {children}
    </section>
  )
}
function PersonalInfo() {
  const app = useAppState()
  const [draft, setDraft] = useState(app.state.account)
  const [message, setMessage] = useState("")
  return (
    <Panel title="Account information">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const result = app.execute({ type: "account", account: draft }, true)
          setMessage(
            result.ok
              ? "Account information saved for this demo session."
              : result.reason,
          )
        }}
        className="max-w-lg space-y-5"
      >
        {(["name", "email", "country"] as const).map((key) => (
          <div key={key}>
            <Text
              as="label"
              htmlFor={`account-${key}`}
              className="mb-2 block text-sm capitalize"
            >
              {key}
            </Text>
            <Input
              id={`account-${key}`}
              type={key === "email" ? "email" : "text"}
              required
              maxLength={100}
              value={draft[key]}
              className="w-full"
              onChange={(event) =>
                setDraft({ ...draft, [key]: event.target.value })
              }
            />
          </div>
        ))}
        <Toggle
          label="Account communications preference"
          description="Saved preference only. No email will be sent."
          checked={draft.communications}
          onChange={() =>
            setDraft({ ...draft, communications: !draft.communications })
          }
        />
        {message && (
          <Text role="status" className="text-sm text-gold">
            {message}
          </Text>
        )}
        <div className="flex gap-3">
          <Button type="submit">Save changes</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(app.state.account)
              setMessage("Unsaved changes discarded.")
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  )
}
function ProfilePreferences() {
  const app = useAppState()
  const profile = app.profile!
  const [draft, setDraft] = useState(profile.preferences)
  const [message, setMessage] = useState("")
  return (
    <Panel title={`${profile.name}'s preferences`}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          app.execute({ type: "preferences", preferences: draft })
          setMessage("Profile preferences saved.")
        }}
        className="max-w-xl space-y-5"
      >
        <Text className="text-sm text-text-secondary">
          Interests reorder recommendations; they never override content
          restrictions.
        </Text>
        <div>
          <Text
            as="label"
            htmlFor="preference-language"
            className="mb-2 block text-sm"
          >
            Preferred language
          </Text>
          <Input
            id="preference-language"
            value={draft.language}
            required
            maxLength={40}
            onChange={(event) =>
              setDraft({ ...draft, language: event.target.value })
            }
          />
          <Text className="mt-2 text-xs text-text-secondary">
            Preference only. Interface translation is not connected.
          </Text>
        </div>
        {(["genres", "regions"] as const).map((field) => (
          <fieldset key={field}>
            <legend className="mb-3 text-sm capitalize text-gold">
              Favourite {field}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(field === "genres"
                ? [
                    "Drama",
                    "Comedy",
                    "Documentary",
                    "Reggae",
                    "Dancehall",
                    "Soca",
                    "Sports",
                    "Culture",
                  ]
                : ["Jamaica", "Trinidad & Tobago", "Barbados"]
              ).map((value) => (
                <Button
                  key={value}
                  variant={draft[field].includes(value) ? "primary" : "outline"}
                  size="sm"
                  aria-pressed={draft[field].includes(value)}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      [field]: draft[field].includes(value)
                        ? draft[field].filter((v) => v !== value)
                        : [...draft[field], value],
                    })
                  }
                >
                  {value}
                </Button>
              ))}
            </div>
          </fieldset>
        ))}
        <Toggle
          label="Autoplay next item"
          checked={draft.autoplay}
          onChange={() => setDraft({ ...draft, autoplay: !draft.autoplay })}
          description="Applies to episodes, video playlists and audio queue advancement."
        />
        <Text className="text-xs text-text-secondary">
          Follow artists from their profile pages. Following:{" "}
          {app.data.following.length}.
        </Text>
        {message && (
          <Text role="status" className="text-sm text-gold">
            {message}
          </Text>
        )}
        <div className="flex gap-3">
          <Button type="submit">Save preferences</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(profile.preferences)
              setMessage("Unsaved changes discarded.")
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Panel>
  )
}
