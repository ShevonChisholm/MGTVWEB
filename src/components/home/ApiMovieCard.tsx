import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { MovieArtwork } from "@/components/movies/MovieArtwork";
import { Badge } from "@/components/ui/Badge";
import { useMovies } from "@/context/MovieContext";
import type { ContentItem } from "@/data/mockContent";
// Same portrait-card presentation as the prototype, with server-owned state.
export function ApiMovieCard({
  item,
  fluid = false,
  continuing = false,
}: {
  item: ContentItem;
  fluid?: boolean;
  continuing?: boolean;
}) {
  const movies = useMovies(),
    movie = { id: item.id, preference: item.moviePreference };
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const saved = movie ? movies.preference(movie).saved : false;
  return (
    <article
      data-content-id={item.id}
      data-content-type="movie"
      className={`group movie-card ${fluid ? "w-full" : continuing ? "w-64 md:w-72" : "w-44 md:w-52"}`}
    >
      <Link
        to={`/movies/${item.id}`}
        aria-label={`Open ${item.title}`}
        className={`relative block overflow-hidden bg-bg-elevated movie-card__art ${continuing ? "aspect-video" : "aspect-[2/3]"}`}
      >
        <MovieArtwork
          key={continuing ? item.landscapeThumbnail : item.thumbnail}
          src={continuing ? item.landscapeThumbnail : item.thumbnail}
          landscape={continuing}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
        {item.badge && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
      </Link>
      {continuing && (
        <progress
          className="media-progress mt-2"
          max={100}
          value={item.progress ?? 0}
          aria-label={`${item.title}: ${Math.round(item.progress ?? 0)}% watched`}
        />
      )}
      <div className="movie-card__body">
        <span className="movie-card__format">Film</span>
        <Link to={`/movies/${item.id}`} className="movie-card__title">
          {item.title}
        </Link>
        <div className="movie-card__meta">
          <p>
            {item.year} · {item.duration}
          </p>
          <p>
            {item.classification} · {item.genre}
          </p>
        </div>
        <div className="movie-card__actions">
          <Link
            to={continuing ? `/watch/${item.id}` : `/movies/${item.id}`}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            {continuing ? "Resume" : "View film"}{" "}
            <span aria-hidden="true">›</span>
          </Link>
          {movies.session && movie ? (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 px-2"
              disabled={busy}
              aria-pressed={saved}
              aria-label={`${saved ? "Remove" : "Save"} ${item.title} ${saved ? "from" : "to"} My List`}
              onClick={() => {
                setBusy(true);
                setError("");
                void movies
                  .save(movie, { saved: !saved })
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              {saved ? "✓ Saved" : "+ Save"}
            </Button>
          ) : (
            <Link
              to={movies.session ? "/profiles" : "/auth/sign-in"}
              className="inline-flex min-h-11 items-center px-2 text-xs text-text-secondary"
              aria-label={`Sign in to save ${item.title}`}
            >
              + Save
            </Link>
          )}
        </div>
        {error && (
          <p role="alert" className="text-xs text-rose-300">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}
