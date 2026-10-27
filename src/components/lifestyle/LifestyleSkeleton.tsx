export default function LifestyleSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading Lifestyle stories"
      className="lifestyle-results-grid"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="lifestyle-card" aria-hidden="true">
          <div className="aspect-video mgtv-skeleton" />
          <div className="lifestyle-card__body">
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
