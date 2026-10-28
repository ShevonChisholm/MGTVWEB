import { EngagementIcon } from "@/components/shared/EngagementIcon";
import {
  ShowArtwork,
  ShowDetailSkeleton,
} from "@/components/shows/ShowArtwork";
import { OriginalLabel } from "@/components/shared/OriginalLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ReportContent } from "@/components/moderation/ReportContent";
import { SponsoredCards } from "@/components/shared/SponsoredCards";
import { SponsorStrip } from "@/components/shared/SponsorStrip";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import {
  useShows,
  seriesItem,
  type ApiSeries,
  type SeriesPreference,
} from "@/context/ShowsContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ApiShowCard } from "@/components/home/ApiShowCard";
import { ContentRail } from "@/components/home/ContentRail";
import { ShareBar } from "@/components/shared/ShareBar";
import { LikeButton } from "@/components/shared/LikeButton";
import { RatingWidget } from "@/components/shared/RatingWidget";
import { Text } from "@/components/ui/Text";
export default function ConnectedShowDetail() {
  const { id } = useParams(),
    shows = useShows();
  const [remote, setRemote] = useState<ApiSeries | null>(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setRemote(null);
    setError("");
    if (shows.busy || shows.profileRequired || !id) return;
    void shows
      .request("/" + id)
      .then((value) => {
        if (active) setRemote(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, shows.request, shows.busy, revision]);
  if (shows.profileRequired)
    return (
      <main className="min-h-screen px-6 py-28 md:px-8">
        <h1 className="font-display text-4xl">Choose who’s watching</h1>
        <ButtonLink to="/profiles">Choose profile</ButtonLink>
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen px-6 py-28 md:px-8">
        <h1 className="font-display text-4xl">Series unavailable</h1>
        <p role="alert" className="my-5">
          {error}
        </p>
        <Button onClick={() => setRevision((x) => x + 1)}>Try again</Button>
        <ButtonLink to="/shows" variant="ghost">
          Back to shows
        </ButtonLink>
      </main>
    );
  if (!remote) return <ShowDetailSkeleton />;
  return <ShowView key={shows.audience + remote.id} remote={remote} />;
}
function ShowView({ remote }: { remote: ApiSeries }) {
  const shows = useShows(),
    navigate = useNavigate(),
    [params, setParams] = useSearchParams();
  const activeSeason = Math.max(
    0,
    (remote.seasons ?? []).findIndex((s) => s.id === params.get("season")),
  );
  const [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const show = {
    id: remote.id,
    title: remote.title,
    description: remote.synopsis,
    banner: remote.artwork.landscapeUrl,
    genre: remote.genreNames.join(" · "),
    badge:
      remote.accessTier === "premium"
        ? ("premium" as const)
        : ("free" as const),
    cast: remote.cast ?? [],
    seasons: remote.seasons ?? [],
  };
  const season = show.seasons[activeSeason] ?? show.seasons[0],
    episodes = show.seasons.flatMap((s) => s.episodes),
    featuredShows = shows.items
      .filter((s) => s.id !== remote.id)
      .map(seriesItem);
  const selectedEpisodes = season?.episodes ?? [];
  const nextEpisode =
    selectedEpisodes.find(
      (e) => e.progress && e.progress.seconds > 0 && !e.progress.completed,
    ) ??
    selectedEpisodes.find((e) => !e.progress?.completed) ??
    selectedEpisodes[0];
  const preference = shows.preference(remote);
  function save(patch: Partial<SeriesPreference>) {
    if (!shows.session) {
      navigate("/auth/sign-in");
      return;
    }
    setSaving(true);
    setError("");
    void shows
      .save(remote, patch)
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  }
  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Banner */}
      <div className="show-detail-hero">
        <ShowArtwork key={show.banner} src={show.banner} landscape priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-10 max-w-[1760px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={show.badge} />
            <span className="text-[#A3A3A3] text-xs tracking-widest uppercase">
              {show.genre}
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl text-[#F5F5F5] leading-none mb-4"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            {show.title}
          </h1>
          <OriginalLabel label={remote?.originalLabel} />
          <div className="flex flex-wrap gap-3">
            {nextEpisode && (
              <ButtonLink
                size="lg"
                to={
                  nextEpisode ? `/watch/episodes/${nextEpisode.id}` : "/shows"
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                {nextEpisode?.progress &&
                nextEpisode.progress.seconds > 0 &&
                !nextEpisode.progress.completed
                  ? "Resume episode"
                  : "Watch episode"}
              </ButtonLink>
            )}
            <Button
              variant="outline"
              size="lg"
              disabled={saving}
              aria-label={preference.saved?"Remove from My List":"Save to My List"}
              title={preference.saved?"Remove from My List":"Save to My List"}
              aria-pressed={preference.saved}
              onClick={() => save({ saved: !preference.saved })}
            >
              <EngagementIcon name="save" active={preference.saved}/>
            </Button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-[1760px] mx-auto px-6 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Main */}
          <div className="md:col-span-2">
            <p className="text-[#A3A3A3] text-base leading-relaxed mb-6">
              {show.description}
            </p>
            <Text role="note" className="mb-6 text-sm text-text-secondary">
              {remote.classification} ·{" "}
              {remote.accessTier === "premium"
                ? "Eligible subscription required for this series"
                : "Free with a customer profile"}
              . Each episode also follows its own access policy.
            </Text>
            {error && (
              <p role="alert" className="mb-5 text-rose-300">
                {error}
              </p>
            )}
            {/* Like + Rating */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/6">
              <LikeButton
                id={show.id}
                remote={{
                  value: preference.liked,
                  busy: saving,
                  onToggle: () => save({ liked: !preference.liked }),
                }}
              />
              <RatingWidget
                id={show.id}
                label="Rate this show"
                remote={{
                  value: preference.rating,
                  busy: saving,
                  onRate: (rating) => save({ rating }),
                }}
              />
            </div>
            {/* Season tabs */}
            {show.seasons.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {show.seasons.map((s, i) => (
                  <button
                    key={s.id}
                    aria-pressed={activeSeason === i}
                    onClick={() => {
                      const p = new URLSearchParams(params);
                      p.set("season", s.id);
                      setParams(p);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      activeSeason === i
                        ? "bg-[#C9A84C] text-[#0A0A0A]"
                        : "bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5]"
                    }`}
                  >
                    Season {s.number}
                  </button>
                ))}
              </div>
            )}
            <h2 className="mb-3 font-display text-2xl">
              {season
                ? `Season ${season.number} · ${season.title}`
                : "Episodes"}
            </h2>
            {season?.synopsis && (
              <p className="mb-5 text-sm text-text-secondary">
                {season.synopsis}
              </p>
            )}
            {!season?.episodes.length && (
              <p className="mb-6 text-text-secondary">
                No published episodes in this season yet.
              </p>
            )}
            {/* Episode list */}
            <div className="show-episode-list">
              {episodes
                .filter(
                  (ep) =>
                    ep.showId === show.id && ep.seasonNumber === season?.number,
                )
                .map((ep) => (
                  <ApiShowCard key={ep.id} item={seriesItem(ep)} fluid />
                ))}
            </div>
          </div>
          {/* Sidebar */}
          <div>
            <div className="bg-[#141414] rounded-xl p-6 border border-white/8">
              <h3 className="text-[#F5F5F5] text-sm font-semibold mb-4 tracking-wider uppercase">
                Cast
              </h3>
              <ul className="space-y-2">
                {show.cast.map((name) => (
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
        <ReportContent kind="show" contentId={show.id} />
        <SponsoredCards kind="show" targetId={show.id} />
        <SponsorStrip kind="shows" id={show.id} />
        {/* Share */}
        <div className="mt-8">
          <ShareBar title={show.title} />
        </div>
        {/* Related */}
        <div className="mt-10">
          <ContentRail
            title="More Shows"
            items={featuredShows}
            cardType="default"
            seeAllHref="/shows"
            seeAllLabel="All shows"
            layout="contained"
          />
        </div>
      </div>
    </main>
  );
}
