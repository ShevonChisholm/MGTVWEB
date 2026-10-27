import { useState } from "react";
import { SessionDialog } from "@/components/shared/SessionDialog";
import type { ShopProduct } from "@/lib/commercePresentation";
import { ProductArtwork } from "./ProductCard";
type GalleryImage = {
  id: string;
  url: string;
  label: string;
  alt: string;
  caption: string;
};
function Image({ image }: { image: GalleryImage }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      role="img"
      aria-label={image.alt + " — image unavailable"}
      className="shop-product-artwork__fallback"
    >
      <span>Image unavailable</span>
      <span>Choose another view below</span>
    </div>
  ) : (
    <img
      src={image.url}
      alt={image.alt}
      width={1200}
      height={1200}
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
}
export default function ProductGallery({
  p,
}: {
  p: ShopProduct & { gallery?: GalleryImage[] };
}) {
  const images = p.gallery ?? [];
  const [index, setIndex] = useState(0),
    [expanded, setExpanded] = useState(false);
  const current = index ? images[index - 1] : null;
  const label = current?.label ?? "Front / cover";
  return (
    <section
      aria-label={p.name + " product gallery"}
      className="shop-gallery min-w-0 self-start"
    >
      <div className="shop-gallery__stage relative aspect-square overflow-hidden rounded-tl-3xl rounded-br-3xl bg-[#111]">
        {current ? (
          <Image key={current.id} image={current} />
        ) : (
          <ProductArtwork p={p} eager />
        )}
        <button
          type="button"
          className="absolute bottom-3 right-3 min-h-11 rounded-lg bg-black/80 px-4 text-sm text-gold"
          onClick={() => setExpanded(true)}
        >
          Enlarge image
        </button>
      </div>
      <div className="flex min-h-14 items-center justify-between gap-3 text-sm">
        <span aria-live="polite">
          {label} · {index + 1} / {images.length + 1}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous product image"
            disabled={!index}
            className="min-h-11 min-w-11 text-gold disabled:opacity-30"
            onClick={() => setIndex((i) => i - 1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next product image"
            disabled={index === images.length}
            className="min-h-11 min-w-11 text-gold disabled:opacity-30"
            onClick={() => setIndex((i) => i + 1)}
          >
            →
          </button>
        </div>
      </div>
      {!!images.length && (
        <div className="grid grid-cols-4 gap-2">
          {[null, ...images].map((im, i) => (
            <button
              type="button"
              key={im?.id ?? "cover"}
              aria-label={"Show " + (im?.label ?? "front / cover")}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
              className={
                "aspect-square min-w-0 overflow-hidden rounded-lg border-2 " +
                (index === i
                  ? "border-gold"
                  : "border-white/10 hover:border-gold/50")
              }
            >
              {im ? <Image image={im} /> : <ProductArtwork p={p} />}
            </button>
          ))}
        </div>
      )}
      {current?.caption && (
        <p className="mt-3 text-xs leading-relaxed text-text-secondary">
          {current.caption}
        </p>
      )}
      {expanded && (
        <SessionDialog
          title={p.name + " — " + label}
          onClose={() => setExpanded(false)}
        >
          <div className="aspect-square overflow-hidden bg-[#111]">
            {current ? (
              <Image key={current.id} image={current} />
            ) : (
              <ProductArtwork p={p} />
            )}
          </div>
          <p className="mt-3 text-sm text-text-secondary">
            {current?.caption ?? p.name}
          </p>
        </SessionDialog>
      )}
    </section>
  );
}
