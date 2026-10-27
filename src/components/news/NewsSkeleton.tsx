export default function NewsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading News stories"
      className="news-results-grid"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="news-card" aria-hidden="true">
          <div className="aspect-video mgtv-skeleton" />
          <div className="news-card__body">
            <div className="h-4 w-24 mgtv-skeleton" />
            <div className="h-14 mgtv-skeleton" />
            <div className="h-16 mgtv-skeleton" />
            <div className="mt-auto h-11 mgtv-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
