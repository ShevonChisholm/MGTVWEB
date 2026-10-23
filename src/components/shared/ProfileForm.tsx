import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { avatarStyles, type Profile, type ProfileType } from "@/lib/appState"

export function ProfileForm({
  initial,
  onSave,
  onCancel,
  editing = false,
  adultOnly = false,
}: {
  initial: Profile
  onSave: (profile: Profile, pin: string) => string | undefined
  onCancel: () => void
  editing?: boolean
  adultOnly?: boolean
}) {
  const [draft, setDraft] = useState(initial)
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setError(onSave(draft, pin) ?? "")
      }}
      className="space-y-6"
    >
      <div
        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-xl font-display text-5xl ${avatarStyles[draft.avatar]}`}
      >
        {draft.name[0]?.toUpperCase() || "?"}
      </div>
      <div
        className="flex flex-wrap justify-center gap-2"
        aria-label="Avatar color"
      >
        {Object.entries(avatarStyles).map(([key, style]) => (
          <Button
            key={key}
            variant="ghost"
            className={style}
            aria-pressed={draft.avatar === key}
            onClick={() =>
              setDraft({ ...draft, avatar: key as Profile["avatar"] })
            }
          >
            {key}
          </Button>
        ))}
      </div>
      <div>
        <Text
          as="label"
          htmlFor="profile-name"
          className="mb-2 block text-sm text-text-secondary"
        >
          Profile name
        </Text>
        <Input
          id="profile-name"
          value={draft.name}
          maxLength={20}
          required
          aria-invalid={!!error}
          aria-describedby={error ? "profile-form-error" : undefined}
          onChange={(event) => {
            setDraft({ ...draft, name: event.target.value })
            setError("")
          }}
          className="w-full"
        />
      </div>
      <fieldset>
        <legend className="mb-3 text-sm text-text-secondary">
          Age category
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["adult", "teen", "child"] as ProfileType[]).map((type) => (
            <Button
              key={type}
              variant={draft.type === type ? "primary" : "outline"}
              disabled={(adultOnly || initial.isMain) && type !== "adult"}
              aria-pressed={draft.type === type}
              onClick={() => setDraft({ ...draft, type })}
            >
              {type}
            </Button>
          ))}
        </div>
        {(adultOnly || initial.isMain) && (
          <Text className="mt-3 text-xs text-text-secondary">
            The main account profile remains an adult.
          </Text>
        )}
      </fieldset>
      {editing && (
        <div>
          <Text
            as="label"
            htmlFor="profile-pin"
            className="mb-2 block text-sm text-text-secondary"
          >
            Demo PIN to change age category
          </Text>
          <Input
            id="profile-pin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          <Text className="mt-2 text-xs text-text-secondary">
            Demo PIN: 1234 · No real security.
          </Text>
        </div>
      )}
      {error && (
        <Text
          id="profile-form-error"
          role="alert"
          className="text-sm text-rose-300"
        >
          {error}
        </Text>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit">
          {editing ? "Save profile" : "Create profile"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
