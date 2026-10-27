import { useRef, useState } from "react";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SessionDialog } from "@/components/shared/SessionDialog";
const categories = [
  "Inappropriate content",
  "Rights concern",
  "Content accuracy",
  "Technical issue",
  "Other",
];
export function ReportContent({
  kind,
  contentId,
  buttonLabel = "Report this item",
  compact = false,
}: {
  kind: string;
  contentId: string;
  buttonLabel?: string;
  compact?: boolean;
}) {
  const context = useCustomerSession();
  return (
    <ReportContentForm
      key={[kind, contentId, context.session?.activeProfileId].join(":")}
      kind={kind}
      contentId={contentId}
      context={context}
      buttonLabel={buttonLabel}
      compact={compact}
    />
  );
}
function ReportContentForm({
  kind,
  contentId,
  context,
  buttonLabel,
  compact,
}: {
  kind: string;
  contentId: string;
  context: ReturnType<typeof useCustomerSession>;
  buttonLabel: string;
  compact: boolean;
}) {
  const { session, loading } = context;
  const [open, setOpen] = useState(false),
    [category, setCategory] = useState("Other"),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  const request = useRef<{ body: string; key: string } | null>(null);
  async function send() {
    setBusy(true);
    setError("");
    try {
      const body = { kind, contentId, category, note };
      const serialized = JSON.stringify(body);
      if (request.current?.body !== serialized)
        request.current = { body: serialized, key: crypto.randomUUID() };
      await customerApi("/moderation/reports", "POST", body, {
        "X-Profile-Context": session.activeProfileId,
        "Idempotency-Key": request.current!.key,
      });
      setDone(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your report could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={compact ? "" : "mt-5"}>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        {buttonLabel}
      </Button>
      {open && (
        <SessionDialog
          title={
            done
              ? "Your report is with us"
              : "Help keep MGTV a place worth coming back to"
          }
          onClose={() => setOpen(false)}
        >
          {done ? (
            <>
              <Text className="text-sm leading-relaxed text-text-secondary">
                Thanks for speaking up. Our team will review this item. A report
                does not automatically remove content or affect an account.
              </Text>
              <Button className="mt-5" onClick={() => setOpen(false)}>
                Done
              </Button>
            </>
          ) : !session ? (
            <>
              <Text className="text-sm text-text-secondary">
                Sign in and choose a profile to send a report.
              </Text>
              <ButtonLink className="mt-5" to="/auth/sign-in">
                Sign in
              </ButtonLink>
            </>
          ) : !session.activeProfileId ? (
            <>
              <Text>Choose a profile before reporting this item.</Text>
              <ButtonLink className="mt-5" to="/profiles">
                Choose profile
              </ButtonLink>
            </>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              {error && (
                <p role="alert" className="text-rose-300">
                  {error}
                </p>
              )}
              <p className="text-sm leading-relaxed text-text-secondary">
                Tell us what needs a closer look. Your note goes privately to
                the moderation team. One open report per account and item keeps
                repeat submissions from crowding the queue.
              </p>
              <label className="block space-y-2">
                <span>What’s the concern?</span>
                <select
                  className="w-full rounded-lg border border-text-muted/30 bg-bg-elevated p-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span>Add a note · optional</span>
                <textarea
                  className="w-full rounded-lg border border-text-muted/30 bg-bg-elevated p-3"
                  rows={4}
                  maxLength={2000}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="A timestamp or a short explanation helps our team review."
                />
              </label>
              <p className="text-xs text-text-secondary">
                Avoid passwords, payment details or other sensitive information.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Send report"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </SessionDialog>
      )}
    </div>
  );
}
