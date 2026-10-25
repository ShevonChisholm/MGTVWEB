import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/Button";
import { communications } from "@/lib/communications";
export function NewsletterAction() {
  const location = useLocation();
  const [token] = useState(
    () => new URLSearchParams(location.hash.slice(1)).get("token") ?? "",
  );
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [message, setMessage] = useState("");
  const action = location.pathname.endsWith("/confirm")
    ? "confirm"
    : "unsubscribe";
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Link to="/" className="text-text-secondary hover:text-gold">
          ← Home
        </Link>
        <h1 className="font-display text-5xl mt-10 mb-6">
          {action === "confirm"
            ? "Make it official"
            : "Your inbox, your choice"}
        </h1>
        <p className="text-text-secondary mb-6">
          {action === "confirm"
            ? "Confirm that you want to receive the MGTV newsletter."
            : "Unsubscribe from the MGTV newsletter. Your account and service messages are unaffected."}
        </p>
        {!token ? (
          <p role="alert">
            This link is incomplete. Please use the full link from your email.
          </p>
        ) : (
          !done && (
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setMessage("");
                try {
                  const result = await communications("newsletter/" + action, {
                    token,
                  });
                  setDone(true);
                  setMessage(result.message);
                  window.history.replaceState(null, "", location.pathname);
                } catch (error) {
                  setMessage((error as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy
                ? "Saving…"
                : action === "confirm"
                  ? "Confirm my subscription"
                  : "Unsubscribe me"}
            </Button>
          )
        )}
        <p role="status" className="mt-5 break-words">
          {message}
        </p>
      </div>
    </div>
  );
}
