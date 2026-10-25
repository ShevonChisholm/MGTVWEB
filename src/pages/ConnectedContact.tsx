import { useRef, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { communications } from "@/lib/communications";
export function ConnectedContact() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [sent, setSent] = useState(false);
  const retry = useRef({ body: "", key: crypto.randomUUID() });
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[760px] mx-auto px-6 md:px-12 py-16">
        <Link to="/" className="text-text-secondary hover:text-gold text-sm">
          ← Home
        </Link>
        <h1 className="font-display text-5xl md:text-7xl mt-10 mb-5">
          Contact Us
        </h1>
        <p className="text-text-secondary mb-8">
          A question, a story, a new connection. Let’s hear it.
        </p>
        <p className="text-sm text-text-secondary mb-8">
          Messages are saved to the MGTV team inbox. During development, replies
          go only to a private local inbox.
        </p>
        {sent ? (
          <div role="status" className="border border-gold/30 rounded-xl p-6">
            <h2 className="font-display text-3xl mb-3">Message received</h2>
            <p className="break-words">{message}</p>
            <Button
              className="mt-5"
              onClick={() => {
                setSent(false);
                setMessage("");
              }}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const body = Object.fromEntries(new FormData(form));
              const serialized = JSON.stringify(body);
              if (retry.current.body !== serialized)
                retry.current = { body: serialized, key: crypto.randomUUID() };
              setBusy(true);
              setMessage("");
              try {
                const result = await communications(
                  "contact/messages",
                  body,
                  retry.current.key,
                );
                setSent(true);
                setMessage(
                  result.message +
                    (result.reference ? " Reference: " + result.reference : ""),
                );
                form.reset();
                retry.current.body = "";
              } catch (error) {
                setMessage((error as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="block">
              Your name
              <Input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Email address
              <Input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              What’s on your mind?
              <select
                name="topic"
                className="mt-2 block w-full bg-bg-elevated border border-white/15 rounded-lg p-3"
              >
                <option value="general">General enquiry</option>
                <option value="support">Account or playback support</option>
                <option value="partnership">Partnerships</option>
                <option value="press">Press</option>
              </select>
            </label>
            <label className="block">
              Subject
              <Input
                name="subject"
                required
                maxLength={180}
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Your message
              <textarea
                name="message"
                required
                minLength={20}
                maxLength={5000}
                rows={6}
                className="mt-2 block w-full bg-bg-elevated border border-white/15 rounded-lg p-3"
              />
            </label>
            <div hidden aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="text-xs text-text-secondary">
              Please leave passwords, payment details and other sensitive
              information out of your message.
            </p>
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Button>
            <p role="status" className="text-sm break-words">
              {message}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
