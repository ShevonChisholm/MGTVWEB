import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useLibraryPage, libraryPath } from "@/lib/musicLibrary";
import { ButtonLink } from "@/components/ui/Button";
export function CollectionVideoNavigation({
  currentId,
}: {
  currentId: string;
}) {
  const [params] = useSearchParams();
  const id = params.get("collection");
  return id ? (
    <Navigation
      key={id + params.get("own")}
      id={id}
      own={params.get("own") === "1"}
      currentId={currentId}
    />
  ) : null;
}
function Navigation({
  id,
  own,
  currentId,
}: {
  id: string;
  own: boolean;
  currentId: string;
}) {
  const view = useLibraryPage(
      "/" + (own ? "my-playlists" : "playlists") + "/" + id,
    ),
    navigate = useNavigate();
  const items = view.data?.items ?? [],
    index = items.findIndex((m: any) => m.id === currentId),
    next = index >= 0 ? items[index + 1] : null,
    previous = index > 0 ? items[index - 1] : null;
  const target = (mid: string) =>
    "/music/video/" +
    mid +
    "?collection=" +
    id +
    (own ? "&own=1" : "") +
    "&autoplay=1";
  useEffect(() => {
    const ended = (event: Event) => {
      if ((event as CustomEvent).detail === currentId && next)
        navigate(target(next.id));
    };
    window.addEventListener("mgtv-library-video-ended", ended);
    return () => window.removeEventListener("mgtv-library-video-ended", ended);
  }, [next?.id, currentId, id, own]);
  return (
    <nav
      aria-label="Playlist playback"
      className="my-6 rounded-xl border border-text-muted/30 bg-bg-surface p-5"
    >
      <p className="mb-4 text-gold">
        {view.data?.title ?? "Playlist"}
        {index >= 0 ? ` · ${index + 1} of ${items.length}` : ""}
      </p>
      {view.error && <p role="alert">{view.error}</p>}
      <div className="flex flex-wrap gap-3">
        {previous && (
          <ButtonLink variant="outline" to={target(previous.id)}>
            Previous video
          </ButtonLink>
        )}
        {next && (
          <ButtonLink to={target(next.id)}>
            Next video · {next.title}
          </ButtonLink>
        )}
        <ButtonLink variant="ghost" to={libraryPath("playlists", id, own)}>
          Back to playlist
        </ButtonLink>
      </div>
    </nav>
  );
}
