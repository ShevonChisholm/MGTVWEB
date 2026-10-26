import PlaylistArtwork from "./PlaylistArtwork";
import { Link } from "react-router";
import { libraryPath } from "@/lib/musicLibrary";
export function LibraryCard({ item, kind }: { item: any; kind: string }) {
  if (kind === "playlists")
    return (
      <article className="playlist-card min-w-0">
        <Link
          className="playlist-card__link group block"
          to={libraryPath(kind, item.id, item.isOwn)}
        >
          <PlaylistArtwork item={item} />
          <span className="sr-only">
            {item.playlistKind === "video"
              ? "Video playlist. "
              : "Audio playlist. "}
          </span>
          <h3 className="playlist-card__title">{item.title}</h3>
          <p className="playlist-card__meta">
            {item.isOwn ? "Made by you" : "Selected by MGTV"}
            {typeof item.itemCount === "number"
              ? " · " +
                item.itemCount +
                " " +
                (item.playlistKind === "video"
                  ? item.itemCount === 1
                    ? "video"
                    : "videos"
                  : item.itemCount === 1
                    ? "track"
                    : "tracks")
              : ""}
          </p>
          <span className="playlist-card__action">
            Open playlist <span aria-hidden="true">↗</span>
          </span>
        </Link>
      </article>
    );
  const image = item.coverUrl ?? item.items?.[0]?.artwork?.portraitUrl;
  return (
    <article className="min-w-0">
      <Link className="group block" to={libraryPath(kind, item.id, item.isOwn)}>
        {image ? (
          <img
            src={image}
            alt=""
            className={
              "w-full object-cover " +
              (kind === "artists"
                ? "aspect-square rounded-full"
                : "aspect-square rounded-xl")
            }
          />
        ) : (
          <div
            className="grid aspect-square place-items-center rounded-xl bg-bg-elevated text-5xl text-gold"
            aria-hidden
          >
            ♫
          </div>
        )}
        <h3 className="mt-4 break-words text-lg font-semibold group-hover:text-gold">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          {kind === "artists"
            ? item.genre
            : kind === "albums"
              ? `${item.releaseYear ?? ""} · Album`
              : item.isOwn
                ? "Your playlist"
                : `${item.playlistKind === "video" ? "Video" : "Track"} playlist · MGTV`}
        </p>
      </Link>
    </article>
  );
}
