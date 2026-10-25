import { useEffect, useState } from "react";
import { useCustomerSession, customerApi } from "@/lib/customerAuth";
import { addCommerceItem, money } from "@/lib/commerce";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
export default function EventTickets({ id }: { id: string }) {
  const { session, loading, error: authError } = useCustomerSession();
  const selectedProfile = session?.activeProfileId;
  const [offer, setOffer] = useState<any>(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    setOffer(null);
    setError("");
    if (loading || authError || (session && !selectedProfile)) return;
    const load = session
      ? customerApi("/events/" + id + "/tickets")
      : fetch("/api/v1/catalog/events/" + id + "/tickets", {
          credentials: "include",
        }).then(async (r) => {
          const b = await r.json();
          if (!r.ok) throw Error(b.message ?? "Tickets unavailable.");
          return b;
        });
    void load
      .then((o) => {
        if (live) setOffer(o);
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [id, session, selectedProfile, loading, authError, revision]);
  if (loading)
    return (
      <LoadingSkeleton
        variant="list"
        count={2}
        label="Checking ticket access…"
      />
    );
  if (authError) return <p role="alert">{authError}</p>;
  if (session && !selectedProfile)
    return (
      <ButtonLink to="/profiles">
        Choose your profile for ticket options
      </ButtonLink>
    );
  return (
    <section
      aria-label="Event tickets"
      className="my-8 rounded-xl border border-gold/25 bg-bg-surface p-5 min-w-0"
    >
      <p className="text-xs uppercase tracking-widest text-gold">
        Make it a moment
      </p>
      <h2 className="font-display text-3xl my-3">Your place in the crowd</h2>
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <Button variant="outline" onClick={() => setRevision((n) => n + 1)}>
            Try ticket options again
          </Button>
        </div>
      ) : !offer ? (
        <LoadingSkeleton
          variant="list"
          count={2}
          label="Loading ticket options…"
        />
      ) : !offer.options.length ? (
        <p className="text-sm text-text-secondary">
          MGTV ticket sales are not configured for this event. Check the event
          details for external ticket or registration information.
        </p>
      ) : (
        <>
          <p className="text-sm text-text-secondary mb-4">
            General admission · Jamaica dollars. Sandbox checkout only; no real
            funds move. A ticket does not unlock streaming or a replay.
          </p>
          <div className="space-y-4">
            {offer.options.map((o: any) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-4"
              >
                <div>
                  <h3 className="font-semibold">{o.label}</h3>
                  <p className="text-gold">
                    {money(o.priceMinor)}{" "}
                    <span className="text-xs text-text-secondary">
                      before provisional tax
                    </span>
                  </p>
                  <p className="text-xs">
                    {o.available > 0
                      ? o.available + " available"
                      : "Not currently available"}
                  </p>
                </div>
                <Button
                  disabled={busy || o.available < 1}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await addCommerceItem(o.id, 1, !!session);
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Add ticket
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary">
            Tickets are reserved only at checkout and issued after verified
            payment. Sign in and choose an adult profile to check out. Keep each
            admission code private.
          </p>
        </>
      )}
    </section>
  );
}
