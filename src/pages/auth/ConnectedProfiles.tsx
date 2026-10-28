import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  CustomerProfileEditor,
  type CustomerProfile,
} from "@/components/auth/CustomerProfileEditor";
import {
  ProfileAvatar,
  ProfileIcon,
  ProfileSettingLink,
} from "@/components/auth/ProfileVisual";
import ProfileVerification from "@/components/auth/ProfileVerification";
import {
  authChanged,
  customerApi,
  CustomerAuthError,
  getCustomerSession,
  useCustomerSession,
} from "@/lib/customerAuth";
import { profileDestination, profileHasRoom } from "@/lib/profileFlow";
import "./profiles-flow.css";

type View =
  | "choose"
  | "manage"
  | "create"
  | "unlock"
  | "settings"
  | "identity"
  | "preferences"
  | "policy"
  | "delete"
  | "security"
  | "missing";
function profileRoute(path: string): { view: View; id?: string } {
  if (path === "/parental-controls") return { view: "security" };
  const p = path.split("/").filter(Boolean).slice(1);
  if (!p.length) return { view: "choose" };
  if (p.length === 1 && ["manage", "create", "security"].includes(p[0]))
    return { view: p[0] as View };
  if (p[0] === "unlock" && p.length === 2) return { view: "unlock", id: p[1] };
  if (p.length === 1) return { view: "settings", id: p[0] };
  if (
    p.length === 2 &&
    ["identity", "preferences", "policy", "delete"].includes(p[1])
  )
    return { view: p[1] as View, id: p[0] };
  return { view: "missing" };
}
export default function ConnectedProfiles() {
  const { session, loading, error: sessionError } = useCustomerSession(),
    navigate = useNavigate(),
    { pathname } = useLocation(),
    [params] = useSearchParams();
  const { view, id } = profileRoute(pathname);
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]),
    [limit, setLimit] = useState(1),
    [loaded, setLoaded] = useState(false),
    [loadedAccount, setLoadedAccount] = useState<string | undefined>(undefined),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0),
    [proof, setProof] = useState<{ account: string; until: number } | null>(
      null,
    ),
    [forceProof, setForceProof] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null),
    errorRef = useRef<HTMLDivElement>(null),
    accountRef = useRef(session?.account.id);
  accountRef.current = session?.account.id;
  const destination = profileDestination(params.get("returnTo")),
    suffix = params.has("returnTo")
      ? "?returnTo=" + encodeURIComponent(destination)
      : "";
  const path = (tail = "") => "/profiles" + tail + suffix;
  const ready = loaded && loadedAccount === session?.account.id;
  const profile = ready ? profiles.find((p) => p.id === id) : undefined,
    hasRoom = ready && profileHasRoom(profiles.length, limit);
  const verifiedUntil = Math.max(
    Date.parse(session?.parentVerifiedUntil ?? "") || 0,
    proof?.account === session?.account.id ? (proof?.until ?? 0) : 0,
  );
  const verified = !forceProof && verifiedUntil > Date.now();
  const management = !["choose", "unlock", "security"].includes(view);
  useEffect(() => {
    const timer = setTimeout(() => titleRef.current?.focus(), 0);
    setError("");
    return () => clearTimeout(timer);
  }, [pathname]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    setProof(null);
    setForceProof(false);
    setNotice("");
  }, [session?.account.id]);
  useEffect(() => {
    if (!verifiedUntil) return;
    const timer = setTimeout(
      () => {
        setProof(null);
        setForceProof(true);
      },
      Math.min(2147483647, Math.max(0, verifiedUntil - Date.now())),
    );
    return () => clearTimeout(timer);
  }, [verifiedUntil]);
  useEffect(() => {
    let active = true;
    setProfiles([]);
    setLoaded(false);
    setError("");
    if (session?.account.id)
      void customerApi("/profiles")
        .then((p) => {
          if (active) {
            setProfiles(p.items);
            setLimit(p.limit);
            setLoadedAccount(session?.account.id);
            setLoaded(true);
          }
        })
        .catch((e) => {
          if (active)
            setError(
              e instanceof Error ? e.message : "Profiles could not be loaded.",
            );
        });
    return () => {
      active = false;
    };
  }, [session?.account.id, revision]);
  async function refresh() {
    const account = accountRef.current;
    const p = await customerApi("/profiles");
    if (account !== accountRef.current) return;
    setProfiles(p.items);
    setLimit(p.limit);
    setLoadedAccount(account);
    setLoaded(true);
    authChanged();
  }
  async function select(p: CustomerProfile) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await customerApi("/auth/profile", "POST", { profileId: p.id });
      authChanged();
      const current = await getCustomerSession();
      if (current?.activeProfileId !== p.id)
        throw Error(
          "This profile is no longer available. Refresh profiles and choose again.",
        );
      navigate(destination, { replace: true });
    } catch (e) {
      if (
        e instanceof CustomerAuthError &&
        e.code === "PARENT_VERIFICATION_REQUIRED"
      ) {
        navigate(path("/unlock/" + p.id));
        throw e;
      }
      throw e;
    } finally {
      setBusy(false);
    }
  }
  const title =
    view === "choose"
      ? "Who’s joining us?"
      : view === "manage"
        ? "Make it their own."
        : view === "create"
          ? "Make room for someone."
          : view === "unlock"
            ? "Your profile. Your space."
            : view === "security"
              ? "Keep your household protected."
              : profile
                ? view === "settings"
                  ? profile.name
                  : view === "identity"
                    ? "A name. A little personality."
                    : view === "preferences"
                      ? "In your rhythm."
                      : view === "policy"
                        ? "The right space for them."
                        : "Remove this profile?"
                : "Profile not found";
  function verifiedNow() {
    setForceProof(false);
    // Verification changes parental proof, not the signed-in identity. Keep the
    // current session and any mounted editor draft while the server owns expiry.
    setProof({ account: session.account.id, until: Date.now() + 300000 });
  }
  return (
    <div className="profiles-flow">
      <header className="pf-header">
        <Link to="/" aria-label="MGTV home">
          <BrandLogo className="h-12 w-24" />
        </Link>
        <Link to="/account" className="pf-account-link">
          <ProfileIcon name="user" size={17} /> Account
        </Link>
      </header>
      <main
        className={
          "pf-main " +
          (["choose", "manage"].includes(view) ? "pf-main--chooser" : "")
        }
      >
        {view !== "choose" && (
          <Link
            className="pf-back"
            to={path(
              view === "manage" || view === "unlock"
                ? ""
                : view === "settings" || view === "create"
                  ? "/manage"
                  : id
                    ? "/" + id
                    : "/manage",
            )}
          >
            <ProfileIcon name="back" size={17} />
            {view === "unlock" || view === "manage"
              ? "Back to profiles"
              : "Back"}
          </Link>
        )}
        <div className="pf-heading">
          <p className="pf-eyebrow">YOUR PEOPLE. YOUR MGTV.</p>
          <h1 ref={titleRef} tabIndex={-1}>
            {title}
          </h1>
          {["choose", "manage"].includes(view) && (
            <p>
              {view === "choose"
                ? "Pick your profile. Find your next favourite."
                : "Choose a profile to change its details and preferences."}
            </p>
          )}
        </div>
        {(error || sessionError) && (
          <div ref={errorRef} tabIndex={-1} role="alert" className="pf-error">
            {error || sessionError}
            <button type="button" onClick={() => setRevision((x) => x + 1)}>
              Refresh profiles
            </button>
          </div>
        )}
        {notice && (
          <p className="pf-success" role="status">
            {notice}
          </p>
        )}
        {loading ? (
          <div
            className="pf-tiles"
            aria-label="Checking customer session"
            role="status"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="pf-tile-skeleton" />
            ))}
          </div>
        ) : !session ? (
          <div className="pf-panel pf-center">
            <h2>Come on in.</h2>
            <p>Sign in to choose your personal MGTV space.</p>
            <ButtonLink
              to={"/auth/sign-in?returnTo=" + encodeURIComponent(destination)}
            >
              Customer sign-in
            </ButtonLink>
          </div>
        ) : !ready ? (
          !error && (
            <div
              className="pf-tiles"
              aria-label="Loading profiles"
              role="status"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="pf-tile-skeleton" />
              ))}
            </div>
          )
        ) : (
          <>
            {management && !verified && (
              <ProfileVerification
                key={session.account.id + ":manage"}
                onVerified={verifiedNow}
              />
            )}
            <div hidden={management && !verified}>
              {["choose", "manage"].includes(view) && (
                <>
                  <div className="pf-tiles">
                    {profiles.map((p) => (
                      <div key={p.id} className="pf-person">
                        <button
                          type="button"
                          className={
                            "pf-profile-button " +
                            (p.available === false && view === "choose"
                              ? "pf-unavailable"
                              : "")
                          }
                          disabled={
                            busy || (view === "choose" && p.available === false)
                          }
                          aria-label={
                            (view === "manage" ? "Manage " : "Choose ") +
                            p.name +
                            (p.requirePin && view === "choose"
                              ? ", protected profile"
                              : "")
                          }
                          onClick={() => {
                            setError("");
                            if (view === "manage") navigate(path("/" + p.id));
                            else if (p.requirePin)
                              navigate(path("/unlock/" + p.id));
                            else
                              void select(p).catch((e) =>
                                setError(
                                  e instanceof Error
                                    ? e.message
                                    : "This profile could not be selected.",
                                ),
                              );
                          }}
                        >
                          <span className="pf-avatar-frame">
                            <ProfileAvatar
                              name={p.name}
                              avatar={p.avatar}
                              src={p.avatarUrl}
                              type={p.type}
                            />
                            {view === "manage" && (
                              <span className="pf-edit-overlay">
                                <ProfileIcon name="edit" size={28} />
                              </span>
                            )}
                            {p.requirePin && view === "choose" && (
                              <span className="pf-lock-badge">
                                <ProfileIcon name="lock" size={15} />
                              </span>
                            )}
                          </span>
                          <strong>{p.name}</strong>
                        </button>
                        <small>
                          {p.isMain
                            ? "Main profile"
                            : p.type === "child"
                              ? "Kids"
                              : p.type === "teen"
                                ? "Teen"
                                : session.activeProfileId === p.id
                                  ? "Last selected"
                                  : "Personal profile"}
                        </small>
                        {p.available === false && (
                          <span className="pf-limit-note">
                            Saved · outside current plan
                          </span>
                        )}
                      </div>
                    ))}
                    {hasRoom && (
                      <div className="pf-person">
                        <Link
                          className="pf-add"
                          to={path("/create")}
                          aria-label="Add profile"
                        >
                          <span>
                            <ProfileIcon name="plus" size={42} />
                          </span>
                          <strong>Add profile</strong>
                        </Link>
                        <small>Room for someone new</small>
                      </div>
                    )}
                  </div>
                  <div className="pf-chooser-actions">
                    {view === "choose" ? (
                      <Button
                        variant="outline"
                        onClick={() => navigate(path("/manage"))}
                      >
                        <ProfileIcon name="edit" size={17} /> Manage profiles
                      </Button>
                    ) : (
                      <Button onClick={() => navigate(path())}>
                        <ProfileIcon name="check" size={18} /> Done
                      </Button>
                    )}
                    <button
                      className="pf-refresh"
                      type="button"
                      aria-label="Refresh profiles"
                      title="Refresh profiles"
                      disabled={busy}
                      onClick={() => setRevision((x) => x + 1)}
                    >
                      <ProfileIcon name="refresh" />
                    </button>
                  </div>
                  <p className="pf-slot-count">
                    {profiles.length} saved · {limit} profile slot
                    {limit === 1 ? "" : "s"} on your current plan
                  </p>
                  {!hasRoom && (
                    <p className="pf-subtle">
                      All current slots are in use.{" "}
                      <Link to="/mgtv-plus">Explore MGTV+</Link>
                    </p>
                  )}
                </>
              )}
              {view === "unlock" &&
                (profile ? (
                  <>
                    <div className="pf-unlock-identity">
                      <ProfileAvatar
                        small
                        name={profile.name}
                        avatar={profile.avatar}
                        src={profile.avatarUrl}
                      />
                      <strong>{profile.name}</strong>
                    </div>
                    {profile.available === false ? (
                      <div className="pf-panel">
                        <p>
                          This saved profile is outside your current plan’s
                          allowance.
                        </p>
                        <ButtonLink to={path()}>
                          Choose another profile
                        </ButtonLink>
                      </div>
                    ) : (
                      <ProfileVerification
                        key={profile.id}
                        purpose="select"
                        onVerified={async () => {
                          await verifiedNow();
                          await select(profile);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <p className="pf-error">
                    This profile is no longer available. Return to the chooser
                    and refresh.
                  </p>
                ))}
              {view === "settings" && profile && (
                <>
                  <div className="pf-profile-summary">
                    <ProfileAvatar
                      small
                      name={profile.name}
                      avatar={profile.avatar}
                      src={profile.avatarUrl}
                      type={profile.type}
                    />
                    <div>
                      <strong>
                        {profile.isMain
                          ? "Your main adult profile"
                          : profile.type + " profile"}
                      </strong>
                      <p>
                        {profile.available === false
                          ? "Saved outside your current plan’s allowance"
                          : "A personal space on MGTV"}
                      </p>
                    </div>
                  </div>
                  <div className="pf-settings-list">
                    <ProfileSettingLink
                      to={path("/" + id + "/identity")}
                      icon="user"
                      title="Name & avatar"
                      description="A familiar face in the profile chooser"
                    />
                    <ProfileSettingLink
                      to={path("/" + id + "/preferences")}
                      icon="play"
                      title="Playback & language"
                      description="Language and autoplay preferences"
                    />
                    <ProfileSettingLink
                      to={path("/" + id + "/policy")}
                      icon="shield"
                      title="Profile lock & parental controls"
                      description="Protected switching, maturity and daily viewing limits"
                    />
                    <ProfileSettingLink
                      to={path("/security")}
                      icon="lock"
                      title="Account parental PIN"
                      description="Set or replace the shared parental PIN"
                    />
                    {!profile.isMain && (
                      <ProfileSettingLink
                        to={path("/" + id + "/delete")}
                        icon="trash"
                        title="Delete profile"
                        description="Review what will be removed before confirming"
                        danger
                      />
                    )}
                  </div>
                  {profile.isMain && (
                    <p className="pf-subtle">
                      Your main adult profile is protected and cannot be
                      deleted.
                    </p>
                  )}
                </>
              )}
              {view === "create" &&
                (hasRoom ? (
                  <div className="pf-panel">
                    <CustomerProfileEditor
                      profile={null}
                      embedded
                      section="identity"
                      onVerificationRequired={() => setForceProof(true)}
                      onClose={() => navigate(path("/manage"))}
                      onSaved={async () => {
                        await refresh();
                        setNotice("Your new profile is ready.");
                      }}
                    />
                  </div>
                ) : (
                  <div className="pf-panel">
                    <h2>Your current slots are in use.</h2>
                    <p>Your profiles stay saved if your plan changes.</p>
                    <ButtonLink to={path("/manage")} variant="outline">
                      Manage profiles
                    </ButtonLink>
                  </div>
                ))}
              {profile &&
                ["identity", "preferences", "policy", "delete"].includes(
                  view,
                ) && (
                  <div className="pf-panel">
                    <div className="pf-edit-identity">
                      <ProfileAvatar
                        small
                        name={profile.name}
                        avatar={profile.avatar}
                        src={profile.avatarUrl}
                      />
                      <strong>{profile.name}</strong>
                    </div>
                    <CustomerProfileEditor
                      key={profile.id + ":" + view}
                      profile={profile}
                      embedded
                      section={
                        view as "identity" | "preferences" | "policy" | "delete"
                      }
                      onVerificationRequired={() => setForceProof(true)}
                      onClose={() =>
                        navigate(
                          path(
                            view === "delete" ? "/manage" : "/" + profile.id,
                          ),
                        )
                      }
                      onSaved={async () => {
                        await refresh();
                        setNotice(
                          view === "delete"
                            ? "The profile has been removed."
                            : "Your profile changes are saved.",
                        );
                      }}
                    />
                  </div>
                )}
              {(view === "missing" ||
                (id && !profile && view !== "unlock")) && (
                <div className="pf-panel">
                  <p>This profile could not be found in your account.</p>
                  <ButtonLink to={path("/manage")}>Back to profiles</ButtonLink>
                </div>
              )}
              {view === "security" && (
                <PinSetup
                  onSaved={() => {
                    verifiedNow();
                    setNotice("Your parental PIN is saved.");
                    navigate(path("/manage"));
                  }}
                />
              )}
            </div>
          </>
        )}
      </main>
      <footer className="pf-footer">
        Your profile keeps your picks, progress and preferences together.
      </footer>
    </div>
  );
}
function PinSetup({ onSaved }: { onSaved: () => void }) {
  const [password, setPassword] = useState(""),
    [pin, setPin] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="pf-panel">
      <p className="mb-6 text-sm text-text-secondary">
        This is the shared parental PIN for this account. Verify with your
        account password to set or replace it.
      </p>
      {error && (
        <p role="alert" className="pf-error">
          {error}
        </p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setError("");
          if (pin !== confirm) {
            setError("The PINs do not match.");
            return;
          }
          setBusy(true);
          try {
            await customerApi("/auth/parent/pin", "POST", { password, pin });
            setPassword("");
            setPin("");
            setConfirm("");
            authChanged();
            onSaved();
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "The parental PIN could not be saved.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy} className="space-y-5">
          <PasswordField
            label="Account password"
            required
            autoComplete="current-password"
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordField
            label="New parental PIN"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <PasswordField
            label="Confirm parental PIN"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            autoComplete="off"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <Button type="submit">
            {busy ? "Saving…" : "Save parental PIN"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
