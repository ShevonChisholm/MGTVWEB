import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/auth/PasswordField";
import { customerApi } from "@/lib/customerAuth";
import { ProfileIcon } from "./ProfileVisual";
export default function ProfileVerification({
  onVerified,
  purpose = "manage",
}: {
  onVerified: () => Promise<void> | void;
  purpose?: "select" | "manage";
}) {
  const [method, setMethod] = useState<"password" | "pin">(
      purpose === "select" ? "pin" : "password",
    ),
    [secret, setSecret] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  return (
    <div className="pf-panel pf-verify">
      <span className="pf-feature-icon">
        <ProfileIcon name="lock" size={27} />
      </span>
      <h2>
        {purpose === "select"
          ? "A little extra protection"
          : "Confirm it’s you"}
      </h2>
      <p>
        {purpose === "select"
          ? "Enter the account’s parental PIN or password to open this profile."
          : "Use the account password or parental PIN to manage your household’s profiles."}
      </p>
      <div className="pf-methods" role="group" aria-label="Verification method">
        {(["pin", "password"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={method === m}
            disabled={busy}
            onClick={() => {
              setMethod(m);
              setSecret("");
              setError("");
            }}
          >
            {m === "pin" ? "Parental PIN" : "Account password"}
          </button>
        ))}
      </div>
      {error && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="pf-error">
          {error}
        </p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          try {
            await customerApi(
              "/auth/parent/verify-" + method,
              "POST",
              method === "pin" ? { pin: secret } : { password: secret },
            );
            setSecret("");
            await onVerified();
          } catch (e) {
            setSecret("");
            setError(
              e instanceof Error
                ? e.message
                : "Verification could not be completed.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <PasswordField
            key={method}
            label={method === "pin" ? "Parental PIN" : "Account password"}
            required
            inputMode={method === "pin" ? "numeric" : undefined}
            pattern={method === "pin" ? "[0-9]{6}" : undefined}
            minLength={method === "pin" ? 6 : undefined}
            maxLength={method === "pin" ? 6 : 128}
            autoComplete={method === "pin" ? "off" : "current-password"}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            hint={
              method === "pin"
                ? "Use the six-digit PIN set for this account. You can use the account password instead."
                : undefined
            }
          />
          <Button type="submit" className="mt-6 w-full">
            {busy
              ? "Checking…"
              : purpose === "select"
                ? "Unlock & continue"
                : "Continue to management"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
