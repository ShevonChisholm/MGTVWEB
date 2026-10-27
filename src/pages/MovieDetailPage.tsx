import {CommentsSection} from "@/components/comments/CommentsSection";
import { MovieArtwork, MovieDetailSkeleton } from "@/components/movies/MovieArtwork";
import {OriginalLabel} from "@/components/shared/OriginalLabel";
import { ReportContent } from "@/components/moderation/ReportContent";
import { SponsoredCards } from "@/components/shared/SponsoredCards";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useMovies,
  movieItem,
  type ApiMovie,
  type MoviePreference,
} from "@/context/MovieContext";
import type { MovieDetail } from "@/data/mockContent";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { allMovieDetails, popularMovies } from "@/data/mockContent";
import { ButtonLink } from "@/components/ui/Button";
import { ContentRail } from "@/components/home/ContentRail";
import { ShareBar } from "@/components/shared/ShareBar";
import { useSaved } from "@/context/SavedContext";
import { LikeButton } from "@/components/shared/LikeButton";
import { RatingWidget } from "@/components/shared/RatingWidget";
import { Text } from "@/components/ui/Text";

export function MovieDetailPage() {
  return import.meta.env.VITE_API_MODE === "connected" ? (
    <RemoteMovieDetail />
  ) : (
    <MovieDetailView />
  );
}
function RemoteMovieDetail() {
  const { id } = useParams(),
    movies = useMovies();
  const [movie, setMovie] = useState<ApiMovie | null>(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setMovie(null);
    setError("");
    if (movies.busy || movies.profileRequired || !id) return;
    void movies
      .request("/" + encodeURIComponent(id))
      .then((value) => {
        if (active) setMovie(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, movies.request, movies.busy, revision]);
  if (movies.profileRequired)
    return (
      <main className="min-h-screen px-6 py-28 md:px-8">
        <Text as="h1" className="mb-5 font-display text-5xl">
          Choose who’s watching
        </Text>
        <ButtonLink to="/profiles">Choose profile</ButtonLink>
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen px-6 py-28 md:px-8">
        <Text as="h1" className="font-display text-4xl">
          Film unavailable
        </Text>
        <p role="alert" className="my-5">
          {error}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setRevision((x) => x + 1)}>Try again</Button>
          <ButtonLink to="/movies" variant="outline">
            Back to movies
          </ButtonLink>
        </div>
      </main>
    );
  if (!movie) return <MovieDetailSkeleton/>;
  const item = movieItem(movie);
  const view: MovieDetail = {
    id: movie.id,
    title: movie.title,
    banner: movie.artwork.landscapeUrl,
    badge: movie.accessTier === "premium" ? "premium" : "free",
    genre: movie.genreNames.join(" · "),
    year: movie.releaseYear,
    duration: item.duration!,
    description: movie.synopsis,
    director: movie.director ?? "",
    cast: movie.cast ?? [],
  };
  return (
    <>
      {" "}
      <MovieDetailView
        key={movies.audience + movie.id}
        supplied={view}
        remote={movie}
      />
      <div className="mx-auto max-w-[1760px] px-6 pb-8 md:px-8">
        <ReportContent kind="movie" contentId={id!} />
        <CommentsSection kind="movie" contentId={id!}/>
      </div>
      <SponsoredCards kind="movie" targetId={id!} />
    </>
  );
}
function MovieDetailView({
  supplied,
  remote,
}: {
  supplied?: MovieDetail;
  remote?: ApiMovie;
}) {
  const { id } = useParams();
  const { isSaved, toggle } = useSaved();
  const movies = useMovies(),
    navigate = useNavigate();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const preference = remote ? movies.preference(remote) : null;
  const update = (patch: Partial<MoviePreference>) => {
    if (!remote) return;
    if (!movies.session) {
      navigate("/auth/sign-in");
      return;
    }
    if (movies.profileRequired) {
      navigate("/profiles");
      return;
    }
    setBusy(true);
    setError("");
    void movies
      .save(remote, patch)
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  };
  const movie = supplied ?? (id ? allMovieDetails[id] : null);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-text-secondary text-lg mb-4">Movie not found.</p>
        <Link to="/movies" className="text-[#C9A84C] hover:underline text-sm">
          ← Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Banner */}
      <div className="movie-detail-hero">
        <MovieArtwork key={movie.banner} src={movie.banner} landscape priority/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-10 max-w-[1760px] mx-auto">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
            <Badge variant={movie.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">
              {movie.genre}
            </span>
            <span className="text-text-secondary text-xs">{movie.year}</span>
            <span className="text-text-secondary text-xs">
              {movie.duration}
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            {movie.title}
          </h1>
          <OriginalLabel label={remote?.originalLabel}/>
          <div className="flex gap-3 flex-wrap">
            <ButtonLink size="lg" to={`/watch/${movie.id}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </ButtonLink>
            <Button
              variant="outline"
              size="lg"
              disabled={busy}
              onClick={() =>
                remote
                  ? update({ saved: !preference?.saved })
                  : id && toggle(id)
              }
            >
              {(remote ? preference?.saved : id && isSaved(id))
                ? "✓ Saved"
                : "+ My List"}
            </Button>
            {remote?.previewAvailable && (
              <ButtonLink
                size="lg"
                variant="outline"
                to={`/watch/${movie.id}?preview=1`}
              >
                Watch preview
              </ButtonLink>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-[1760px] mx-auto px-6 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">
              {movie.description}
            </p>
            {!remote && (
              <Text role="note" className="mb-6 text-sm text-text-secondary">
                Sample editorial copy · Credits, artwork and release information
                are unconfirmed.
              </Text>
            )}
            {remote && (
              <Text className="mb-6 text-sm text-text-secondary">
                Classification: {remote.classification}
                {remote.accessTier === "premium"
                  ? " · Eligible subscription required for the full film"
                  : " · Free with a customer profile"}
              </Text>
            )}
            {error && (
              <p role="alert" className="mb-5 text-sm text-rose-300">
                {error}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/6">
              <LikeButton
                id={movie.id}
                remote={
                  remote
                    ? {
                        value: !!preference?.liked,
                        busy,
                        onToggle: () => update({ liked: !preference?.liked }),
                      }
                    : undefined
                }
              />
              <RatingWidget
                id={movie.id}
                label="Rate this film"
                remote={
                  remote
                    ? {
                        value: preference?.rating ?? null,
                        busy,
                        onRate: (rating) => update({ rating }),
                      }
                    : undefined
                }
              />
            </div>
            <ShareBar title={movie.title} />
          </div>
          <div className="space-y-6">
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <dl className="space-y-3">
                {[
                  { label: "Director", value: movie.director },
                  { label: "Genre", value: movie.genre },
                  { label: "Year", value: String(movie.year) },
                  { label: "Duration", value: movie.duration },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-text-secondary text-xs uppercase tracking-wider">
                      {label}
                    </dt>
                    <dd className="text-[#F5F5F5] text-sm mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <h3 className="text-[#F5F5F5] text-sm font-semibold mb-3 uppercase tracking-wider">
                Cast
              </h3>
              <ul className="space-y-2">
                {movie.cast.map((name) => (
                  <li
                    key={name}
                    className="text-[#A3A3A3] text-sm flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2A2010] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A84C] text-xs font-bold">
                        {name[0]}
                      </span>
                    </div>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ContentRail
            title="More Movies"
            items={
              remote
                ? movies.items
                    .filter((item) => item.id !== movie.id)
                    .map(movieItem)
                : popularMovies
            }
            cardType="default"
            seeAllHref="/movies"
            seeAllLabel="All movies"
            layout="contained"
          />
        </div>
      </div>
    </div>
  );
}
