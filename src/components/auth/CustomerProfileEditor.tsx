import { useState } from "react";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import { SessionDialog } from "@/components/shared/SessionDialog";

import { ProfileAvatar } from "./ProfileVisual";
import { customerApi, CustomerAuthError } from "@/lib/customerAuth";

export type CustomerProfile = {
  id: string;
  name: string;
  type: "adult" | "teen" | "child";
  avatar: string;
  isMain: boolean;
  language: string;
  autoplay: boolean;
  maxClassification: string;
  dailyLimitMinutes: number | null;
  requirePin: boolean;
  version: number;
  available?: boolean;
};

const field =
  "mt-2 block w-full rounded-lg border border-text-muted/40 bg-bg-surface px-4 py-3 text-sm";

export function CustomerProfileEditor({
  profile,
  onClose,
  onSaved,
  embedded = false,
  section = "all",
  onVerificationRequired,
}: {
  profile: CustomerProfile | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  embedded?: boolean;
  section?: "all" | "identity" | "preferences" | "policy" | "delete";
  onVerificationRequired?: () => void;
}) {
  const [name, setName] = useState(profile?.name ?? ""),
    [type, setType] = useState(profile?.type ?? "adult"),
    [avatar, setAvatar] = useState(profile?.avatar ?? "gold"),
    [language, setLanguage] = useState(profile?.language ?? "en"),
    [autoplay, setAutoplay] = useState(profile?.autoplay ?? true),
    [classification, setClassification] = useState(
      profile?.maxClassification ?? "R",
    ),
    [requirePin, setRequirePin] = useState(profile?.requirePin ?? false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirmDelete, setConfirmDelete] = useState(false),
    [dailyLimit, setDailyLimit] = useState(
      profile?.dailyLimitMinutes?.toString() ?? "",
    );

  const ratings = ["G", "PG", "PG-13", "R"].slice(
    0,
    type === "child" ? 2 : type === "teen" ? 3 : 4,
  );

  async function save(policy = false, remove = false) {
    setBusy(true);
    setError("");

    try {
      const headers: Record<string, string> = {
        "Idempotency-Key": crypto.randomUUID(),
      };

      if (profile) headers["If-Match"] = `"v${profile.version}"`;

      await customerApi(
        !profile
          ? "/profiles"
          : `/profiles/${profile.id}${remove ? "/delete" : policy ? "/policy" : ""}`,
        !profile || remove ? "POST" : "PATCH",
        remove
          ? { reason: "Account holder deleted this profile" }
          : policy
            ? {
                maxClassification: classification,
                requirePin,
                dailyLimitMinutes:
                  dailyLimit === "" ? null : Number(dailyLimit),
              }
            : profile
              ? { name, type, avatar, language, autoplay }
              : { name, type, avatar },
        headers,
      );

      await onSaved();
      onClose();
    } catch (e) {
      if (
        e instanceof CustomerAuthError &&
        e.code === "PARENT_VERIFICATION_REQUIRED"
      )
        onVerificationRequired?.();
      setError(e instanceof Error ? e.message : "Could not save this profile.");
    } finally {
      setBusy(false);
    }
  }

  const content = (
    <>
      {!embedded && (
        <p className="mb-5 text-sm text-text-secondary">
          Account password or parental PIN verification is required. Your
          account’s profile allowance applies.
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-rose-400/40 p-3 text-sm text-rose-300"
        >
          {error} Close and reopen this profile to load the latest details if
          they changed.
        </p>
      )}

      {["all", "identity", "preferences"].includes(section) && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <fieldset disabled={busy} className="space-y-5">
            <div hidden={section === "preferences"} className="space-y-5">
              <label className="block text-sm">
                Profile name
                <Input
                  className="mt-2 w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={20}
                />
              </label>

              <label className="block text-sm">
                Age group
                <select
                  className={field}
                  value={type}
                  disabled={profile?.isMain}
                  onChange={(e) => {
                    setType(e.target.value as CustomerProfile["type"]);
                  }}
                >
                  {["adult", "teen", "child"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                {profile?.isMain && (
                  <span className="mt-2 block text-xs text-text-secondary">
                    Your main profile stays adult and cannot be deleted.
                  </span>
                )}
              </label>

              <fieldset>
                <legend className="text-sm">Avatar colour</legend>
                <div className="pf-avatar-choices">
                  {["gold", "blue", "coral", "jade", "purple"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={"Use " + value + " avatar"}
                      aria-pressed={avatar === value}
                      onClick={() => setAvatar(value)}
                    >
                      <ProfileAvatar
                        small
                        name={name || profile?.name || "M"}
                        avatar={value}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            {profile && (
              <div hidden={section === "identity"} className="space-y-5">
                <label className="block text-sm">
                  Preferred language
                  <select
                    className={field}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    {!["en", "es", "fr"].includes(language) && (
                      <option value={language}>{language}</option>
                    )}
                  </select>
                  <span className="mt-2 block text-xs text-text-secondary">
                    Preference only; available languages depend on each title.
                  </span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                  />
                  Autoplay preference
                </label>
              </div>
            )}

            <Button type="submit">
              {busy
                ? "Saving…"
                : profile
                  ? section === "preferences"
                    ? "Save preferences"
                    : "Save profile"
                  : "Create profile"}
            </Button>
          </fieldset>
        </form>
      )}

      {profile && ["all", "policy"].includes(section) && (
        <form
          className="mt-8 border-t border-text-muted/25 pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void save(true);
          }}
        >
          <fieldset disabled={busy} className="space-y-5">
            <h3 className="text-xl">Parental controls</h3>

            <p className="text-sm text-text-secondary">
              Save an age-group change before adjusting its classification.
              Selecting an adult profile never grants parental access.
            </p>

            <label className="block text-sm">
              Maximum classification
              <select
                className={field}
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                {[...new Set([...ratings, profile.maxClassification])].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={requirePin}
                onChange={(e) => setRequirePin(e.target.checked)}
              />
              Require parental verification to select this profile
            </label>

            <label className="block text-sm">
              Daily video limit (minutes)
              <Input
                className="mt-2 w-full"
                type="number"
                min={1}
                max={1440}
                step={1}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
              />
              <span className="mt-2 block text-xs text-text-secondary">
                Leave blank for no daily limit. Full-video allowance is shared
                across devices and resets at midnight in Jamaica. Audio, ads,
                previews and hero clips are excluded.
              </span>
            </label>
            {profile.dailyLimitMinutes !== null && (
              <p className="text-sm text-gold">
                This profile has a daily video allowance. The server checks
                available time during playback.
              </p>
            )}

            <Button variant="outline" type="submit">
              Save parental controls
            </Button>
          </fieldset>
        </form>
      )}

      {profile && !profile.isMain && ["all", "delete"].includes(section) && (
        <div className="mt-8 border-t border-text-muted/25 pt-6">
          {confirmDelete ? (
            <>
              <p className="mb-4 text-sm text-text-secondary">
                Delete {profile.name}? This permanently removes its saved items,
                playlists and viewing history. Account orders and voting records
                are retained.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button disabled={busy} onClick={() => void save(false, true)}>
                  Confirm deletion
                </Button>
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => setConfirmDelete(false)}
                >
                  Keep profile
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
            >
              Delete profile…
            </Button>
          )}
        </div>
      )}
      {profile?.isMain && section === "delete" && (
        <p>Your main adult profile cannot be deleted.</p>
      )}
    </>
  );
  return embedded ? (
    content
  ) : (
    <SessionDialog
      title={profile ? `Manage ${profile.name}` : "Make room for someone"}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      {content}
    </SessionDialog>
  );
}
