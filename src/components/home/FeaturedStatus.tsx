import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
import type { useHomepage } from "@/lib/homepage";
import { ButtonLink } from "@/components/ui/Button";
export function FeaturedStatus({
  page,
}: {
  page: ReturnType<typeof useHomepage>;
}) {
  if (!page.error && !page.profileRequired && !page.loading) return null;
  if (page.loading && !page.hero.length && !page.profileRequired)
    return (
      <LoadingSkeleton
        label="Loading featured content…"
        variant={
          ["home", "movies", "shows"].includes(page.surface)
            ? "hero"
            : "feature"
        }
      />
    );
  if (page.loading && page.hero.length) return null;
  if (page.error)
    return (
      <div className="mx-auto max-w-[1760px] px-6 md:px-8">
        <ErrorState
          message={page.error}
          onRetry={page.retry}
          title="Featured content couldn’t load"
        />
      </div>
    );
  return (
    <div className="mx-auto max-w-[1760px] px-6 pt-8 md:px-8">
      <p
        role={page.error ? "alert" : "status"}
        className="text-sm text-text-secondary"
      >
        {page.error ||
          (page.profileRequired
            ? "Choose who is watching to see featured content."
            : "Loading editorial selections…")}
      </p>
      {page.profileRequired && (
        <ButtonLink variant="outline" to="/profiles">
          Choose profile
        </ButtonLink>
      )}
    </div>
  );
}
