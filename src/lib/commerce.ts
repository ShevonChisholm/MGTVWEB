import { customerApi } from "./customerAuth";
export const money = (minor: number) =>
  new Intl.NumberFormat("en-JM", {
    style: "currency",
    currency: "JMD",
    currencyDisplay: "code",
  }).format(minor / 100);
export async function shopApi(path: string) {
  const r = await fetch("/api/v1/catalog/commerce" + path, {
    credentials: "include",
  });
  const b = await r.json();
  if (!r.ok) throw Error(b.message ?? "Shop unavailable.");
  return b;
}
export const commerceMutation = (
  path: string,
  body: unknown,
  key: string = crypto.randomUUID(),
) => customerApi("/commerce" + path, "POST", body, { "Idempotency-Key": key });
export const GUEST_CART = "mgtv-guest-commerce-v1";
export function guestItems(): any[] {
  try {
    const v = JSON.parse(localStorage.getItem(GUEST_CART) ?? "[]");
    return Array.isArray(v)
      ? v
          .filter(
            (x) =>
              typeof x.optionId === "string" &&
              Number.isInteger(x.quantity) &&
              x.quantity > 0 &&
              x.quantity <= 20,
          )
          .slice(0, 40)
      : [];
  } catch {
    return [];
  }
}
export function cartChanged() {
  window.dispatchEvent(new Event("mgtv-commerce-cart"));
}
export function openCart() {
  window.dispatchEvent(new Event("mgtv-commerce-open"));
}
export async function addCommerceItem(
  optionId: string,
  quantity: number,
  signedIn: boolean,
) {
  if (signedIn) {
    const cart = await customerApi("/commerce/cart");
    const old = cart.items.find((x: any) => x.option_id === optionId);
    await commerceMutation("/cart/lines", {
      optionId,
      quantity: Math.min(20, quantity + (old?.quantity ?? 0)),
    });
  } else {
    const items = guestItems();
    const old = items.find((x) => x.optionId === optionId);
    if (old) old.quantity = Math.min(20, old.quantity + quantity);
    else {
      if (items.length >= 40)
        throw Error("Your cart can hold at most 40 options.");
      items.push({ optionId, quantity });
    }
    localStorage.setItem(GUEST_CART, JSON.stringify(items));
    localStorage.removeItem(GUEST_CART + "-merge-key");
  }
  cartChanged();
  openCart();
}

export function guestMergeKey() {
  const name = GUEST_CART + "-merge-key";
  let key = localStorage.getItem(name);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(name, key);
  }
  return key;
}
