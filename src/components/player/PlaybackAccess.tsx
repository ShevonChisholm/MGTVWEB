import { Link } from "react-router";
export function PlaybackAccess({
  poster,
  title,
  message,
  loading,
  signedIn,
  needsProfile,
  onRetry,
}: {
  poster?: string;
  title?: string;
  message?: string;
  loading?: boolean;
  signedIn?: boolean;
  needsProfile?: boolean;
  onRetry?: () => void;
}) {
  const next = encodeURIComponent(location.pathname),
    href = !signedIn
      ? "/auth/sign-in?returnTo=" + next
      : needsProfile
        ? "/profiles?returnTo=" + next
        : "/mgtv-plus";
  return (
    <div className="absolute inset-0 isolate grid place-items-center overflow-hidden bg-black">
      {poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
      <div className="max-w-lg px-5 text-center">
        <span className="font-display text-2xl text-gold sm:text-3xl">
          MGTV
        </span>
        <h2 className="mt-1 font-display text-xl sm:text-3xl">
          {loading
            ? "Your story is loading…"
            : !signedIn
              ? "Your next story starts here."
              : "Keep your story going."}
        </h2>
        <p
          role={loading ? "status" : "alert"}
          className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/80 sm:text-sm"
        >
          {loading
            ? "Checking access and preparing your video."
            : (message ?? title)}
        </p>
        {!loading && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              to={href}
              className="inline-flex min-h-11 items-center rounded-md bg-gold px-4 text-xs font-semibold text-black hover:bg-gold-light"
            >
              {!signedIn
                ? "Sign in to watch the full video"
                : needsProfile
                  ? "Choose who’s watching"
                  : "Explore MGTV access"}
            </Link>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="min-h-10 px-3 text-xs text-white/80 hover:text-gold"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
