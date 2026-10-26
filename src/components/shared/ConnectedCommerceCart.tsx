import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { SessionDialog } from "./SessionDialog";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useCustomerSession, customerApi } from "@/lib/customerAuth";
import {
  guestItems,
  guestMergeKey,
  GUEST_CART,
  cartChanged,
  commerceMutation,
  shopApi,
  money,
} from "@/lib/commerce";
export function ConnectedCommerceCart() {
  const { session, loading } = useCustomerSession();
  const [open, setOpen] = useState(false),
    [cart, setCart] = useState<any>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [delivery, setDelivery] = useState("collection"),
    [address, setAddress] = useState({
      name: "",
      line1: "",
      parish: "",
      phone: "",
      country: "JM",
    }),
    [order, setOrder] = useState<any>(null);
  const refreshGeneration = useRef(0);
  const scope = useRef<any>(null);
  scope.current = session?.account?.id ?? null;
  async function refresh() {
    const current = scope.current;
    const generation = ++refreshGeneration.current;
    try {
      let next: any;
      if (session) {
        next = await customerApi("/commerce/cart");
      } else {
        const catalog = await shopApi("/products");
        const lines = guestItems();
        next = {
          rules: await shopApi("/policy"),
          items: lines.map((l) => {
            const p = catalog.items.find((p: any) =>
              p.options.some((o: any) => o.id === l.optionId),
            );
            const o = p?.options.find((o: any) => o.id === l.optionId);
            return {
              option_id: l.optionId,
              quantity: l.quantity,
              name: p?.name ?? "Unavailable product",
              label: o?.label ?? "",
              price_minor: o?.price_minor ?? 0,
              kind: p?.kind,
              product_id: p?.id,
            };
          }),
        };
      }
      if (scope.current === current && refreshGeneration.current === generation)
        setCart(next);
    } catch (e) {
      if (scope.current === current && refreshGeneration.current === generation)
        setError((e as Error).message);
    }
  }
  useEffect(() => {
    const fn = () => {
      setOpen(true);
      setOrder(null);
      setError("");
    };
    window.addEventListener("mgtv-commerce-open", fn);
    return () => window.removeEventListener("mgtv-commerce-open", fn);
  }, []);
  useEffect(() => {
    setCart(null);
    setOrder(null);
    if (loading) return;
    void refresh();
    const fn = () => void refresh();
    window.addEventListener("mgtv-commerce-cart", fn);
    return () => window.removeEventListener("mgtv-commerce-cart", fn);
  }, [session, loading]);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function update(id: string, quantity: number) {
    await run(async () => {
      if (session)
        await commerceMutation("/cart/lines", { optionId: id, quantity });
      else
        localStorage.setItem(
          GUEST_CART,
          JSON.stringify(
            guestItems()
              .map((x) => (x.optionId === id ? { ...x, quantity } : x))
              .filter((x) => x.quantity > 0),
          ),
        );
      await refresh();
      cartChanged();
    });
  }
  const physical = cart?.items.some((i: any) => i.kind === "physical"),
    subtotal =
      cart?.items.reduce(
        (n: number, i: any) => n + i.quantity * i.price_minor,
        0,
      ) ?? 0;
  const shipping =
      physical && delivery === "shipping"
        ? (cart?.rules?.shippingMinor ?? 0)
        : 0,
    tax = Math.round((subtotal * (cart?.rules?.taxBasisPoints ?? 0)) / 10000);
  return (
    <>
      {open && (
        <SessionDialog
          title="Your cart"
          placement="drawer"
          onClose={() => setOpen(false)}
        >
          {error && (
            <p role="alert" className="mb-5 text-red-300">
              {error}
            </p>
          )}
          {order ? (
            <div className="space-y-5">
              <h2 className="font-display text-3xl">Reservation created</h2>
              <p>Order {order.id}</p>
              <p>
                Payment has not been taken. This reservation expires at{" "}
                {new Date(order.expires_at).toLocaleString()}.
              </p>
              <p>
                Continue from your order to Stripe’s sandbox. No real money
                moves.
              </p>
              <ButtonLink
                to={"/shop/orders?order=" + order.id}
                onClick={() => setOpen(false)}
              >
                View your orders
              </ButtonLink>
            </div>
          ) : !cart ? (
            <p role="status">Loading your cart…</p>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-6">
                JMD · Development store. Prices and provisional tax and delivery
                rules are for testing.
              </p>
              {!session && guestItems().length > 0 ? (
                <>
                  <p className="mb-4">
                    Sign in to save this cart and check out with an adult
                    profile.
                  </p>
                  <ButtonLink to="/auth/sign-in" onClick={() => setOpen(false)}>
                    Sign in
                  </ButtonLink>
                </>
              ) : null}
              {session && guestItems().length > 0 && (
                <>
                  <Button
                    disabled={busy}
                    variant="outline"
                    onClick={() =>
                      void run(async () => {
                        await commerceMutation(
                          "/cart/merge",
                          { items: guestItems() },
                          guestMergeKey(),
                        );
                        localStorage.removeItem(GUEST_CART);
                        localStorage.removeItem(GUEST_CART + "-merge-key");
                        await refresh();
                        cartChanged();
                      })
                    }
                  >
                    Merge your guest cart
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => {
                      localStorage.removeItem(GUEST_CART);
                      localStorage.removeItem(GUEST_CART + "-merge-key");
                      cartChanged();
                    }}
                  >
                    Discard guest cart
                  </Button>
                </>
              )}
              {!cart.items.length ? (
                <p className="py-8">
                  Your cart is empty.{" "}
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="text-gold"
                  >
                    Explore the collection
                  </Link>
                </p>
              ) : (
                <>
                  <div className="divide-y divide-white/10">
                    {cart.items.map((i: any) => (
                      <article key={i.option_id} className="flex gap-4 py-5">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={"/shop/" + i.product_id}
                            onClick={() => setOpen(false)}
                            className="font-semibold"
                          >
                            {i.name}
                          </Link>
                          <p className="text-sm text-text-secondary">
                            {i.label}
                          </p>
                          <p className="text-gold mt-2">
                            {money(i.price_minor)}
                          </p>
                          <div className="flex gap-3 items-center mt-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={busy}
                              aria-label={"Decrease " + i.name + " quantity"}
                              onClick={() =>
                                void update(i.option_id, i.quantity - 1)
                              }
                            >
                              −
                            </Button>
                            <span>{i.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={busy || i.quantity >= 20}
                              aria-label={"Increase " + i.name + " quantity"}
                              onClick={() =>
                                void update(i.option_id, i.quantity + 1)
                              }
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={busy}
                              onClick={() => void update(i.option_id, 0)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {physical && (
                    <label className="block my-5">
                      Delivery
                      <select
                        className="block bg-[#171717] p-3 w-full mt-2"
                        value={delivery}
                        onChange={(e) => setDelivery(e.target.value)}
                      >
                        <option value="collection">Collection · Free</option>
                        <option value="shipping">
                          Jamaica delivery · Test fee
                        </option>
                      </select>
                    </label>
                  )}
                  {physical && delivery === "shipping" && (
                    <div className="space-y-3 mb-6">
                      {(["name", "line1", "parish", "phone"] as const).map(
                        (key) => (
                          <label key={key} className="block capitalize">
                            {key === "line1" ? "Street address" : key}
                            <input
                              className="block w-full bg-[#171717] p-3 border border-white/20 mt-1"
                              value={address[key]}
                              onChange={(e) =>
                                setAddress({
                                  ...address,
                                  [key]: e.target.value,
                                })
                              }
                            />
                          </label>
                        ),
                      )}
                    </div>
                  )}
                  <dl className="space-y-3 border-t border-white/10 pt-5">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd>{money(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>
                        Test tax ({(cart?.rules?.taxBasisPoints ?? 0) / 100}%)
                      </dt>
                      <dd>{money(tax)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Delivery</dt>
                      <dd>{money(shipping)}</dd>
                    </div>
                    <div className="flex justify-between font-bold text-gold">
                      <dt>Estimated total</dt>
                      <dd>{money(subtotal + tax + shipping)}</dd>
                    </div>
                  </dl>
                  <p className="text-xs text-text-secondary mt-5">
                    The server rechecks price, stock and capacity. Items in your
                    cart are not reserved.
                  </p>
                  {session && (
                    <Button
                      className="mt-5 w-full"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          const result = await commerceMutation("/checkout", {
                            cartVersion: cart.version,
                            delivery: physical ? delivery : "none",
                            ...(physical && delivery === "shipping"
                              ? { address }
                              : {}),
                          });
                          setOrder(result);
                        })
                      }
                    >
                      {busy
                        ? "Checking availability…"
                        : "Create test reservation · No payment"}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </SessionDialog>
      )}
    </>
  );
}
