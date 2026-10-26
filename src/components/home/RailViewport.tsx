import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
export type RailFormat = "poster" | "landscape" | "music" | "artist";
export function RailViewport({
  title,
  description,
  children,
  format = "landscape",
  seeAllHref,
  seeAllLabel,
  contained = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  format?: RailFormat;
  seeAllHref?: string;
  seeAllLabel?: string;
  contained?: boolean;
}) {
  const node = useRef<HTMLDivElement>(null),
    heading = useId();
  const [position, setPosition] = useState({ index: 0, pages: 1 });
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const measure = () => {
      const travel = Math.max(0, element.scrollWidth - element.clientWidth),
        pages =
          travel > 2
            ? Math.ceil(travel / Math.max(1, element.clientWidth)) + 1
            : 1,
        index = travel
          ? Math.min(
              pages - 1,
              Math.max(
                0,
                Math.round((element.scrollLeft / travel) * (pages - 1)),
              ),
            )
          : 0;
      setPosition((old) =>
        old.index === index && old.pages === pages ? old : { index, pages },
      );
    };
    measure();
    element.addEventListener("scroll", measure, { passive: true });
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    Array.from(element.children).forEach((child) => resize.observe(child));
    return () => {
      resize.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, [children]);
  function move(index: number) {
    const element = node.current;
    if (!element) return;
    element.scrollTo({
      left:
        (Math.max(0, Math.min(index, position.pages - 1)) *
          (element.scrollWidth - element.clientWidth)) /
        Math.max(1, position.pages - 1),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  return (
    <section
      aria-labelledby={heading}
      className={
        contained
          ? "mgtv-rail py-5"
          : "mgtv-rail mx-auto max-w-[1760px] px-6 py-6 md:px-8"
      }
      data-rail-format={format}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          {description && (
            <p className="mb-1 text-sm text-text-secondary">{description}</p>
          )}
          <h2
            id={heading}
            className="font-display text-2xl leading-tight tracking-wide md:text-3xl"
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              to={seeAllHref}
              className="mr-2 inline-flex min-h-11 items-center text-sm font-semibold text-gold"
            >
              {seeAllLabel ?? "View all"}
            </Link>
          )}
          {position.pages > 1 && (
            <>
              <span
                className="min-w-10 text-center text-xs tabular-nums text-text-secondary"
                aria-label={`Rail position: ${position.index + 1} of ${position.pages}`}
              >
                {position.index + 1} / {position.pages}
              </span>
              {[-1, 1].map((direction) => (
                <button
                  type="button"
                  key={direction}
                  className="grid size-11 place-items-center rounded-full border border-white/10 text-gold transition-colors hover:border-gold/50 hover:bg-gold/10 disabled:opacity-25"
                  disabled={
                    direction < 0
                      ? position.index === 0
                      : position.index === position.pages - 1
                  }
                  aria-label={`Scroll ${title} ${direction < 0 ? "left" : "right"}`}
                  onClick={() => move(position.index + direction)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      d={direction < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
                    />
                  </svg>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
      <div
        ref={node}
        role="region"
        aria-label={`${title} content`}
        tabIndex={0}
        className="mgtv-rail-track flex items-stretch gap-5 overflow-x-auto overscroll-x-contain pb-2 pt-2 snap-x snap-mandatory"
      >
        {children}
      </div>
      {position.pages > 1 && (
        <div className="mt-3 flex justify-end gap-1.5" aria-hidden="true">
          {Array.from({ length: Math.min(position.pages, 7) }, (_, index) => (
            <span
              key={index}
              className={
                "h-1 rounded-full transition-colors " +
                (index ===
                Math.round(
                  (position.index / Math.max(1, position.pages - 1)) *
                    (Math.min(position.pages, 7) - 1),
                )
                  ? "w-6 bg-gold"
                  : "w-2 bg-white/15")
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
