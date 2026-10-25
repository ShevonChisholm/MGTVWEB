import { useEffect, useState } from "react";
import { Text } from "@/components/ui/Text";
import { Button, ButtonLink } from "@/components/ui/Button";
export function SubscriptionTiersPage() {
  const [tiers, setTiers] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    void fetch("/api/v1/catalog/subscription-tiers")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw Error(
            body.message ?? "Subscription tiers could not be loaded.",
          );
        return body;
      })
      .then((value) => {
        if (active)
          setTiers(
            value.sort((a: any, b: any) => a.maxProfiles - b.maxProfiles),
          );
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
          MGTV subscriptions
        </p>
        <Text as="h1" className="mb-5 font-display text-5xl md:text-7xl">
          Find your kind of gold.
        </Text>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Three ways to make room for your people. Profile and quality limits
          follow your account; each premium film lists which tiers can watch.
        </p>
        {busy ? (
          <p role="status">Loading subscription tiers…</p>
        ) : error ? (
          <div role="alert">
            <p className="mb-4">{error}</p>
            <Button onClick={() => setRevision((x) => x + 1)}>Try again</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.id}
                className={`flex flex-col rounded-2xl border bg-bg-surface p-7 ${tier.code === "gold" ? "border-gold/60" : "border-text-muted/25"}`}
              >
                <Text as="h2" className="mb-5 font-display text-4xl text-gold">
                  {tier.name}
                </Text>
                <ul className="mb-6 space-y-4 text-sm text-text-secondary">
                  <li>
                    {tier.maxProfiles} profile
                    {tier.maxProfiles === 1 ? "" : "s"}
                  </li>
                  <li>
                    Up to{" "}
                    {tier.maxVideoHeight === 2160
                      ? "4K"
                      : tier.maxVideoHeight + "p"}{" "}
                    where available
                  </li>
                  <li>
                    {tier.adPolicy === "none"
                      ? "No ads"
                      : tier.adPolicy === "reduced"
                        ? "Reduced ads"
                        : "Standard ads"}{" "}
                    · planned delivery
                  </li>
                  {tier.earlyEventNotices && (
                    <li>
                      Early event notices · coming with event notifications
                    </li>
                  )}
                </ul>
                <ButtonLink
                  to="/account#subscriptions"
                  variant={tier.code === "gold" ? "primary" : "outline"}
                  className="mt-auto"
                >
                  View my access
                </ButtonLink>
              </article>
            ))}
          </div>
        )}
        <div className="mt-10 rounded-xl border border-text-muted/25 p-6">
          <Text as="h2" className="mb-3 text-xl">
            Start with a free film.
          </Text>
          <p className="mb-5 text-sm text-text-secondary">
            An account without an active subscription includes one profile for
            free full films. Guests can watch available previews. Subscription
            activation, ad delivery and event notifications are not connected
            yet; selecting a tier does not activate access.
          </p>
          <ButtonLink to="/movies" variant="outline">
            All movies
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
