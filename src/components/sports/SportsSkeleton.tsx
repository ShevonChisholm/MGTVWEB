export default function SportsSkeleton({ page = false }: { page?: boolean }) {
  const cards = (
    <div className="sports-results-grid" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <article key={i} className="sports-card">
          <div className="aspect-video mgtv-skeleton" />
          <div className="sports-card__body">
            <div className="h-8 w-4/5 mgtv-skeleton" />
            <div className="h-10 mgtv-skeleton" />
            <div className="h-9 mgtv-skeleton" />
            <div className="mt-auto h-11 mgtv-skeleton" />
          </div>
        </article>
      ))}
    </div>
  );
  return (
    <div role="status" aria-label="Loading Sports coverage" aria-busy="true">
      {page ? (
        <main className="bg-bg-base pt-16">
          <section
            className="sports-feature grid md:grid-cols-5"
            aria-hidden="true"
          >
            <div className="min-h-64 mgtv-skeleton md:col-span-3" />
            <div className="space-y-6 px-6 py-12 md:col-span-2 md:py-20 md:pr-12">
              <div className="h-4 w-40 mgtv-skeleton" />
              <div className="h-28 mgtv-skeleton" />
              <div className="h-5 w-32 mgtv-skeleton" />
              <div className="h-28 mgtv-skeleton" />
              <div className="h-11 mgtv-skeleton" />
            </div>
          </section>
          <div className="px-6 py-10 md:px-8">{cards}</div>
        </main>
      ) : (
        cards
      )}
    </div>
  );
}
