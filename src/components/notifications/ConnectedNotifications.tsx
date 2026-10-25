import {LoadingSkeleton} from "@/components/shared/LoadingSkeleton";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
const categories = ["Shows", "Movies", "Music", "Events", "Awards", "System"];
export function useNotifications() {
  const { session, loading: sessionLoading } = useCustomerSession();
  const [items, setItems] = useState<any[]>([]),
    [unread, setUnread] = useState(0),
    [cursor, setCursor] = useState<string | null>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const profile = session?.activeProfileId;
  const headers = () => ({ "X-Profile-Context": profile });
  async function refresh(after?: string) {
    if (!profile) return;
    setLoading(true);
    try {
      const r = await customerApi(
        "/notifications" + (after ? "?after=" + after : ""),
        "GET",
        undefined,
        headers(),
      );
      setItems((old) => (after ? [...old, ...r.items] : r.items));
      setUnread(r.unread);
      setCursor(r.nextCursor);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your feed could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    setItems([]);
    setUnread(0);
    setCursor(null);
    if (!profile) return;
    const load = async () => {
      try {
        const r = await customerApi("/notifications", "GET", undefined, {
          "X-Profile-Context": profile,
        });
        if (active) {
          setItems(r.items);
          setUnread(r.unread);
          setCursor(r.nextCursor);
          setError("");
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "The feed could not be loaded.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    setLoading(true);
    void load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 30000);
    window.addEventListener("mgtv-notifications", load);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("mgtv-notifications", load);
    };
  }, [profile]);
  async function read(ids: string[]) {
    try {
      if (!ids.length) return;
      for (let i = 0; i < ids.length; i += 100)
        await customerApi(
          "/notifications/read",
          "POST",
          { ids: ids.slice(i, i + 100) },
          headers(),
        );
      window.dispatchEvent(new Event("mgtv-notifications"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Read status could not be saved.",
      );
    }
  }
  return {
    session,
    sessionLoading,
    profile,
    items,
    unread,
    cursor,
    loading,
    error,
    refresh,
    read,
  };
}
export function ConnectedNotificationList({
  items,
  read,
  onOpen,
}: {
  items: any[];
  read: (ids: string[]) => Promise<void>;
  onOpen?: () => void;
}) {
  return items.length ? (
    <div>
      {items.map((n) => (
        <Link
          key={n.id}
          to={n.destination}
          onClick={() => {
            void read([n.id]);
            onOpen?.();
          }}
          className={
            "flex gap-4 border-b border-text-muted/20 px-5 py-5 transition-colors hover:bg-bg-elevated " +
            (!n.read_at ? "bg-gold-dim/30" : "")
          }
        >
          <div
            aria-hidden="true"
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-dim text-gold"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.5}
                d="M18 8a6 6 0 0 0-12 0v6l-2 3h16l-2-3V8Zm-8 12h4"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Text
                className={
                  "break-words text-sm font-semibold " +
                  (n.read_at ? "text-text-secondary" : "text-text-primary")
                }
              >
                {n.title}
              </Text>
              {!n.read_at && (
                <span className="shrink-0 text-xs text-gold">Unread</span>
              )}
            </div>
            <Text className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-text-secondary">
              {n.body}
            </Text>
            <Text className="mt-2 text-xs text-gold">
              {n.category} · {new Date(n.delivered_at).toLocaleDateString()}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div role="status" className="space-y-3 px-5 py-12">
      <Text as="h2" className="font-display text-2xl">
        No updates in this view.
      </Text>
      <Text className="text-sm text-text-secondary">
        Try another category or load more notices when available.
      </Text>
    </div>
  );
}
export function ConnectedNotificationFeed({
  panel = false,
  onClose,
}: {
  panel?: boolean;
  onClose?: () => void;
}) {
  const n = useNotifications();
  const [category, setCategory] = useState("All"),
    [unreadOnly, setUnreadOnly] = useState(false),
    [preferences, setPreferences] = useState(false);
  const items = n.items.filter(
    (i) =>
      (category === "All" || i.category === category) &&
      (!unreadOnly || !i.read_at),
  );
  if (n.sessionLoading)
    return (
      <LoadingSkeleton label="Checking your session…" variant="list" count={3}/>
    );
  if (!n.session)
    return (
      <div className="space-y-4 p-5">
        <Text>Sign in to catch your MGTV updates.</Text>
        <ButtonLink to="/auth/sign-in" onClick={onClose}>
          Sign in
        </ButtonLink>
      </div>
    );
  if (!n.profile)
    return (
      <div className="space-y-4 p-5">
        <Text>Choose a profile to open its notification feed.</Text>
        <ButtonLink to="/profiles" onClick={onClose}>
          Choose profile
        </ButtonLink>
      </div>
    );
  return (
    <>
      {!panel && (
        <>
          <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
            Stay close to what moves you
          </Text>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Text as="h1" className="font-display text-5xl">
              Notifications
            </Text>
            <Button
              variant="outline"
              disabled={!n.items.some((i) => !i.read_at)}
              onClick={() =>
                void n.read(n.items.filter((i) => !i.read_at).map((i) => i.id))
              }
            >
              Mark loaded notices as read
            </Button>
          </div>
          <p role="status" className="my-4 text-sm text-text-secondary">
            {n.unread} unread · {n.items.length} loaded
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {["All", ...categories].map((x) => (
              <Button
                key={x}
                size="sm"
                variant={category === x ? "primary" : "ghost"}
                aria-pressed={category === x}
                onClick={() => setCategory(x)}
              >
                {x}
              </Button>
            ))}
          </div>
          <div className="mb-5 flex flex-wrap justify-between gap-3">
            <Button
              variant="ghost"
              aria-pressed={unreadOnly}
              onClick={() => setUnreadOnly(!unreadOnly)}
            >
              Unread only: {unreadOnly ? "On" : "Off"}
            </Button>
            <Button
              variant="ghost"
              aria-expanded={preferences}
              onClick={() => setPreferences(!preferences)}
            >
              Notification preferences
            </Button>
          </div>
          {preferences && <NotificationPreferences />}
        </>
      )}
      {n.error && (
        <p role="alert" className="p-4 text-rose-300">
          {n.error}{" "}
          <button className="underline" onClick={() => void n.refresh()}>
            Try again
          </button>
        </p>
      )}
      {n.loading && !n.items.length && <LoadingSkeleton label="Loading your notification feed…" variant="list" count={panel?3:5}/>}
      {n.loading && !!n.items.length && (
        <p role="status" className="p-4">
          Refreshing your feed…
        </p>
      )}
      {!(n.loading && !n.items.length) && !(n.error && !n.items.length) && (
        <div className="overflow-hidden rounded-xl border border-text-muted/20 bg-bg-surface">
          <ConnectedNotificationList
            items={panel ? items.slice(0, 5) : items}
            read={n.read}
            onOpen={onClose}
          />
        </div>
      )}
      {!panel && n.cursor && (
        <Button
          className="mt-5"
          variant="outline"
          disabled={n.loading}
          onClick={() => void n.refresh(n.cursor!)}
        >
          Load more
        </Button>
      )}
      {panel && (
        <ButtonLink
          to="/notifications"
          onClick={onClose}
          variant="ghost"
          className="w-full"
        >
          View all notifications · {n.unread} unread
        </ButtonLink>
      )}
    </>
  );
}
export function NotificationPreferences() {
  const { session } = useCustomerSession();
  const [p, setP] = useState<any>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const h = () => ({ "X-Profile-Context": session.activeProfileId });
  useEffect(() => {
    let active = true;
    setP(null);
    if (session?.activeProfileId)
      void customerApi("/notifications/preferences", "GET", undefined, h())
        .then((r) => {
          if (active) setP(r);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });
    return () => {
      active = false;
    };
  }, [session?.activeProfileId]);
  async function save() {
    setBusy(true);
    setError("");
    try {
      const r = await customerApi(
        "/notifications/preferences",
        "PATCH",
        { inApp: p.in_app, email: p.email, categories: p.categories },
        { ...h(), "If-Match": '"v' + p.version + '"' },
      );
      setP(r);
      setNotice("Your notification preferences are saved.");
      window.dispatchEvent(new Event("mgtv-notifications"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Preferences could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mb-6 space-y-4 rounded-xl border border-text-muted/20 bg-bg-surface p-5">
      <Text as="h2" className="font-display text-2xl">
        Your updates, your way
      </Text>
      {error && (
        <p role="alert" className="text-rose-300">
          {error}{" "}
          <Link className="underline" to="/account">
            Account verification
          </Link>
        </p>
      )}
      {notice && (
        <p role="status" className="text-gold">
          {notice}
        </p>
      )}
      {p ? (
        <>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={p.in_app}
              onChange={(e) => setP({ ...p, in_app: e.target.checked })}
            />
            In-app updates for this profile
          </label>
          <fieldset className="flex flex-wrap gap-4">
            <legend className="mb-3 text-sm text-text-secondary">
              Choose what reaches you
            </legend>
            {categories.map((x) => (
              <label key={x} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.categories.includes(x)}
                  onChange={() =>
                    setP({
                      ...p,
                      categories: p.categories.includes(x)
                        ? p.categories.filter((c: string) => c !== x)
                        : [...p.categories, x],
                    })
                  }
                />
                {x}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              disabled={!p.canManageEmail}
              checked={p.email}
              onChange={(e) => setP({ ...p, email: e.target.checked })}
            />
            Email updates · development inbox
          </label>
          <p className="text-xs leading-relaxed text-text-secondary">
            Email defaults to off. Only the main adult profile can manage
            account email; changing it requires recent password or parental PIN
            verification in Account & security. Browser push is not available
            yet. These settings affect future deliveries.
          </p>
          <Button disabled={busy} onClick={() => void save()}>
            Save preferences
          </Button>
        </>
      ) : (
        !error && <p role="status">Loading preferences…</p>
      )}
    </section>
  );
}
