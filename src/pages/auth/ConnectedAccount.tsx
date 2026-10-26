import {LoadingSkeleton} from "@/components/shared/LoadingSkeleton";
import {
  CustomerProfileEditor,
  type CustomerProfile,
} from "@/components/auth/CustomerProfileEditor";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { safeReturnTo } from "@/lib/appState";
import { NotificationPreferences } from "@/components/notifications/ConnectedNotifications";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubscriptionAccess } from "@/components/movies/SubscriptionAccess";
import { Text } from "@/components/ui/Text";
import {
  authChanged,
  customerApi,
  useCustomerSession,
} from "@/lib/customerAuth";
export default function ConnectedAccount() {
  const { session, loading, error: sessionError } = useCustomerSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [editor, setEditor] = useState<CustomerProfile | null | undefined>(
    undefined,
  );
  useEffect(() => {
    if (session && location.pathname === "/profiles/create") setEditor(null);
  }, [session?.account.id, location.pathname]);
  async function reloadProfiles() {
    const page = await customerApi("/profiles");
    setProfiles(page.items);
    setProfileLimit(page.limit);
    setProfilesLoaded(true);
    authChanged();
  }
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]),
    [profilesLoaded, setProfilesLoaded] = useState(false),
    [profileLimit, setProfileLimit] = useState(1),
    [password, setPassword] = useState(""),
    [pin, setPin] = useState(""),
    [setupPassword, setSetupPassword] = useState(""),
    [newPin, setNewPin] = useState(""),
    [confirmPin, setConfirmPin] = useState(""),
    [securityMode, setSecurityMode] = useState<"password" | "pin" | "setup">(
      "password",
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const errorRef = useRef<HTMLDivElement>(null),
    noticeRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  async function run(work: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed.");
      setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    let active = true;
    setProfilesLoaded(false);
    setProfiles([]);
    if (session)
      void customerApi("/profiles")
        .then((page) => {
          if (!active) return;
          setProfiles(page.items);
          setProfileLimit(page.limit);
          setProfilesLoaded(true);
        })
        .catch((e) => {
          if (active)
            setError(
              e instanceof Error
                ? e.message
                : "Profiles could not be loaded. Try Refresh profiles.",
            );
        });
    return () => {
      active = false;
    };
  }, [session?.account.id]);
  if (loading)
    return (
      <main className="px-6 py-28">
        <LoadingSkeleton label="Checking your customer session…" variant="account" count={3}/>
      </main>
    );
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-28">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
        Make room for your people
      </p>
      <Text as="h1" className="mb-4 font-display text-5xl md:text-6xl">
        {session ? "Your corner of MGTV" : "Come on in"}
      </Text>
      {error && (
        <div
          role="alert"
          ref={errorRef}
          tabIndex={-1}
          className="mb-4 rounded-lg border border-rose-400 p-3"
        >
          {error}
        </div>
      )}
      {session?.activeProfileId && <NotificationPreferences />}
      {notice && (
        <p
          role="status"
          ref={noticeRef}
          tabIndex={-1}
          className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-gold"
        >
          {notice}
        </p>
      )}
      {sessionError && (
        <p role="alert" className="mb-5 text-rose-300">
          {sessionError}
        </p>
      )}
      {editor !== undefined && session && (
        <CustomerProfileEditor
          profile={editor}
          onClose={() => setEditor(undefined)}
          onSaved={async () => {
            await reloadProfiles();
            setNotice("Your profile changes have been saved.");
          }}
        />
      )}
      {!session ? (
        <>
          <p className="mb-6">
            Sign in with your customer account to see its profiles.
          </p>
          <ButtonLink to="/auth/sign-in">Customer sign-in</ButtonLink>
        </>
      ) : (
        <>
          <p className="mb-6 text-text-secondary">
            Welcome, {session.account.displayName}. Choose who’s here, then make
            yourself at home.
          </p>
          <section aria-labelledby="profiles-heading" className="mb-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <Text as="h2" id="profiles-heading" className="text-2xl">
                  Who’s joining us?
                </Text>
                <p className="mt-2 text-sm text-text-secondary">
                  One account. Your people. Your profiles.
                </p>
              </div>
              <span className="rounded-full border border-text-muted/30 px-3 py-1 text-xs text-text-secondary">
                {profilesLoaded
                  ? `${profiles.length} profile${profiles.length === 1 ? "" : "s"} · ${profileLimit} total slot${profileLimit === 1 ? "" : "s"}`
                  : "Loading profiles…"}
              </span>
            </div>
            <p className="mb-4 text-sm text-text-secondary">
              To manage profiles,{" "}
              <a
                className="text-gold underline underline-offset-4"
                href="#security-heading"
              >
                verify parental access below
              </a>{" "}
              with your account password or parental PIN.
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                disabled={
                  busy || !profilesLoaded || profiles.length >= profileLimit
                }
                onClick={() => setEditor(null)}
              >
                Add profile
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => void run(reloadProfiles)}
              >
                Refresh profiles
              </Button>
              {profilesLoaded && profiles.length >= profileLimit && (
                <p className="text-xs text-text-secondary">
                  Your current profile slots are in use. Existing profiles stay
                  saved if your tier changes.
                </p>
              )}
            </div>
            {!profilesLoaded && !error && (
              <div
                role="status"
                aria-label="Loading profiles"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="h-72 animate-pulse rounded-2xl border border-text-muted/25 bg-bg-surface"
                  />
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <article
                  key={profile.id}
                  className={`flex min-w-0 flex-col rounded-2xl border bg-bg-surface p-6 transition-colors ${session.activeProfileId === profile.id ? "border-gold/70 bg-gold/5" : "border-text-muted/25 hover:border-gold/40"}`}
                >
                  <span
                    aria-hidden="true"
                    className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-current/20 text-3xl font-semibold"
                    style={{
                      color:
                        (
                          {
                            gold: "#C9A84C",
                            blue: "#60a5fa",
                            jade: "#34d399",
                            purple: "#c084fc",
                            coral: "#fb7185",
                          } as Record<string, string>
                        )[profile.avatar] ?? "#C9A84C",
                      background: "rgba(255,255,255,.04)",
                    }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                  <Text as="h3" className="break-words text-xl">
                    {profile.name}
                  </Text>
                  <p className="mb-5 mt-2 text-sm capitalize text-text-secondary">
                    {profile.type}
                    {profile.isMain ? " · Main profile" : ""}
                    {session.activeProfileId === profile.id
                      ? " · Selected"
                      : ""}
                  </p>
                  {profile.available === false && (
                    <p className="mb-4 text-xs text-gold">
                      Outside your current subscription’s profile allowance
                    </p>
                  )}
                  {profile.requirePin && (
                    <p className="mb-4 text-xs text-gold">
                      Parental verification required
                    </p>
                  )}
                  <Button
                    className="mt-auto w-full"
                    variant={
                      session.activeProfileId === profile.id
                        ? "primary"
                        : "outline"
                    }
                    disabled={
                      busy ||
                      profile.available === false ||
                      session.activeProfileId === profile.id
                    }
                    onClick={() =>
                      void run(async () => {
                        await customerApi("/auth/profile", "POST", {
                          profileId: profile.id,
                        });
                        setNotice("Profile selected.");
                        authChanged();
                        if (params.has("returnTo"))
                          navigate(safeReturnTo(params.get("returnTo")));
                      })
                    }
                  >
                    {session.activeProfileId === profile.id
                      ? "Current profile"
                      : "Choose " + profile.name}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy}
                    className="mt-3"
                    onClick={() => setEditor(profile)}
                  >
                    Manage {profile.name}
                  </Button>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-secondary">
              Your choice is saved for this session. Catalog age classifications
              follow this profile. Full-video limits are shared across devices and reset at midnight in Jamaica. Authorized windows are up to 15 seconds; the last partial window can count when you pause or close playback. Audio, ads, previews and hero clips do not use this allowance.
            </p>
          </section>
          {session.activeProfileId && params.has("returnTo") && (
            <ButtonLink
              className="mb-8"
              to={safeReturnTo(params.get("returnTo"))}
            >
              Continue watching
            </ButtonLink>
          )}
          <SubscriptionAccess />
          <section
            aria-labelledby="security-heading"
            className="mb-8 rounded-2xl border border-text-muted/25 bg-bg-surface p-5 md:p-8"
          >
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
                Account security
              </p>
              <Text as="h2" id="security-heading" className="text-2xl">
                A little extra peace of mind
              </Text>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                Protected profiles need the account password or a six-digit
                parental PIN. Verification lasts five minutes in this session.
                Choosing an adult profile does not unlock parental access.
              </p>
            </div>
            <div
              className="mb-6 flex flex-wrap gap-2"
              role="group"
              aria-label="Parental security task"
            >
              {(
                [
                  ["password", "Use account password"],
                  ["pin", "Use parental PIN"],
                  ["setup", "Set or replace PIN"],
                ] as const
              ).map(([mode, label]) => (
                <Button
                  key={mode}
                  variant={securityMode === mode ? "primary" : "outline"}
                  aria-pressed={securityMode === mode}
                  disabled={busy}
                  onClick={() => {
                    setSecurityMode(mode);
                    setPassword("");
                    setPin("");
                    setSetupPassword("");
                    setNewPin("");
                    setConfirmPin("");
                    setError("");
                    setNotice("");
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <form
              className="max-w-lg space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  if (securityMode === "setup") {
                    if (newPin !== confirmPin)
                      throw Error(
                        "The PINs do not match. Enter the same six digits in both fields.",
                      );
                    await customerApi("/auth/parent/pin", "POST", {
                      password: setupPassword,
                      pin: newPin,
                    });
                    setSetupPassword("");
                    setNewPin("");
                    setConfirmPin("");
                    setNotice("Your parental PIN has been saved.");
                  } else {
                    await customerApi(
                      "/auth/parent/" +
                        (securityMode === "password"
                          ? "verify-password"
                          : "verify-pin"),
                      "POST",
                      securityMode === "password" ? { password } : { pin },
                    );
                    setPassword("");
                    setPin("");
                    setNotice(
                      "Parental verification is active for five minutes. You can now choose a protected profile.",
                    );
                  }
                  authChanged();
                });
              }}
            >
              <fieldset disabled={busy} className="space-y-5">
                {securityMode === "password" && (
                  <PasswordField
                    label="Account password"
                    required
                    autoComplete="current-password"
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
                {securityMode === "pin" && (
                  <PasswordField
                    label="Parental PIN"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    minLength={6}
                    maxLength={6}
                    autoComplete="off"
                    hint="Use the six-digit PIN set for this account."
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                )}
                {securityMode === "setup" && (
                  <>
                    <PasswordField
                      label="Account password"
                      required
                      autoComplete="current-password"
                      maxLength={128}
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                    />
                    <PasswordField
                      label="New parental PIN"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      minLength={6}
                      maxLength={6}
                      autoComplete="off"
                      hint="Choose six digits. Keep this PIN private from other profile users."
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                    />
                    <PasswordField
                      label="Confirm parental PIN"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      minLength={6}
                      maxLength={6}
                      autoComplete="off"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                    />
                  </>
                )}
                <Button type="submit" disabled={busy}>
                  {busy
                    ? "Checking…"
                    : securityMode === "setup"
                      ? "Save parental PIN"
                      : "Verify parental access"}
                </Button>
              </fieldset>
            </form>
          </section>
          <section className="rounded-2xl border border-text-muted/25 p-5 md:p-8">
            <Text as="h2" className="text-xl">
              Your account, your control
            </Text>
            <p className="mb-5 mt-2 break-words text-sm text-text-secondary">
              {session.account.displayName}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await customerApi("/auth/logout", "POST");
                    authChanged();
                  })
                }
              >
                Sign out
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await customerApi("/auth/logout-all", "POST");
                    authChanged();
                  })
                }
              >
                Sign out all customer sessions
              </Button>
              <ButtonLink to="/movies" variant="ghost">
                Explore movies
              </ButtonLink>
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Signing out all sessions also ends access on your other browsers
              and devices.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
