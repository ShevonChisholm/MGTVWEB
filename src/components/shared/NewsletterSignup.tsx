import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { communications } from "@/lib/communications";
export function NewsletterSignup() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const retry = useRef({ body: "", key: crypto.randomUUID() });
  return (
    <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center justify-between">
      <div>
        <h3 className="font-display text-2xl mb-2">Get the next drop</h3>
        <p className="max-w-md text-sm text-text-secondary">
          Fresh stories. New releases. A little more MGTV in your inbox.
        </p>
      </div>
      <form
        className="w-full min-w-0 xl:max-w-lg space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = e.currentTarget,
            d = new FormData(f),
            body = {
              email: d.get("email"),
              consent: d.get("consent") === "on",
              website: d.get("website"),
            };
          const serialized = JSON.stringify(body);
          if (retry.current.body !== serialized)
            retry.current = { body: serialized, key: crypto.randomUUID() };
          setBusy(true);
          setMessage("");
          try {
            const result = await communications(
              "newsletter/signup",
              body,
              retry.current.key,
            );
            setMessage(result.message);
            f.reset();
            retry.current.body = "";
          } catch (error) {
            setMessage((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label
          htmlFor="newsletter-email"
          className="block text-sm text-text-secondary"
        >
          Email address
        </label>
        <div className="flex flex-wrap gap-2">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="Your email address"
            className="min-w-0 w-full sm:w-auto sm:flex-1"
          />
          <Button type="submit" disabled={busy}>
            {busy ? "Requesting…" : "Keep me in the loop"}
          </Button>
        </div>
        <label className="flex gap-2 text-sm text-text-secondary">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 shrink-0"
          />
          <span>
            I’d like the MGTV newsletter. I’ll confirm by email and can
            unsubscribe at any time.
          </span>
        </label>
        <div hidden aria-hidden="true">
          <input name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <p className="text-xs text-text-secondary">
          Development delivery stays in the private local inbox.
        </p>
        <p role="status" className="text-sm break-words">
          {message}
        </p>
      </form>
    </div>
  );
}
