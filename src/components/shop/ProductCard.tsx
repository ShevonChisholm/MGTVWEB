import { useEffect, useState } from "react";
import { Link } from "react-router";
import { money, shopApi } from "@/lib/commerce";
import {
  productPresentation,
  type ShopProduct,
} from "@/lib/commercePresentation";
export function ProductArtwork({
  p,
  className = "",
  eager = false,
}: {
  p: ShopProduct;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src =
    "/api/v1/catalog/commerce/products/" +
    p.id +
    "/cover?v=" +
    (p.image_version_id || "current");
  useEffect(() => setFailed(false), [src]);
  return (
    <div className={"shop-product-artwork " + className}>
      {failed ? (
        <div
          role="img"
          aria-label={p.name + " — image unavailable"}
          className="shop-product-artwork__fallback"
        >
          <span aria-hidden="true">↗</span>
          <span>Image unavailable</span>
          <span className="text-xs">Product details are still available</span>
        </div>
      ) : (
        <img
          src={src}
          alt={p.name}
          width="1200"
          height="1200"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
export function ProductCard({ p }: { p: ShopProduct }) {
  const info = productPresentation(p);
  return (
    <article className="shop-product-card group" data-product-kind={p.kind}>
      <Link
        to={"/shop/" + p.id}
        className="shop-product-card__link"
        aria-label={p.name + " — " + info.action}
      >
        <div className="relative">
          <ProductArtwork p={p} />
          <span className="shop-product-card__kind">{info.type}</span>
        </div>
        <div className="shop-product-card__body">
          <p className="shop-product-card__category">{p.category}</p>
          <h3 className="shop-product-card__title">{p.name}</h3>
          <p className="shop-product-card__detail">{info.detail}</p>
          <div className="shop-product-card__purchase">
            <p className="shop-product-card__price">
              <span className="shop-product-card__price-prefix">
                {info.variedPrice ? "From" : "\u00a0"}
              </span>
              <span>
                {info.price === null
                  ? "Pricing unavailable"
                  : money(info.price)}
              </span>
            </p>
            <p
              className={
                "shop-product-card__availability " +
                (info.available ? "text-text-secondary" : "text-gold")
              }
            >
              {info.availability}
            </p>
          </div>
          <span className="shop-product-card__action">
            {info.action}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
export function ShopCollectionSkeleton() {
  return (
    <div aria-busy="true">
      <span role="status" className="sr-only">
        Loading the collection…
      </span>
      <div className="shop-product-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="shop-product-card" key={i}>
            <div className="mgtv-skeleton aspect-square" />
            <div className="shop-product-card__body">
              <div className="mgtv-skeleton h-3 w-20" />
              <div className="mgtv-skeleton h-10 w-full mt-3" />
              <div className="mgtv-skeleton h-8 w-4/5 mt-3" />
              <div className="mgtv-skeleton h-10 w-3/4 mt-auto" />
              <div className="mgtv-skeleton h-11 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function ShopDevelopmentNotice() {
  const [payment, setPayment] = useState<{
    provider: string;
    available: boolean;
  } | null>(null);
  useEffect(() => {
    let live = true;
    shopApi("/policy")
      .then((p) => {
        if (live) setPayment(p.payment);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return (
    <p className="text-xs leading-relaxed text-text-secondary">
      Development store · JMD · Provisional tax and delivery rules.
      {payment
        ? payment.available && payment.provider.endsWith("sandbox")
          ? " Sandbox checkout only. No real charges."
          : " Checkout is currently unavailable."
        : " Checkout availability is confirmed before payment."}{" "}
      Product images are development concepts.
    </p>
  );
}
