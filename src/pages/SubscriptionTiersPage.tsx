import { useEffect, useState } from "react";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { Text } from "@/components/ui/Text";
import { Button, ButtonLink } from "@/components/ui/Button";
export function SubscriptionTiersPage() {
  const { session, loading: sessionLoading } = useCustomerSession();
  const [billing, setBilling] = useState<{
    enabled: boolean;
    items: { code: string; amountMinor: number }[];
  } | null>(null);
  const [purchasing, setPurchasing] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentRetry, setPaymentRetry] = useState(0);
  useEffect(() => {
    const checkout = new URLSearchParams(window.location.search).get(
      "checkout",
    );
    if (!checkout || !session) return;
    let active = true,
      timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const check = async () => {
      try {
        const state = await customerApi(
          "/subscriptions/checkouts/" + encodeURIComponent(checkout),
        );
        if (!active) return;
        setPaymentError("");
        if (state.status === "paid") {
          setPaymentMessage(
            "Payment verified. Your month of MGTV access is ready or scheduled after your current access.",
          );
          return;
        }
        if (state.status === "expired") {
          setPaymentMessage(
            "This checkout expired. You can choose a tier to start again.",
          );
          return;
        }
        if (state.status === "revoked") {
          setPaymentMessage(
            "Access from this payment has been revoked. Contact MGTV for help.",
          );
          return;
        }
        setPaymentMessage(
          state.status === "review"
            ? "This payment needs review. Your existing attempt is preserved; do not start a replacement payment."
            : "Your payment is not confirmed yet. Returning here does not activate access.",
        );
        if (++attempts < 10) timer = setTimeout(() => void check(), 3000);
      } catch (error) {
        if (active)
          setPaymentError(
            error instanceof Error
              ? error.message
              : "Payment status could not be checked.",
          );
      }
    };
    void check();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [session?.account?.id, paymentRetry]);
  async function purchase(code: string) {
    setPurchasing(code);
    setPaymentError("");
    try {
      const result = await customerApi("/subscriptions/checkout", "POST", {
        tier: code,
      });
      const url = new URL(result.url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com")
        throw Error("Unexpected checkout address.");
      window.location.assign(url.href);
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Checkout could not be started.",
      );
      setPurchasing("");
    }
  }
  const [tiers, setTiers] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    void Promise.all([
      fetch("/api/v1/catalog/subscription-tiers", {
        signal: AbortSignal.timeout(15000),
      }),
      fetch("/api/v1/catalog/subscription-billing", {
        signal: AbortSignal.timeout(15000),
      }),
    ])
      .then(async ([response, billingResponse]) => {
        const billingBody = await billingResponse.json();
        if (!billingResponse.ok)
          throw Error(
            billingBody.message ?? "Billing information could not be loaded.",
          );
        if (active) setBilling(billingBody);
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
        {paymentMessage && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-gold/30 p-4 text-sm"
          >
            {paymentMessage}{" "}
            <Button
              variant="ghost"
              onClick={() => setPaymentRetry((value) => value + 1)}
            >
              Check again
            </Button>{" "}
            <ButtonLink to="/account#subscriptions" variant="ghost">
              View my access
            </ButtonLink>
          </p>
        )}
        {paymentError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-rose-400/40 p-4 text-sm"
          >
            <p>{paymentError}</p>
            <ButtonLink to="/account" variant="ghost">
              Sign in, select an adult profile or verify your account
            </ButtonLink>
          </div>
        )}
        {busy ? (
          <div
            role="status"
            aria-label="Loading subscription tiers"
            className="grid gap-6 md:grid-cols-3"
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="min-h-[420px] animate-pulse rounded-2xl border border-text-muted/25 bg-bg-surface p-7"
              >
                <div className="mb-6 h-10 w-28 rounded bg-white/10" />
                <div className="mb-8 h-8 w-40 rounded bg-white/10" />
                {[0, 1, 2, 3].map((line) => (
                  <div
                    key={line}
                    className="mb-5 h-4 w-3/4 rounded bg-white/10"
                  />
                ))}
              </div>
            ))}
          </div>
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
                <p className="mb-6 text-2xl font-semibold">
                  {new Intl.NumberFormat("en-JM", {
                    style: "currency",
                    currency: "JMD",
                    currencyDisplay: "code",
                    maximumFractionDigits: 0,
                  }).format(
                    (billing?.items.find((item) => item.code === tier.code)
                      ?.amountMinor ?? 0) / 100,
                  )}
                  <span className="ml-2 text-sm font-normal text-text-secondary">
                    per month
                  </span>
                </p>
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
                  </li>
                  {tier.earlyEventNotices && (
                    <li>Event first looks, 48 hours ahead</li>
                  )}
                </ul>
                {billing?.enabled && session ? (
                  <Button
                    onClick={() => void purchase(tier.code)}
                    disabled={!!purchasing || sessionLoading}
                    variant={tier.code === "gold" ? "primary" : "outline"}
                    className="mt-auto"
                  >
                    {purchasing === tier.code
                      ? "Opening secure checkout…"
                      : "Get one month"}
                  </Button>
                ) : (
                  <ButtonLink
                    to="/account#subscriptions"
                    variant={tier.code === "gold" ? "primary" : "outline"}
                    className="mt-auto"
                  >
                    {billing?.enabled ? "Sign in to choose" : "View my access"}
                  </ButtonLink>
                )}
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                  {billing?.enabled
                    ? "Stripe sandbox · test payments only. One calendar month. Renew when you choose; no automatic charges."
                    : "Checkout is being prepared. Choosing a tier does not activate access."}
                </p>
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
            free full films. Guests can watch available previews. Paid access
            starts only after payment verification. A new tier starts after
            existing paid access ends; early renewals preserve your remaining
            time.
          </p>
          <ButtonLink to="/movies" variant="outline">
            All movies
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
