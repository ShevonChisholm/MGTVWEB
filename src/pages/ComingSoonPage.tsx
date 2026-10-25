import { useParams, Link } from "react-router";
import { useLifecycle } from "@/components/home/LifecycleRails";
import {
  LoadingSkeleton,
  ErrorState,
} from "@/components/shared/LoadingSkeleton";
export default function ComingSoonPage() {
  const { kind, id } = useParams(),
    state = useLifecycle(`teasers/${kind}/${id}`),
    item = state.data;
  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
        {state.profileRequired ? (
          <>
            <h1 className="font-display text-4xl">Choose who’s watching</h1>
            <Link to="/profiles" className="mt-5 inline-block text-gold">
              Choose a profile
            </Link>
          </>
        ) : state.loading ? (
          <LoadingSkeleton label="Loading your first look…" variant="detail" />
        ) : state.error ? (
          <>
            <h1 className="mb-6 font-display text-4xl">
              A first look at what’s next
            </h1>
            <ErrorState message={state.error} onRetry={state.retry} />
            <Link className="mt-5 inline-block text-gold" to="/">
              Explore MGTV
            </Link>
          </>
        ) : item ? (
          <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <img
              src={item.artwork.portraitUrl}
              alt=""
              className="mx-auto aspect-[2/3] w-full max-w-sm rounded-xl object-cover"
            />
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-gold">
                Coming Soon · First look
              </p>
              <h1 className="font-display text-5xl md:text-7xl">
                {item.title}
              </h1>
              <p className="mt-4 text-gold">
                Arrives{" "}
                {new Date(item.releaseAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </p>
              <p className="mt-3 text-sm text-text-secondary">
                {item.classification}
              </p>
              <p className="mt-6 max-w-2xl text-text-secondary">
                {item.synopsis}
              </p>
              <p className="mt-8 text-sm text-text-secondary">
                Full playback opens when this title becomes available. Profile
                and subscription access will apply.
              </p>
              <Link className="mt-6 inline-block text-gold" to="/">
                Discover more on MGTV ›
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
