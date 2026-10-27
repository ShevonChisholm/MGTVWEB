import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router";
import {
  customerApi,
  useCustomerSession,
  CustomerAuthError,
  getCustomerSession,
} from "@/lib/customerAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/LoadingSkeleton";
import { SessionDialog } from "@/components/shared/SessionDialog";
import { ReportContent } from "@/components/moderation/ReportContent";
type Comment = {
  id: string;
  parentId: string | null;
  body: string;
  spoiler: boolean;
  status: string;
  version: number;
  edited: boolean;
  createdAt: string;
  author: { name: string; avatar: string; own: boolean };
  likes: number;
  liked: boolean;
  replyCount: number;
};
type Page = {
  items: Comment[];
  nextCursor: string | null;
  locked: boolean;
  version: number;
};
export function CommentsSection({
  kind,
  contentId,
}: {
  kind: "movie" | "episode" | "music";
  contentId: string;
}) {
  const auth = useCustomerSession();
  return (
    <Discussion
      key={[
        kind,
        contentId,
        auth.session?.activeProfileId,
        !!auth.session,
      ].join(":")}
      kind={kind}
      contentId={contentId}
      auth={auth}
    />
  );
}
function Discussion({
  kind,
  contentId,
  auth,
}: {
  kind: string;
  contentId: string;
  auth: ReturnType<typeof useCustomerSession>;
}) {
  const location = useLocation(),
    node = useRef<HTMLElement>(null),
    [near, setNear] = useState(false),
    [page, setPage] = useState<Page | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [denied, setDenied] = useState(false),
    [denialCode, setDenialCode] = useState(""),
    [revision, setRevision] = useState(0),
    [moreBusy, setMoreBusy] = useState(false);
  const profile = auth.session?.activeProfileId,
    path = "/discussions/" + kind + "/" + contentId,
    headers = { "X-Profile-Context": profile ?? "" };
  function readFailed(error: unknown) {
    const e = error as Error;
    setPage(null);
    setError(e.message);
    setDenied(error instanceof CustomerAuthError && error.status === 403);
    setDenialCode(error instanceof CustomerAuthError ? (error.code ?? "") : "");
  }
  useEffect(() => {
    if (!node.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let active = true;
    if (!near || auth.loading || !profile) return;
    setError("");
    setDenied(false);
    setDenialCode("");
    if (!page) setLoading(true);
    void customerApi(path, "GET", undefined, headers)
      .then((data) => {
        if (active) setPage(data);
      })
      .catch((e) => {
        if (active) {
          readFailed(e);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [near, auth.loading, profile, path, revision]);
  async function more() {
    if (!page?.nextCursor) return;
    setMoreBusy(true);
    setError("");
    try {
      const data = await customerApi(
        path + "?after=" + encodeURIComponent(page.nextCursor),
        "GET",
        undefined,
        headers,
      );
      setPage({
        ...data,
        items: [
          ...page.items,
          ...data.items.filter(
            (c: Comment) => !page.items.some((old) => old.id === c.id),
          ),
        ],
      });
    } catch (e) {
      readFailed(e);
    } finally {
      setMoreBusy(false);
    }
  }
  const refresh = () => setRevision((n) => n + 1),
    returnTo = encodeURIComponent(location.pathname + location.search);
  return (
    <section
      ref={node}
      aria-label="Conversation"
      className="my-12 min-w-0 border-t border-gold/20 pt-9"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-gold">
            Your take belongs here
          </p>
          <h2 className="font-display text-3xl md:text-4xl">
            Keep the conversation going.
          </h2>
        </div>
        {profile && (
          <Button
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={refresh}
          >
            Refresh conversation
          </Button>
        )}
      </div>
      {auth.loading ? (
        <div
          role="status"
          aria-label="Checking discussion access"
          className="mgtv-skeleton min-h-48 rounded-xl"
        />
      ) : auth.error ? (
        <ErrorState
          message={auth.error}
          onRetry={() => {
            void getCustomerSession()
              .then(() => refresh())
              .catch(() => {});
          }}
        />
      ) : !auth.session ? (
        <div className="rounded-xl border border-gold/20 bg-bg-surface p-6">
          <p className="mb-5 text-sm text-text-secondary">
            Sign in with an adult profile to read and join the conversation.
          </p>
          <ButtonLink to={"/auth/sign-in?returnTo=" + returnTo}>
            Sign in to join
          </ButtonLink>
        </div>
      ) : !profile ? (
        <ButtonLink to={"/profiles?returnTo=" + returnTo}>
          Choose an adult profile
        </ButtonLink>
      ) : error && (!page || denied) ? (
        <div>
          {denied ? (
            <div className="rounded-xl border border-gold/20 bg-bg-surface p-6">
              <h3 className="font-display text-2xl">One more step to join.</h3>
              <p className="mt-3 text-sm text-text-secondary">{error}</p>
            </div>
          ) : (
            <ErrorState message={error} onRetry={refresh} />
          )}
          {denied && (
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                variant="outline"
                to={"/profiles?returnTo=" + returnTo}
              >
                {denialCode === "ADULT_DISCUSSION_REQUIRED"
                  ? "Choose an adult profile"
                  : "Choose a profile"}
              </ButtonLink>
              {["SUBSCRIPTION_REQUIRED", "PROFILE_TIER_LIMIT"].includes(
                denialCode,
              ) && (
                <ButtonLink variant="outline" to="/mgtv-plus">
                  Explore MGTV+
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      ) : loading || !page ? (
        <div
          role="status"
          aria-label="Loading conversation"
          className="min-h-96 space-y-5"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              className="flex gap-4 rounded-xl border border-gold/10 p-5"
            >
              <div className="mgtv-skeleton h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="mgtv-skeleton h-4 w-32" />
                <div className="mgtv-skeleton h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-96">
          {page.locked ? (
            <p className="mb-7 rounded-xl border border-gold/25 bg-bg-surface p-5 text-sm text-text-secondary">
              MGTV has paused this conversation. You can still read, report or
              remove your own comments.
            </p>
          ) : (
            <CommentForm
              label="Your comment"
              submitLabel="Post comment"
              onSubmit={async (body) => {
                const { key, ...payload } = body;
                await customerApi(path + "/comments", "POST", payload, {
                  ...headers,
                  "Idempotency-Key": key,
                });
                refresh();
              }}
            />
          )}
          <p className="my-6 text-xs uppercase tracking-widest text-text-muted">
            Newest first · Text only · Keep it respectful
          </p>
          {error && <ErrorState message={error} onRetry={refresh} />}
          <div className="space-y-5">
            {page.items.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                profile={profile}
                path={path}
                locked={page.locked}
                onChange={refresh}
              />
            ))}
          </div>
          {!page.items.length && (
            <p className="rounded-xl border border-gold/10 p-6 text-sm text-text-secondary">
              The first word is yours. Share a thought about this release.
            </p>
          )}
          {page.nextCursor && (
            <Button
              className="mt-6"
              variant="outline"
              disabled={moreBusy}
              onClick={() => void more()}
            >
              {moreBusy ? "Loading comments…" : "Load more comments"}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
function CommentForm({
  label,
  submitLabel,
  initial,
  onSubmit,
  onCancel,
}: {
  label: string;
  submitLabel: string;
  initial?: Comment;
  onSubmit: (b: {
    body: string;
    spoiler: boolean;
    key: string;
  }) => Promise<void>;
  onCancel?: () => void;
}) {
  const id = useId(),
    [body, setBody] = useState(initial?.body ?? ""),
    [spoiler, setSpoiler] = useState(initial?.spoiler ?? false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const pending = useRef<{ text: string; key: string } | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const text = JSON.stringify([body.trim(), spoiler]);
      if (pending.current?.text !== text)
        pending.current = { text, key: crypto.randomUUID() };
      await onSubmit({ body: body.trim(), spoiler, key: pending.current!.key });
      pending.current = null;
      if (!initial) {
        setBody("");
        setSpoiler(false);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="min-w-0 rounded-xl border border-gold/20 bg-bg-surface p-5"
    >
      <label htmlFor={id} className="mb-3 block text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        maxLength={2000}
        required
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={busy}
        className="w-full resize-y rounded-lg border border-text-muted/30 bg-bg-base p-3 text-sm text-text-primary focus:border-gold focus:outline-none"
        placeholder="A moment that stayed with you, a favourite detail, a fresh perspective…"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={spoiler}
            disabled={busy}
            onChange={(e) => setSpoiler(e.target.checked)}
          />
          This contains spoilers
        </label>
        <span className="text-xs text-text-muted">{body.length}/2000</span>
      </div>
      {error && (
        <p role="alert" className="mt-3 break-words text-sm text-rose-200">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" type="submit" disabled={busy || !body.trim()}>
          {busy ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
const avatarColors: Record<string, string> = {
  gold: "#c9a84c",
  blue: "#4d8bbb",
  coral: "#d77363",
  jade: "#438b73",
  purple: "#8b66b4",
};
function CommentItem({
  comment,
  profile,
  path,
  locked,
  onChange,
  reply = false,
}: {
  comment: Comment;
  profile: string;
  path: string;
  locked: boolean;
  onChange: () => void;
  reply?: boolean;
}) {
  const [local, setLocal] = useState(comment),
    [revealed, setRevealed] = useState(0),
    [editing, setEditing] = useState(false),
    [replying, setReplying] = useState(false),
    [deleting, setDeleting] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [replies, setReplies] = useState<Page | null>(null),
    [showReplies, setShowReplies] = useState(false),
    [replyBusy, setReplyBusy] = useState(false);
  useEffect(() => setLocal(comment), [comment]);
  const row = comment.version > local.version ? comment : local,
    headers = { "X-Profile-Context": profile },
    base = "/discussions/comments/" + row.id,
    hidden = row.spoiler && revealed !== row.version;
  async function mutate(work: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function fetchReplies(more = false) {
    setReplyBusy(true);
    setError("");
    try {
      const page = await customerApi(
        path +
          "?parentId=" +
          row.id +
          (more && replies?.nextCursor
            ? "&after=" + encodeURIComponent(replies.nextCursor)
            : ""),
        "GET",
        undefined,
        headers,
      );
      setReplies(
        more && replies
          ? { ...page, items: [...replies.items, ...page.items] }
          : page,
      );
      setShowReplies(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setReplyBusy(false);
    }
  }
  return (
    <article
      id={"comment-" + row.id}
      className={
        reply
          ? "min-w-0 rounded-lg border border-gold/10 bg-bg-surface/50 p-4"
          : "min-w-0 rounded-xl border border-gold/15 bg-bg-surface p-5"
      }
    >
      <div className="flex min-w-0 gap-3">
        <div
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-black"
          style={{
            backgroundColor:
              avatarColors[row.author.avatar] ?? avatarColors.gold,
          }}
        >
          {row.author.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm font-semibold">
              {row.author.name}
              {row.author.own ? " · You" : ""}
            </span>
            <time dateTime={row.createdAt} className="text-xs text-text-muted">
              {new Date(row.createdAt).toLocaleDateString()}
            </time>
            {row.edited && (
              <span className="text-xs text-text-muted">Edited</span>
            )}
          </div>
          {editing ? (
            <div className="mt-4">
              <CommentForm
                label="Edit comment"
                submitLabel="Save changes"
                initial={row}
                onCancel={() => setEditing(false)}
                onSubmit={async (b) => {
                  const { key, ...body } = b;
                  const result = await customerApi(base, "PATCH", body, {
                    ...headers,
                    "If-Match": `"v${row.version}"`,
                  });
                  setLocal(result);
                  setEditing(false);
                  onChange();
                }}
              />
            </div>
          ) : row.status !== "active" ? (
            <p className="mt-3 text-sm italic text-text-muted">
              {row.status === "removed"
                ? "This comment was removed by MGTV."
                : "This comment was deleted."}
            </p>
          ) : hidden ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => setRevealed(row.version)}
            >
              Reveal spoiler
            </Button>
          ) : (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">
              {row.body}
            </p>
          )}
          {row.status === "active" && !editing && (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={row.liked}
                disabled={busy || locked}
                onClick={() =>
                  void mutate(async () =>
                    setLocal(
                      await customerApi(
                        base + "/like",
                        "PUT",
                        { liked: !row.liked },
                        headers,
                      ),
                    ),
                  )
                }
              >
                {row.liked ? "Liked" : "Like"}
                {row.likes ? ` · ${row.likes}` : ""}
              </Button>
              {!reply && !hidden && !locked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplying(!replying)}
                >
                  Reply
                </Button>
              )}
              {row.author.own && (
                <>
                  {!locked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => setDeleting(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
              <ReportContent
                kind="comment"
                contentId={row.id}
                buttonLabel="Report comment"
                compact
              />
            </div>
          )}
          {error && (
            <p role="alert" className="mt-3 break-words text-sm text-rose-200">
              {error}
            </p>
          )}
          {!reply && (!hidden || row.status !== "active") && (
            <>
              {replying && !locked && row.status === "active" && (
                <div className="mt-5">
                  <CommentForm
                    label="Your reply"
                    submitLabel="Post reply"
                    onCancel={() => setReplying(false)}
                    onSubmit={async (b) => {
                      const { key, ...body } = b;
                      await customerApi(
                        path + "/comments",
                        "POST",
                        { ...body, parentId: row.id },
                        { ...headers, "Idempotency-Key": key },
                      );
                      setReplying(false);
                      await fetchReplies();
                      onChange();
                    }}
                  />
                </div>
              )}
              {row.replyCount > 0 && (
                <Button
                  className="mt-3"
                  variant="ghost"
                  size="sm"
                  disabled={replyBusy}
                  onClick={() => {
                    if (showReplies) setShowReplies(false);
                    else void fetchReplies();
                  }}
                >
                  {replyBusy
                    ? "Loading replies…"
                    : showReplies
                      ? "Hide replies"
                      : `View replies · ${row.replyCount}`}
                </Button>
              )}
              {showReplies && replies && (
                <div className="mt-4 space-y-4">
                  {replies.items.map((item) => (
                    <CommentItem
                      key={item.id}
                      comment={item}
                      profile={profile}
                      path={path}
                      locked={locked}
                      reply
                      onChange={() => {
                        void fetchReplies();
                        onChange();
                      }}
                    />
                  ))}
                  {replies.nextCursor && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={replyBusy}
                      onClick={() => void fetchReplies(true)}
                    >
                      Load more replies
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {deleting && (
        <SessionDialog
          title="Delete your comment?"
          onClose={() => {
            if (!busy) setDeleting(false);
          }}
        >
          <p className="mb-5 text-sm text-text-secondary">
            Your comment will leave the conversation. Any replies will remain.
          </p>
          {error && (
            <p role="alert" className="mb-4 text-sm text-rose-200">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              disabled={busy}
              onClick={() =>
                void mutate(async () => {
                  setLocal(
                    await customerApi(base, "DELETE", undefined, {
                      ...headers,
                      "If-Match": `"v${row.version}"`,
                    }),
                  );
                  setDeleting(false);
                  onChange();
                })
              }
            >
              Delete comment
            </Button>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => setDeleting(false)}
            >
              Keep comment
            </Button>
          </div>
        </SessionDialog>
      )}
    </article>
  );
}
