import LifecycleRails from "@/components/home/LifecycleRails";
import {useHomepage,homepageItem} from "@/lib/homepage";
import {FeaturedStatus} from "@/components/home/FeaturedStatus";
import {ConnectedLibraryCollection} from "./ConnectedMusicLibrary";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { MovieDiscovery } from "@/components/movies/MovieDiscovery";
import { useMusic } from "@/context/MusicContext";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { contentPath } from "@/data/mockContent";
import { usePlaylists } from "@/context/PlaylistContext";
import { useAppState } from "@/context/AppStateContext";
import { useCatalog } from "@/hooks/useCatalog";
import { useDiscoveryFilters } from "@/hooks/useDiscoveryFilters";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { TrackPlay, TrackCard, TrackRow } from "@/components/music/TrackCard";
import { PlaylistCard, PlaylistPlay } from "@/components/music/PlaylistCard";
import {
  DiscoveryResults,
  ActiveFilters,
  DiscoveryEmpty,
} from "@/components/shared/DiscoveryResults";
import { FilterSidebar } from "@/components/shared/FilterSidebar";
import { EmptyFeature } from "@/components/shared/EmptyFeature";
const views = [
  { id: "videos", label: "Music Videos" },
  { id: "tracks", label: "Tracks" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
  { id: "playlists", label: "Playlists" },
];
export function MusicPage() {
  const libraryAudience=useMusic().audience;
  const [params] = useSearchParams();
  const view = views.some((item) => item.id === params.get("view"))
    ? params.get("view")!
    : "videos";
  const { musicVideos, tracks, featuredArtists } = useCatalog();
  const { playlists } = usePlaylists();
  const connected = import.meta.env.VITE_API_MODE === "connected";
  const collection =
    view === "tracks"
      ? tracks
      : view === "artists"
        ? featuredArtists
        : musicVideos;
  const featuredPage=useHomepage("music");
  const pick=featuredPage.hero.find(r=>view==="artists"?r.kind==="artist":r.kind==="music"&&r.content.kind===(view==="tracks"?"track":"music-video"));
  const feature = connected ? (pick?homepageItem(pick):undefined) : collection[0];
  const featuredPlaylist =
    playlists.find((p) => p.kind === "audio") ?? playlists[0];
  const playlistView = view === "playlists";
  const title =
    connected && ["albums", "playlists"].includes(view)
      ? undefined
      : playlistView
        ? featuredPlaylist?.name
        : feature?.title;
  const image = playlistView
    ? featuredPlaylist?.coverImage
    : feature?.thumbnail;
  return (
    <main className="min-h-screen bg-bg-base"><FeaturedStatus page={featuredPage}/>
      {title ? (
        <section className="relative isolate overflow-hidden">
          <HeroBackdrop soundControlTop={84} poster={feature?.landscapeThumbnail??image??""} featureUrl={playlistView?null:feature?.featureUrl}/>
          <div className="relative mx-auto grid max-w-[1760px] items-center gap-10 px-6 py-16 md:grid-cols-[3fr_2fr] md:px-8 md:py-20">
            <div>
              <Text className="mb-5 text-xs font-semibold uppercase tracking-widest text-gold">
                The Riddim / {views.find((v) => v.id === view)?.label}
              </Text>
              <Text
                as="h1"
                className="font-display text-5xl leading-none md:text-7xl"
              >
                {title}
              </Text>
              <Text className="mt-4 text-sm text-gold">
                {playlistView
                  ? "Curated track playlist · Play in order"
                  : `${feature?.artist ?? feature?.genre} ${
                      feature?.duration ? `· ${feature.duration}` : ""
                    }`}
              </Text>
              <Text className="mb-8 mt-5 max-w-md text-sm leading-relaxed text-text-secondary">
                Explore the rhythms, voices and collaborations shaping the sound
                of MGTV. Find your next repeat listen.
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                {playlistView && featuredPlaylist ? (
                  <PlaylistPlay playlist={featuredPlaylist} />
                ) : view === "tracks" && feature ? (
                  <TrackPlay
                    track={feature}
                    ids={tracks.map((t) => t.id)}
                    origin="Featured tracks"
                  />
                ) : feature ? (
                  <ButtonLink to={contentPath(feature)}>
                    {view === "artists" ? "View artist" : "Watch video"}
                  </ButtonLink>
                ) : null}
                {playlistView && featuredPlaylist ? (
                  <ButtonLink
                    to={`/music/playlist/${featuredPlaylist.id}`}
                    variant="outline"
                  >
                    View playlist
                  </ButtonLink>
                ) : null}
              </div>
              <Text className="mt-5 text-xs text-text-secondary">
                {import.meta.env.VITE_API_MODE !== "connected"
                  ? "Local prototype · All playback is simulated · No sound"
                  : "Music videos and audio tracks"}
              </Text>
            </div>
            {image && !feature?.featureUrl && (
              <img
                src={image}
                alt={title}
                className={`mx-auto w-full max-w-sm object-cover ${
                  view === "videos"
                    ? "aspect-video rounded-xl"
                    : view === "artists"
                      ? "aspect-square rounded-full"
                      : "aspect-square rounded-xl"
                }`}
              />
            )}
          </div>
        </section>
      ) : connected ? (
        <section className="mx-auto max-w-[1760px] px-6 py-16 md:px-8">
          <Text className="mb-5 text-xs font-semibold uppercase tracking-widest text-gold">
            The Riddim
          </Text>
          <Text as="h1" className="font-display text-5xl md:text-7xl">
            Music, in your rhythm.
          </Text>
          <Text className="mt-5 max-w-lg text-sm text-text-secondary">
            Discover music videos and tracks as they arrive on MGTV.
          </Text>
        </section>
      ) : (
        <EmptyFeature />
      )}
      <LifecycleRails surface="music"/>
      <nav
        aria-label="Music formats"
        className="mx-auto mb-4 flex max-w-[1760px] overflow-x-auto border-b border-text-muted/30 px-6 md:px-8"
      >
        {views.map((item) => {
          const next = new URLSearchParams(params);
          next.set("view", item.id);
          return (
            <Link
              key={item.id}
              to={`/music?${next}`}
              aria-current={view === item.id ? "page" : undefined}
              className={`shrink-0 border-b-2 px-5 py-4 text-sm font-semibold ${
                view === item.id
                  ? "border-gold text-gold"
                  : "border-transparent text-text-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {connected&&<div className="mx-auto max-w-[1760px] px-6 py-4 md:px-8"><ButtonLink variant="outline" to="/music/player">Open your music player</ButtonLink></div>}
      {import.meta.env.VITE_API_MODE === "connected" ? (
        <ConnectedMusicCollection key={view+libraryAudience} view={view} />
      ) : playlistView ? (
        <PlaylistDiscovery />
      ) : (
        <DiscoveryResults
          key={view}
          items={collection}
          scope={view}
          title={views.find((v) => v.id === view)?.label ?? "Music"}
        >
          {view === "tracks" ? (
            <>
              <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {collection.slice(0, 3).map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    ids={collection.map((item) => item.id)}
                    origin="Music / Tracks"
                    fluid
                  />
                ))}
              </div>
              <Text as="h3" className="mb-3 font-display text-2xl">
                All tracks
              </Text>
              <Text className="mb-4 text-xs text-text-secondary">
                Play starts this ordered collection at your selection. More
                includes queue, playlist and Save actions.
              </Text>
              {collection.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  ids={collection.map((item) => item.id)}
                  origin="Music / Tracks"
                />
              ))}
            </>
          ) : undefined}
        </DiscoveryResults>
      )}
    </main>
  );
}
function PlaylistDiscovery() {
  const app = useAppState();
  const { playlists, createPlaylist } = usePlaylists();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"audio" | "video">("audio");
  const discovery = useDiscoveryFilters([], "playlists", [
    {
      id: "format",
      label: "Format",
      options: [
        { value: "audio", label: "Tracks" },
        { value: "video", label: "Videos" },
      ],
    },
    {
      id: "owner",
      label: "Collection",
      options: [
        { value: "own", label: "My playlists" },
        { value: "editorial", label: "Editorial" },
      ],
    },
  ]);
  const filtered = playlists.filter(
    (p) =>
      (!discovery.selection.format || p.kind === discovery.selection.format) &&
      (!discovery.selection.owner ||
        p.isOwn === (discovery.selection.owner === "own")),
  );
  return (
    <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-8">
      <div className="mb-10 rounded-xl bg-bg-surface p-6">
        <Text as="h2" className="mb-3 font-display text-3xl">
          Make it yours
        </Text>
        <Text className="mb-5 text-sm text-text-secondary">
          Own playlists are separate for each profile. Editorial selections stay
          shared. Reload resets changes.
        </Text>
        {app.profile ? (
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (createPlaylist(name, kind)) setName("");
            }}
          >
            {(["audio", "video"] as const).map((value) => (
              <Button
                key={value}
                variant={kind === value ? "primary" : "outline"}
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
              >
                {value === "audio" ? "Tracks" : "Videos"}
              </Button>
            ))}
            <Input
              aria-label="Playlist name"
              placeholder="Playlist name"
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-w-0 flex-1"
            />
            <Button type="submit" disabled={!name.trim()}>
              Create playlist
            </Button>
          </form>
        ) : (
          <ButtonLink
            to="/auth/sign-in?returnTo=%2Fmusic%3Fview%3Dplaylists"
            variant="outline"
          >
            Sign in to create a playlist
          </ButtonLink>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <FilterSidebar discovery={discovery} count={filtered.length} />
        <div className="min-w-0 flex-1">
          <ActiveFilters discovery={discovery} count={filtered.length} />
          {filtered.length ? (
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          ) : (
            <DiscoveryEmpty clear={discovery.clear} active={discovery.active} />
          )}
        </div>
      </div>
    </section>
  );
}

function ConnectedMusicCollection({ view }: { view: string }) {
  if (["artists","albums","playlists"].includes(view)) return <ConnectedLibraryCollection key={view} kind={view}/>;
  return (
    <MovieDiscovery
      collection="music"
      musicKind={view === "tracks" ? "track" : "music-video"}
      title={view === "tracks" ? "Tracks" : "Music Videos"}
    />
  );
}
