import { ArtistArtwork, ArtistCardSkeletons } from "@/components/music/ArtistArtwork";
import PlaylistArtwork from "@/components/music/PlaylistArtwork";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useLibraryPage, libraryPath } from "@/lib/musicLibrary";
import { LibraryCard } from "@/components/music/LibraryCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SessionDialog } from "@/components/shared/SessionDialog";
import { ShareBar } from "@/components/shared/ShareBar";
import { ApiMusicCard } from "@/components/home/ApiMusicCard";
import { musicItem, useMusic } from "@/context/MusicContext";
import { useMusicAudio } from "@/context/MusicAudioContext";
import { ConnectedPlaylistMenu } from "@/components/music/ConnectedPlaylistMenu";
export function ConnectedLibraryCollection({ kind }: { kind: string }) {
  const view = useLibraryPage("/" + kind + "?limit=24");
  const [more, setMore] = useState<any[]>([]),
    [next, setNext] = useState<string | null>(null),
    [own, setOwn] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [creating, setCreating] = useState(false),
    [title, setTitle] = useState(""),
    [format, setFormat] = useState("audio");
  const navigate = useNavigate();
  const createKey = useRef<{ body: string; key: string } | null>(null);
  useEffect(() => {
    setMore([]);
    setNext(view.data?.nextCursor ?? null);
  }, [view.data]);
  useEffect(() => {
    setOwn([]);
    if (kind === "playlists" && view.session?.activeProfileId)
      void (async () => {
        let after = "",
          all: any[] = [];
        do {
          const r = await view.request(
            "/my-playlists?limit=50" +
              (after ? "&after=" + encodeURIComponent(after) : ""),
          );
          all.push(...r.items);
          after = r.nextCursor ?? "";
        } while (after);
        return all;
      })()
        .then(setOwn)
        .catch((e) => setError(e.message));
  }, [kind, view.audience, view.data]);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        title,
        description: "",
        playlistKind: format,
        musicIds: [],
      };
      const serialized = JSON.stringify(body);
      if (createKey.current?.body !== serialized)
        createKey.current = { body: serialized, key: crypto.randomUUID() };
      const r = await view.request(
        "/my-playlists",
        "POST",
        body,
        undefined,
        createKey.current!.key,
      );
      setCreating(false);
      navigate(libraryPath("playlists", r.id, true));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Text as="h2" className="font-display text-3xl">
          {kind === "artists"
            ? "Behind the sound"
            : kind === "albums"
              ? "Listen to the whole story"
              : "Find your next repeat"}
        </Text>
        {kind === "playlists" &&
          (view.session?.activeProfileId ? (
            <Button onClick={() => setCreating(true)}>Create playlist</Button>
          ) : (
            <ButtonLink
              to={view.session ? "/profiles" : "/auth/sign-in"}
              variant="outline"
            >
              Sign in to create a playlist
            </ButtonLink>
          ))}
      </div>
      {(view.error || error) && (
        <p role="alert" className="mb-5 text-rose-300">
          {view.error || error}{" "}
          <Button variant="ghost" onClick={view.reload}>
            Try again
          </Button>
        </p>
      )}
      {view.loading && (kind === "artists" ? <ArtistCardSkeletons/> :
        <LoadingSkeleton
          label={<>Loading {kind}…</>}
          variant="products"
          columns={4}
        />
      )}
      {kind === "playlists" && own.length > 0 && (
        <>
          <Text as="h3" className="mb-5 font-display text-2xl">
            Made by you
          </Text>
          <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {own.map((p) => (
              <LibraryCard key={p.id} item={p} kind={kind} />
            ))}
          </div>
          <Text as="h3" className="mb-5 font-display text-2xl">
            Selected by MGTV
          </Text>
        </>
      )}
      <div className={kind === "artists" ? "artist-grid" : "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"}>
        {[...(view.data?.items ?? []), ...more].map((p) => (
          <LibraryCard key={p.id} item={p} kind={kind} />
        ))}
      </div>
      {!view.loading && !view.error && !view.data?.items?.length && (
        <p className="py-8 text-text-secondary">
          No published {kind} are available yet.
        </p>
      )}
      {next && (
        <Button
          className="mt-8"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void view
              .request(
                "/" + kind + "?limit=24&after=" + encodeURIComponent(next),
              )
              .then((r) => {
                setMore((old) => [...old, ...r.items]);
                setNext(r.nextCursor);
              })
              .catch((e) => setError(e.message))
              .finally(() => setBusy(false));
          }}
        >
          Load more
        </Button>
      )}
      {creating && (
        <SessionDialog
          title="Make room for your favourites"
          onClose={() => setCreating(false)}
        >
          <form onSubmit={(e) => void create(e)} className="space-y-5">
            <label className="block">
              Playlist name
              <input
                className="mt-2 w-full rounded-lg border border-text-muted/30 bg-bg-elevated p-3"
                required
                maxLength={160}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block">
              Format
              <select
                className="mt-2 w-full rounded-lg bg-bg-elevated p-3"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="audio">Tracks</option>
                <option value="video">Music videos</option>
              </select>
            </label>
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={busy}>
              Create playlist
            </Button>
          </form>
        </SessionDialog>
      )}
    </section>
  );
}
export function ConnectedLibraryDetail({ kind }: { kind: string }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const own = kind === "playlists" && params.get("own") === "1";
  const music = useMusic();
  return (
    <LibraryDetail
      key={kind + id + own + music.audience}
      kind={kind}
      id={id!}
      own={own}
    />
  );
}
function LibraryDetail({
  kind,
  id,
  own,
}: {
  kind: string;
  id: string;
  own: boolean;
}) {
  const view = useLibraryPage("/" + (own ? "my-playlists" : kind) + "/" + id),
    audio = useMusicAudio(),
    navigate = useNavigate();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [follow, setFollow] = useState<any>(null),
    [editing, setEditing] = useState(false),
    [deleting, setDeleting] = useState(false),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState("");
  const r = view.data;
  useEffect(() => {
    if (kind === "artists" && view.session?.activeProfileId)
      void view
        .request("/artists/" + id + "/follow")
        .then(setFollow)
        .catch((e) => setError(e.message));
  }, [id, kind, view.audience]);
  async function mutate(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function update(patch: any) {
    await view.request("/my-playlists/" + id, "PATCH", patch, r.version);
    view.reload();
  }
  function move(index: number, delta: number) {
    const ids = [...r.musicIds];
    [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
    void mutate(() => update({ musicIds: ids }));
  }
  if (view.loading)
    return (
      <main className="min-h-screen px-6 py-28">
        <LoadingSkeleton
          label={<>Loading {kind.slice(0, -1)}…</>}
          variant="detail"
        />
      </main>
    );
  if (view.error || !r)
    return (
      <main className="min-h-screen px-6 py-28">
        <Text as="h1" className="font-display text-4xl">
          This collection is out of reach
        </Text>
        <p role="alert" className="my-6">
          {view.error}
        </p>
        <ButtonLink to={"/music?view=" + kind}>Back to music</ButtonLink>
        <Button variant="ghost" onClick={view.reload}>
          Try again
        </Button>
      </main>
    );
  const artist = kind === "artists",
    image = r.coverUrl ?? r.items?.[0]?.artwork?.portraitUrl;
  return (
    <main className="min-h-screen bg-bg-base pt-16">
      {artist && (
        <div className="artist-profile__banner">
          <ArtistArtwork key={image} src={image} hero/>
          <ButtonLink
            className="absolute left-6 top-6 z-10 bg-black/70 md:left-8"
            variant="ghost"
            to="/music?view=artists"
          >
            Back to artists
          </ButtonLink>
        </div>
      )}
      <div
        className={
          "mx-auto max-w-[1760px] px-6 pb-16 md:px-8 " +
          (!artist ? "pt-10" : "")
        }
      >
        {!artist && (
          <ButtonLink
            to={"/music?view=" + kind}
            variant="ghost"
            className="mb-6"
          >
            Back to {kind}
          </ButtonLink>
        )}
        <section
          className={
            "relative flex flex-col gap-8 md:flex-row md:items-end " +
            (artist ? "artist-profile__identity" : "")
          }
        >
          {artist ? null : kind === "playlists" ? <div className="w-52 max-w-full shrink-0 md:w-72"><PlaylistArtwork item={r}/></div> : image ? (
            <img
              src={image}
              alt=""
              className={
                "shrink-0 object-cover " +
                (artist
                  ? "w-36 md:w-48 aspect-square rounded-full border-4 border-bg-base ring-2 ring-gold/40"
                  : "w-44 md:w-64 aspect-square rounded-xl")
              }
            />
          ) : (
            <div className="grid aspect-square w-44 shrink-0 place-items-center rounded-xl bg-bg-surface text-6xl text-gold">
              ♫
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
              {artist
                ? r.genre
                : kind === "albums"
                  ? `${r.releaseYear} · Album`
                  : own
                    ? "Your private playlist"
                    : `${r.playlistKind === "audio" ? "Tracks" : "Music videos"} · Selected by MGTV`}
            </Text>
            <Text
              as="h1"
              className="break-words font-display text-5xl md:text-7xl"
            >
              {r.title}
            </Text>
            {artist && (
              <Text className="mt-3 text-text-secondary">{r.origin}</Text>
            )}
            {!artist && (
              <p className="my-5 max-w-2xl leading-relaxed text-text-secondary">
                {r.description}
              </p>
            )}
            <div className={"flex flex-wrap gap-3 " + (artist ? "mt-5" : "")}>
              {artist ? (
                view.session?.activeProfileId ? (
                  <Button
                    disabled={busy || !follow}
                    variant={follow?.following ? "primary" : "outline"}
                    aria-pressed={!!follow?.following}
                    onClick={() =>
                      void mutate(async () =>
                        setFollow(
                          await view.request(
                            "/artists/" + id + "/follow",
                            "PUT",
                            { following: !follow.following },
                            follow.version,
                          ),
                        ),
                      )
                    }
                  >
                    {follow?.following ? "Following" : "Follow"}
                  </Button>
                ) : (
                  <ButtonLink
                    to={view.session ? "/profiles" : "/auth/sign-in"}
                    variant="outline"
                  >
                    Sign in to follow
                  </ButtonLink>
                )
              ) : (
                r.items.length > 0 &&
                (r.playlistKind === "video" ? (
                  <ButtonLink
                    to={
                      "/music/video/" +
                      r.items[0].id +
                      "?collection=" +
                      id +
                      (own ? "&own=1" : "") +
                      "&autoplay=1"
                    }
                  >
                    Watch from the start
                  </ButtonLink>
                ) : (
                  <Button
                    disabled={busy}
                    onClick={() => void mutate(() => audio.startQueue(r.items))}
                  >
                    Play in order
                  </Button>
                ))
              )}
              {!own && <ShareBar title={r.title} compact />}
              {own && (
                <>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      setTitle(r.title);
                      setDescription(r.description);
                      setEditing(true);
                    }}
                  >
                    Edit playlist
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => setDeleting(true)}
                  >
                    Delete playlist
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        {artist && (
          <section className="mt-8 max-w-2xl">
            <Text as="h2" className="mb-4 font-display text-3xl">
              Behind the sound
            </Text>
            <p className="leading-relaxed text-text-secondary">
              {r.description}
            </p>
          </section>
        )}
        {(error || view.error) && (
          <p role="alert" className="mt-6 text-rose-300">
            {error || view.error}
          </p>
        )}
        {r.unavailableCount > 0 && (
          <p className="mt-6 text-text-secondary">
            {r.unavailableCount} unavailable item(s) are hidden for this
            profile. Playback always checks current access.{" "}
            {own && (
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void mutate(() => update({ musicIds: r.musicIds }))
                }
              >
                Remove unavailable items
              </Button>
            )}
          </p>
        )}
        {!artist && (
          <p className="mt-6 text-sm text-text-secondary">
            {r.items.length} available{" "}
            {r.playlistKind === "video" ? "videos" : "tracks"} ·{" "}
            {Math.ceil(
              r.items.reduce((n: number, m: any) => n + m.durationSeconds, 0) /
                60,
            )}{" "}
            min
          </p>
        )}
        <section className="mt-10">
          <Text as="h2" className="mb-6 font-display text-3xl">
            {artist ? "Releases" : "In this collection"}
          </Text>
          {!r.items.length && (
            <p className="mb-6 text-text-secondary">
              No music is available in this collection yet.
            </p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {r.items.map((item: any, index: number) => (
              <div key={item.id} className="min-w-0">
                <ApiMusicCard item={musicItem(item)} fluid />
                {kind !== "artists" && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-text-secondary">
                      {index + 1}
                    </span>
                    {r.playlistKind === "video" ? (
                      <ButtonLink
                        size="sm"
                        to={
                          "/music/video/" +
                          item.id +
                          "?collection=" +
                          id +
                          (own ? "&own=1" : "") +
                          "&autoplay=1"
                        }
                      >
                        Watch here
                      </ButtonLink>
                    ) : (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          void mutate(() => audio.startQueue(r.items, index))
                        }
                      >
                        Play here
                      </Button>
                    )}
                    {own && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy || index === 0}
                          onClick={() => move(index, -1)}
                          aria-label={"Move " + item.title + " up"}
                        >
                          Up
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy || index === r.items.length - 1}
                          onClick={() => move(index, 1)}
                          aria-label={"Move " + item.title + " down"}
                        >
                          Down
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy}
                          onClick={() =>
                            void mutate(() =>
                              update({
                                musicIds: r.musicIds.filter(
                                  (x: string) => x !== item.id,
                                ),
                              }),
                            )
                          }
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        {own && <PlaylistAddReleases playlist={r} onSaved={view.reload} />}
        {artist && <ArtistAlbums artistId={id} />}
        {kind === "albums" && r.artistId && (
          <ButtonLink
            className="mt-8"
            variant="outline"
            to={"/music/artist/" + r.artistId}
          >
            Meet the artist
          </ButtonLink>
        )}
      </div>
      {editing && (
        <SessionDialog
          title="Your playlist, your way"
          onClose={() => setEditing(false)}
        >
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void mutate(async () => {
                await update({ title, description });
                setEditing(false);
              });
            }}
          >
            <label className="block">
              Playlist name
              <input
                className="mt-2 w-full rounded-lg bg-bg-elevated p-3"
                required
                maxLength={160}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block">
              Description
              <textarea
                className="mt-2 w-full rounded-lg bg-bg-elevated p-3"
                maxLength={6000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <Button type="submit" disabled={busy}>
              Save changes
            </Button>
          </form>
        </SessionDialog>
      )}
      {deleting && (
        <SessionDialog
          title="Delete this playlist?"
          onClose={() => setDeleting(false)}
        >
          <p className="mb-6 text-text-secondary">
            Your playlist will leave your library. The music itself stays on
            MGTV.
          </p>
          {error && <p role="alert">{error}</p>}
          <Button
            disabled={busy}
            onClick={() =>
              void mutate(async () => {
                await view.request(
                  "/my-playlists/" + id,
                  "DELETE",
                  undefined,
                  r.version,
                );
                navigate("/music?view=playlists");
              })
            }
          >
            Delete playlist
          </Button>
        </SessionDialog>
      )}
    </main>
  );
}
function PlaylistAddReleases({
  playlist,
  onSaved,
}: {
  playlist: any;
  onSaved: () => void;
}) {
  const music = useMusic();
  return (
    <section className="mt-12">
      <Text as="h2" className="mb-6 font-display text-3xl">
        Add to your collection
      </Text>
      <div className="flex flex-wrap gap-3">
        {music.items
          .filter(
            (m) =>
              m.kind ===
                (playlist.playlistKind === "video" ? "music-video" : "track") &&
              !playlist.musicIds.includes(m.id),
          )
          .map((item) => (
            <ConnectedPlaylistMenu
              key={item.id}
              musicId={item.id}
              format={playlist.playlistKind}
              label={"Add " + item.title}
              onSaved={onSaved}
            />
          ))}
      </div>
      <ButtonLink
        className="mt-4"
        variant="ghost"
        to={
          "/music?view=" +
          (playlist.playlistKind === "video" ? "videos" : "tracks")
        }
      >
        Explore more releases
      </ButtonLink>
    </section>
  );
}
function ArtistAlbums({ artistId }: { artistId: string }) {
  const base = "/albums?limit=24&artistId=" + encodeURIComponent(artistId),
    albums = useLibraryPage(base);
  const [more, setMore] = useState<any[]>([]),
    [next, setNext] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setMore([]);
    setNext(albums.data?.nextCursor ?? null);
  }, [albums.data]);
  return (
    <section className="mt-12">
      <Text as="h2" className="mb-6 font-display text-3xl">
        Albums
      </Text>
      {(albums.error || error) && <p role="alert">{albums.error || error}</p>}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[...(albums.data?.items ?? []), ...more].map((a: any) => (
          <LibraryCard kind="albums" item={a} key={a.id} />
        ))}
      </div>
      {next && (
        <Button
          className="mt-6"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void albums
              .request(base + "&after=" + encodeURIComponent(next))
              .then((r) => {
                setMore((old) => [...old, ...r.items]);
                setNext(r.nextCursor);
              })
              .catch((e) => setError(e.message))
              .finally(() => setBusy(false));
          }}
        >
          Load more albums
        </Button>
      )}
    </section>
  );
}
