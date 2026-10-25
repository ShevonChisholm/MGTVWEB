import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { customerApi, useCustomerSession } from "@/lib/customerAuth";
import { commerceMutation, money } from "@/lib/commerce";
import { Button, ButtonLink } from "@/components/ui/Button";
export function CommerceOrders() {
  const { session, loading } = useCustomerSession();
  const [params] = useSearchParams();
  const [items, setItems] = useState<any[]>([]),
    [selected, setSelected] = useState<any>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [dataLoading, setDataLoading] = useState(true),
    [revision, setRevision] = useState(0);
  async function refresh() {
    setItems(await customerApi("/commerce/orders"));
  }
  useEffect(() => {
    let live = true;
    setSelected(null);
    setItems([]);
    setError("");
    setDataLoading(!!session);
    if (session)
      customerApi("/commerce/orders")
        .then((r) => {
          if (live) {
            setItems(r);
            const id = params.get("order");
            if (id) void view(id);
          }
        })
        .catch((e) => {
          if (live) setError(e.message);
        })
        .finally(() => {
          if (live) setDataLoading(false);
        });
    return () => {
      live = false;
    };
  }, [session, revision]);
  async function view(id: string) {
    setError("");
    try {
      setSelected(await customerApi("/commerce/orders/" + id));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-16 min-h-screen">
      <h1 className="font-display text-5xl mb-8">Your Orders</h1>
      <p className="text-sm text-text-secondary mb-6">
        Sandbox orders only. No real money moves. Use only WiPay test cards.
      </p>
      {error && (
        <ErrorState message={error} onRetry={() => setRevision((n) => n + 1)} />
      )}
      {loading ? (
        <LoadingSkeleton
          label="Checking your session…"
          variant="list"
          count={3}
        />
      ) : !session ? (
        <ButtonLink to="/auth/sign-in">Sign in to view orders</ButtonLink>
      ) : (
        <>
          {dataLoading && !items.length && (
            <LoadingSkeleton
              label="Loading your orders…"
              variant="list"
              count={3}
            />
          )}
          {!dataLoading && !error && !items.length && (
            <p>
              No orders yet.{" "}
              <Link className="text-gold" to="/shop">
                Explore the shop
              </Link>
            </p>
          )}
          <div className="space-y-3">
            {items.map((o) => (
              <button
                className="w-full text-left bg-[#111] p-5 flex flex-wrap justify-between gap-3"
                key={o.id}
                onClick={() => void view(o.id)}
              >
                <span className="break-all">{o.id}</span>
                <span className="capitalize">
                  {o.status.replaceAll("_", " ")}
                </span>
                <span className="text-gold">{money(o.total_minor)}</span>
              </button>
            ))}
          </div>
          {selected && (
            <section className="mt-8 p-6 border border-white/20">
              <h2 className="font-display text-3xl">Order details</h2>
              <p className="capitalize my-3">
                {selected.effective_status.replaceAll("_", " ")}
              </p>
              {selected.items.map((i: any) => (
                <p key={i.option_id}>
                  {i.quantity} × {i.name} · {i.option_label} ·{" "}
                  {money(i.quantity * i.unit_price_minor)}
                </p>
              ))}
              <p className="text-gold mt-4">
                Total {money(selected.total_minor)}
              </p>
              {selected.effective_status === "awaiting_payment" && (
                <>
                  <p className="my-4 text-sm">
                    Payment not completed. Reservation expires{" "}
                    {new Date(selected.expires_at).toLocaleString()}.
                  </p>
                  <Button
                    disabled={busy || selected.admissions?.some((a:any)=>a.needsReview)}
                    className="mb-4 mr-3"
                    onClick={() => {
                      setBusy(true);
                      setError("");
                      void commerceMutation(
                        "/orders/" + selected.id + "/payment",
                        {},
                      )
                        .then((r) => {
                          const url = new URL(r.checkoutUrl);
                          if (url.origin !== "https://jmsb.wipayfinancial.com")
                            throw Error("Unexpected payment destination.");
                          window.location.assign(url.toString());
                        })
                        .catch((e) => setError(e.message))
                        .finally(() => setBusy(false));
                    }}
                  >
                    Continue to WiPay sandbox
                  </Button>
                  <Button
                    disabled={busy}
                    variant="outline"
                    onClick={() => {
                      setBusy(true);
                      void customerApi(
                        "/commerce/orders/" + selected.id + "/cancel",
                        "POST",
                        {
                          action: "cancel",
                          reason: "Customer cancelled unpaid reservation",
                        },
                        {
                          "Idempotency-Key": crypto.randomUUID(),
                          "If-Match": '\"v' + selected.version + '\"',
                        },
                      )
                        .then(() => view(selected.id))
                        .then(refresh)
                        .catch((e) => setError(e.message))
                        .finally(() => setBusy(false));
                    }}
                  >
                    Cancel reservation
                  </Button>
                </>
              )}
              {!!selected.admissions?.length && <section className="my-6 space-y-4" aria-label="Event admissions"><h3 className="font-display text-2xl">Your event tickets</h3>{selected.admissions.map((a:any)=><article key={a.optionId} className="border border-gold/25 rounded-xl p-4"><h4 className="font-semibold">{a.title}</h4><p className="text-sm">{new Date(a.startsAt).toLocaleString('en-JM',{timeZone:a.timezone})} · {a.timezone}</p><p className="text-sm">{a.venue}</p>{a.needsReview&&<p role="alert" className="text-amber-300 mt-2">{a.reason}</p>}{selected.tickets?.filter((t:any)=>t.option_id===a.optionId).map((t:any)=><div key={t.id} className="mt-4 border-t border-white/10 pt-3"><p>Admission {t.ordinal} · {t.checked_in_at?'Checked in':'Keep this code private'}</p><code className="block select-all break-all text-sm text-gold mt-2">{t.code}</code></div>)}{!selected.tickets?.some((t:any)=>t.option_id===a.optionId)&&<p className="text-sm mt-2">Admission codes appear only after verified payment. A successful payment needing event review does not issue admission.</p>}</article>)}</section>}
              {["paid", "fulfilled"].includes(selected.status) &&
                selected.items
                  .filter(
                    (i: any) => i.kind === "digital" && i.digital_version_id,
                  )
                  .map((i: any) => (
                    <a
                      key={i.option_id}
                      className="inline-block mt-5 text-gold underline"
                      href={
                        "/api/v1/customer/commerce/orders/" +
                        selected.id +
                        "/downloads/" +
                        i.option_id
                      }
                    >
                      Download {i.name}
                    </a>
                  ))}
              <h3 className="mt-5 font-semibold">History</h3>
              {selected.history.map((h: any, i: number) => (
                <p key={i} className="text-sm text-text-secondary mt-2">
                  {h.reason}
                </p>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
