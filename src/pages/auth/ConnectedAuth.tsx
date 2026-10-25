import { useEffect, useRef, useState } from "react";
import { safeReturnTo } from "@/lib/appState";
import { useNavigate, useSearchParams } from "react-router";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { PasswordField } from "@/components/auth/PasswordField";
import { authChanged, customerApi } from "@/lib/customerAuth";
type Action =
  | "sign-in"
  | "register"
  | "verify-email"
  | "forgot-password"
  | "reset-password";
export default function ConnectedAuth({ action }: { action: Action }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(""),
    [name, setName] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [token] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "",
  );
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    setCompleted(false);
    setNotice("");
    setError("");
    setPassword("");
    setConfirm("");
  }, [action]);
  useEffect(() => {
    if (window.location.hash)
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
  }, []);
  const titles = {
    "sign-in": "Your next story awaits",
    register: "Make yourself at home",
    "verify-email": "Set your MGTV password",
    "forgot-password": "Find your way back",
    "reset-password": "Choose a fresh password",
  };
  const needsPassword = ["sign-in", "verify-email", "reset-password"].includes(
    action,
  );
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (needsPassword && action !== "sign-in" && password !== confirm)
        throw Error("The passwords do not match.");
      const path = action === "sign-in" ? "login" : action;
      const body =
        action === "register"
          ? { email, displayName: name }
          : action === "sign-in"
            ? { email, password }
            : action === "forgot-password"
              ? { email }
              : { token, password };
      const response = await customerApi("/auth/" + path, "POST", body);
      setPassword("");
      setConfirm("");
      setNotice(response.message ?? "Signed in.");
      if (action !== "sign-in") setCompleted(true);
      if (action === "sign-in") {
        authChanged();
        navigate(
          params.has("returnTo")
            ? "/profiles?returnTo=" +
                encodeURIComponent(safeReturnTo(params.get("returnTo")))
            : "/profiles",
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed.");
      setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div key={action}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
        Your MGTV account
      </p>
      <Text as="h1" className="mb-3 font-display text-5xl">
        {titles[action]}
      </Text>
      <Text className="mb-6 text-sm text-text-secondary">
        {action === "register"
          ? "Start with your email. Set your password after opening the verification link."
          : action === "sign-in"
            ? "Stories from home. A world to explore. Sign in to choose your profile."
            : action === "forgot-password"
              ? "Enter your account email and we’ll help you take the next step."
              : "Make it memorable to you and difficult for anyone else to guess."}
      </Text>
      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mb-4 rounded-lg border border-rose-400 p-3 text-sm"
        >
          {error}
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-relaxed text-gold"
        >
          {notice}
        </p>
      )}
      {!completed && (
        <form onSubmit={(event) => void submit(event)} className="space-y-5">
          <fieldset disabled={busy} className="space-y-5">
            {action === "register" && (
              <label className="block text-sm">
                Your name
                <Input
                  className="mt-2 w-full"
                  required
                  maxLength={120}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            {["register", "sign-in", "forgot-password"].includes(action) && (
              <label className="block text-sm">
                Email
                <Input
                  className="mt-2 w-full"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            )}
            {needsPassword && (
              <PasswordField
                label={action === "sign-in" ? "Password" : "New password"}
                hint={
                  action === "sign-in"
                    ? undefined
                    : "Use 15–128 characters. A longer passphrase is easier to remember."
                }
                required
                minLength={15}
                maxLength={128}
                autoComplete={
                  action === "sign-in" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {needsPassword && action !== "sign-in" && (
              <PasswordField
                label="Confirm new password"
                required
                minLength={15}
                maxLength={128}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            )}
            {!token && ["verify-email", "reset-password"].includes(action) && (
              <p role="alert" className="text-sm text-rose-300">
                Open the complete link from your authentication email. This page
                has no verification token.
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={
                busy ||
                (["verify-email", "reset-password"].includes(action) && !token)
              }
            >
              {busy
                ? "Checking…"
                : action === "sign-in"
                  ? "Sign in"
                  : action === "register"
                    ? "Send my verification link"
                    : action === "forgot-password"
                      ? "Send recovery instructions"
                      : "Save password"}
            </Button>
          </fieldset>
        </form>
      )}
      <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-text-muted/20 pt-5">
        {action !== "sign-in" && (
          <ButtonLink to="/auth/sign-in" variant="ghost">
            Sign in
          </ButtonLink>
        )}
        {action !== "register" && (
          <ButtonLink to="/auth/register" variant="ghost">
            Create account
          </ButtonLink>
        )}
        {action === "sign-in" && (
          <ButtonLink to="/auth/forgot-password" variant="ghost">
            Forgot password?
          </ButtonLink>
        )}
      </div>
      <p className="mt-5 text-xs text-text-secondary">
        Use the complete link from your authentication email. Links expire and
        can be used once.
      </p>
    </div>
  );
}
