import { useEffect, useState } from "react";
import { customerApi } from "@/lib/customerAuth";
import { Text } from "@/components/ui/Text";
import { ButtonLink } from "@/components/ui/Button";
export function SubscriptionAccess() {
  const [state, setState] = useState<any>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void customerApi("/subscriptions")
      .then((value) => {
        if (active) setState(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section
      id="subscriptions"
      className="mb-8 rounded-2xl border border-text-muted/25 bg-bg-surface p-5 md:p-8"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">
        Your access
      </p>
      <Text as="h2" className="text-2xl">
        Room for your kind of viewing
      </Text>
      {error ? (
        <p role="alert" className="mt-4 text-rose-300">
          {error}
        </p>
      ) : !state ? (
        <p role="status" className="mt-4 text-sm text-text-secondary">
          Checking subscription access…
        </p>
      ) : (
        <>
          <p className="mb-4 mt-3 text-sm text-text-secondary">
            {state.entitlements.profileLimit} profile
            {state.entitlements.profileLimit === 1 ? "" : "s"} · Up to{" "}
            {state.entitlements.maxVideoHeight === 2160
              ? "4K"
              : state.entitlements.maxVideoHeight + "p"}{" "}
            where a matching video is available
          </p>
          {state.items
            .filter((item: any) => item.accessActive === true)
            .map((item: any) => (
              <div
                key={item.id}
                className="mb-3 rounded-lg border border-gold/30 p-4"
              >
                <strong className="text-gold">{item.tierName}</strong>
                <p className="mt-1 text-sm text-text-secondary">
                  Active until {new Date(item.endsAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          {!state.items.some((item: any) => item.accessActive === true) && (
            <p className="mb-4 text-sm text-text-secondary">
              Free titles and guest previews are available. Premium full-length content
              need an eligible active subscription.
            </p>
          )}
          <ButtonLink to="/mgtv-plus" variant="outline">
            Explore MGTV tiers
          </ButtonLink>
          <p className="mt-4 text-xs leading-relaxed text-text-secondary">
            Subscription activation is not connected yet. Staff cannot grant
            subscriptions. Ad delivery follows your tier. Eligible early event updates appear in your notification feed when MGTV sends them.
          </p>
        </>
      )}
    </section>
  );
}
