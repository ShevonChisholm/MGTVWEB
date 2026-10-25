import type { ReactNode } from "react";
export function LoadingSkeleton({
  label = "Loading MGTV…",
  variant = "cards",
  count = 6,
  columns,
}: {
  label?: ReactNode;
  variant?:
    | "cards"
    | "landscape"
    | "detail"
    | "article"
    | "hero"
    | "feature"
    | "account"
    | "inline"
    | "list"
    | "products";
  count?: number;
  columns?: 3 | 4 | 5;
}) {
  return (
    <div className={`mgtv-loading mgtv-loading--${variant}`} aria-busy="true">
      <span role="status" className="sr-only">
        {label}
      </span>
      <div aria-hidden="true">
        {["hero", "feature"].includes(variant) ? (
          <div className="hero-card mgtv-loading-hero">
            <div className="hero-card__content">
              <div className="mgtv-skeleton h-4 w-40" />
              <div className="mgtv-skeleton mt-6 h-16 max-w-lg" />
              <div className="mgtv-skeleton mt-6 h-20 max-w-md" />
              <div className="mt-8 flex gap-4">
                <span className="mgtv-skeleton h-12 w-36" />
                <span className="mgtv-skeleton h-12 w-36" />
              </div>
            </div>
          </div>
        ) : variant === "list" ? (
          <div className="space-y-3">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="mgtv-skeleton h-24" />
            ))}
          </div>
        ) : variant === "inline" ? (
          <div className="mgtv-skeleton h-5 max-w-xs" />
        ) : ["detail", "article"].includes(variant) ? (
          <>
            <div className="mgtv-skeleton aspect-video w-full max-h-[65vh]" />
            <div className="mx-auto mt-8 max-w-3xl space-y-5">
              <div className="mgtv-skeleton h-12 w-3/4" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="mgtv-skeleton h-5" />
              ))}
            </div>
          </>
        ) : (
          <div
            className={`mgtv-loading-grid ${columns ? `mgtv-loading-grid--${columns}` : ""} ${variant === "account" ? "mgtv-loading-grid--account" : ""}`}
          >
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="min-w-0">
                <div
                  className={`mgtv-skeleton ${variant === "account" ? "h-72" : variant === "products" ? "aspect-square" : variant === "landscape" ? "aspect-video" : "aspect-[2/3]"}`}
                />
                <div className="mgtv-skeleton mt-4 h-6 w-4/5" />
                <div className="mgtv-skeleton mt-3 h-4 w-3/5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export function ErrorState({
  message,
  onRetry,
  title = "This part of MGTV couldn’t load",
  pending = false,
}: {
  message: string;
  onRetry?: () => void;
  title?: string;
  pending?: boolean;
}) {
  return (
    <section
      role="alert"
      className="my-6 rounded-xl border border-rose-300/30 bg-bg-surface p-6"
    >
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-3 break-words text-sm leading-relaxed text-text-secondary">
        {message}
      </p>
      {onRetry && (
        <button
          className="mt-5 min-h-11 rounded-lg border border-gold/50 px-5 text-sm text-gold disabled:opacity-50"
          disabled={pending}
          onClick={onRetry}
        >
          {pending ? "Trying again…" : "Try again"}
        </button>
      )}
    </section>
  );
}
