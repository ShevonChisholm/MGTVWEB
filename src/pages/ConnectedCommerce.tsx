import ProductGallery from "@/components/shop/ProductGallery";
import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
import { useLifestyle } from "@/lib/lifestyle";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button, ButtonLink } from "@/components/ui/Button";
import { shopApi, money, addCommerceItem } from "@/lib/commerce";
import {
  ProductCard,
  ProductArtwork,
  ShopCollectionSkeleton,
  ShopDevelopmentNotice,
} from "@/components/shop/ProductCard";
import { productPresentation } from "@/lib/commercePresentation";
import { useCustomerSession } from "@/lib/customerAuth";
export function ConnectedShop() {
  const lifestyle = useLifestyle("/lifestyle?limit=1");
  const featuredStory = lifestyle.data?.items?.[0];
  const [items, setItems] = useState<any[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0),
    [category, setCategory] = useState("all"),
    [sort, setSort] = useState("featured");
  useEffect(() => {
    let live = true;
    setLoading(true);
    setError("");
    shopApi("/products")
      .then((r) => {
        if (live) setItems(r.items);
      })
      .catch((e) => {
        if (live) setError(e.message);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [revision]);
  let filtered = items.filter(
    (p) => category === "all" || p.category === category,
  );
  if (sort !== "featured")
    filtered = [...filtered].sort((a, b) => {
      const left = productPresentation(a).price,
        right = productPresentation(b).price;
      if (left === null) return right === null ? 0 : 1;
      if (right === null) return -1;
      return (left - right) * (sort === "asc" ? 1 : -1);
    });
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <section
        className="relative overflow-hidden flex"
        style={{ height: "clamp(440px, 62vh, 680px)" }}
      >
        <div className="w-full md:w-[48%] relative z-10 bg-[#080808] flex flex-col justify-end px-6 md:px-8 py-10 border-t border-gold/30">
          <p className="text-gold text-xs font-black tracking-[.3em] uppercase mb-6">
            MGTV · Commerce & Culture
          </p>
          <h1
            className="font-display leading-none mb-4"
            style={{ fontSize: "clamp(3rem, min(7vw, 8vh), 5.5rem)" }}
          >
            Wear the
            <br />
            <span className="text-gold">Culture</span>
          </h1>
          <p className="text-text-secondary text-sm max-w-[340px] mb-8">
            Take the culture with you. Discover original merchandise, digital
            finds and moments worth making time for.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#products"
              className="bg-gold text-black px-6 py-3 font-bold"
            >
              Explore the collection
            </a>
            <Link to="/lifestyle" className="text-sm text-text-secondary">
              Explore Lifestyle
            </Link>
          </div>
        </div>
        <div className="hidden md:grid flex-1 grid-cols-3 grid-rows-2 gap-0.5 relative">
          {[...items]
            .sort(
              (a, b) =>
                Number(b.kind === "physical") - Number(a.kind === "physical"),
            )
            .slice(0, 6)
            .map((p) => (
              <img
                key={p.id}
                src={"/api/v1/catalog/commerce/products/" + p.id + "/cover"}
                alt=""
                className="w-full h-full object-cover min-h-0 opacity-90"
              />
            ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent" />
        </div>
      </section>
      <section className="border-y border-white/5 min-h-[90px]">
        {featuredStory ? (
          <Link
            to={"/lifestyle/" + featuredStory.id}
            className="group flex justify-between items-center gap-5 px-6 md:px-8 py-5"
          >
            <div className="flex gap-6 items-center">
              <img
                src={featuredStory.coverUrl}
                alt=""
                className="w-12 h-12 object-cover"
              />
              <div>
                <p className="text-gold text-xs font-bold uppercase tracking-widest">
                  Featured on Lifestyle
                </p>
                <p className="text-sm font-semibold mt-1">
                  {featuredStory.title}
                </p>
              </div>
            </div>
            <span className="text-text-secondary text-xs">Read →</span>
          </Link>
        ) : lifestyle.loading ? (
          <div
            aria-hidden="true"
            className="h-[88px] px-6 md:px-8 flex items-center gap-6"
          >
            <div className="mgtv-skeleton w-12 h-12 shrink-0" />
            <div className="mgtv-skeleton w-48 h-8" />
          </div>
        ) : (
          <Link
            to="/lifestyle"
            className="min-h-[88px] px-6 md:px-8 flex items-center text-sm text-gold"
          >
            Explore the culture behind the collection →
          </Link>
        )}
      </section>
      <section
        id="products"
        className="max-w-[1760px] mx-auto px-6 md:px-8 py-14"
      >
        <div className="flex flex-wrap justify-between gap-5 items-center mb-8">
          <h2 className="font-display text-4xl">The Collection</h2>
          <label className="text-sm">
            Sort{" "}
            <select
              className="bg-[#161616] p-2 ml-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="asc">Price: low to high</option>
              <option value="desc">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="shop-category-filters flex flex-wrap gap-2 border-b border-white/10 mb-8">
          {["all", ...new Set(items.map((p) => p.category))].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={
                "min-h-11 px-3 py-2 md:px-5 md:py-3 text-sm capitalize whitespace-nowrap border-b-2 " +
                (category === c
                  ? "border-gold text-gold"
                  : "border-transparent text-text-secondary")
              }
              onClick={() => setCategory(c)}
            >
              {c === "all" ? "All Products" : c}
            </button>
          ))}
        </div>
        {loading ? (
          <ShopCollectionSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => setRevision((n) => n + 1)}
          />
        ) : filtered.length ? (
          <div className="shop-product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p>No products in this collection yet.</p>
        )}
        <div className="mt-10">
          <ShopDevelopmentNotice />
        </div>
        <ButtonLink to="/shop/orders" variant="outline" className="mt-5">
          Your orders
        </ButtonLink>
      </section>
      {items.find((p) => p.kind === "travel") &&
        (() => {
          const p = items.find((p) => p.kind === "travel");
          return (
            <section className="max-w-[1760px] mx-auto px-6 md:px-8 pb-16">
              <div className="relative overflow-hidden min-h-[260px]">
                <img
                  src={"/api/v1/catalog/commerce/products/" + p.id + "/cover"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
                <div className="relative z-10 p-8 md:p-14 max-w-lg">
                  <p className="text-gold text-xs uppercase tracking-widest mb-4">
                    Make time for something different
                  </p>
                  <h3 className="font-display text-4xl mb-4">{p.name}</h3>
                  <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                    {p.description}
                  </p>
                  <ButtonLink to={"/shop/" + p.id}>
                    Explore dated departures
                  </ButtonLink>
                </div>
              </div>
            </section>
          );
        })()}
    </div>
  );
}
export function ConnectedProduct() {
  const { id } = useParams(),
    {
      session,
      loading: sessionLoading,
      error: sessionError,
    } = useCustomerSession();
  const [p, setP] = useState<any>(null),
    [option, setOption] = useState(""),
    [qty, setQty] = useState(1),
    [revision, setRevision] = useState(0),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    setP(null);
    setError("");
    shopApi("/products/" + id)
      .then((r) => {
        if (live) {
          setP(r);
          setOption(r.options[0]?.id ?? "");
        }
      })
      .catch((e) => {
        if (live) setError(e.message);
      });
    return () => {
      live = false;
    };
  }, [id, revision]);
  const selected = p?.options.find((o: any) => o.id === option);
  async function add() {
    setBusy(true);
    setError("");
    try {
      await addCommerceItem(option, qty, !!session);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-28 px-6 md:px-8 max-w-[1760px] mx-auto pb-16">
      <Link to="/shop" className="text-gold">
        Shop / {p?.category ?? "Product"}
      </Link>
      {error && (
        <p role="alert" className="my-4">
          {error}
          {!p && (
            <Button variant="outline" onClick={() => setRevision((n) => n + 1)}>
              Retry product
            </Button>
          )}
        </p>
      )}
      {!p ? (
        error ? (
          <h1 className="font-display text-4xl my-10">Product unavailable</h1>
        ) : (
          <LoadingSkeleton label="Loading product…" variant="detail" />
        )
      ) : (
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mt-10">
          <ProductGallery key={p.id+":"+(p.gallery_revision_id??p.image_version_id)} p={p}/>
          <div className="flex flex-col justify-center">
            <p className="text-gold text-xs uppercase tracking-[.3em] mb-4">
              {p.category}
            </p>
            <h1 className="font-display text-5xl mb-6">{p.name}</h1>
            <p className="text-text-secondary leading-relaxed mb-8 whitespace-pre-line">
              {p.description}
            </p>
            <label className="text-sm">
              {["experience", "travel"].includes(p.kind)
                ? "Choose a dated slot"
                : "Choose an option"}
              <select
                className="block w-full bg-[#161616] border border-white/20 p-3 mt-2 mb-4"
                value={option}
                onChange={(e) => setOption(e.target.value)}
              >
                {p.options.map((o: any) => (
                  <option
                    key={o.id}
                    value={o.id}
                    disabled={
                      o.available <= 0 ||
                      (o.starts_at && new Date(o.starts_at) <= new Date())
                    }
                  >
                    {o.label}
                    {o.starts_at
                      ? " · " +
                        new Date(o.starts_at).toLocaleString("en-JM", {
                          timeZone: "America/Jamaica",
                        })
                      : ""}{" "}
                    · {money(o.price_minor)}
                    {o.available <= 0 ? " · Sold out" : ""}
                  </option>
                ))}
              </select>
            </label>
            {selected && (
              <>
                <p className="font-display text-4xl text-gold mb-3">
                  {money(selected.price_minor)}
                </p>
                <p className="text-xs text-text-secondary mb-5">
                  {selected.available} available
                  {selected.starts_at ? " · Times shown in Jamaica time" : ""}.
                  Test tax added at checkout.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-4">
              <label>
                Quantity
                <input
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  max="20"
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                    )
                  }
                  className="block w-24 p-3 bg-[#161616] mt-2"
                />
              </label>
              <Button
                className="self-end"
                disabled={
                  busy ||
                  sessionLoading ||
                  !!sessionError ||
                  !selected ||
                  selected.available < qty
                }
                onClick={() => void add()}
              >
                {busy ? "Adding…" : "Add to Cart"}
              </Button>
            </div>
            {p.kind === "digital" && (
              <p className="mt-6 text-sm text-text-secondary">
                Digital delivery follows verified payment.
              </p>
            )}
            <div className="mt-6">
              <ShopDevelopmentNotice />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
