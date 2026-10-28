import { EngagementIcon } from "@/components/shared/EngagementIcon";
import SportsArtwork from "@/components/sports/SportsArtwork";
import { OriginalLabel } from "@/components/shared/OriginalLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSports, sportsItem, type ApiSports } from "@/context/SportsContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ContentRail } from "@/components/home/ContentRail";
import { ReportContent } from "@/components/moderation/ReportContent";
export function ConnectedSportsDetail() {
  const { id } = useParams(),
    sports = useSports();
  const [item, setItem] = useState<ApiSports | null>(null),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    setItem(null);
    setError("");
    if (!id || sports.busy || sports.profileRequired) return;
    void sports
      .request("/" + encodeURIComponent(id))
      .then((x) => {
        if (active) setItem(x);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, sports.request, sports.busy, sports.profileRequired, revision]);
  if (!item)
    return (
      <main className="min-h-screen px-6 py-28">
        <Text as="h1" className="font-display text-5xl">
          Sports coverage
        </Text>
        {!error && !sports.profileRequired ? (
          <LoadingSkeleton label="Loading coverage…" variant="detail" />
        ) : (
          <p role={error ? "alert" : "status"} className="my-6">
            {error ||
              (sports.profileRequired
                ? "Choose who is watching."
                : "Loading coverage…")}
          </p>
        )}
        {error && (
          <Button onClick={() => setRevision((x) => x + 1)}>Try again</Button>
        )}
        {sports.profileRequired && (
          <ButtonLink to="/profiles">Choose profile</ButtonLink>
        )}
        <ButtonLink variant="ghost" to="/sports">
          Browse Sports
        </ButtonLink>
      </main>
    );
  const pref = sports.preference(item);
  return (
    <main className="bg-bg-base pt-20">
      <section className="sports-detail-hero relative isolate overflow-hidden">
        <SportsArtwork
          key={item.artwork.landscapeUrl}
          src={item.artwork.landscapeUrl}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base/95 via-bg-base/70 to-bg-base/10" />
        <div className="relative max-w-3xl px-6 py-12 md:px-10 md:py-16">
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Sports archive ·{" "}
            {item.coverage === "replay" ? "Full replay" : "Highlights"}
          </Text>
          <Text
            as="h1"
            className="mb-5 font-display text-5xl text-text-primary md:text-7xl"
          >
            {item.title}
          </Text>
          <OriginalLabel label={item?.originalLabel} />
          <Text className="mb-4 text-sm text-text-secondary">
            {item.sport} · {item.competition} · {item.classification} ·{" "}
            {item.durationSeconds < 60
              ? Math.round(item.durationSeconds) + " sec"
              : Math.ceil(item.durationSeconds / 60) + " min"}
          </Text>
          <Text className="mb-4 text-sm text-text-secondary">
            {item.participants.join(" · ")} · {item.venue} ·{" "}
            {new Date(item.occurredAt).toLocaleDateString()}
          </Text>
          <Text className="mb-8 text-base leading-relaxed text-text-secondary">
            {item.synopsis}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={"/sports/" + id + "/watch"}>
              {item.accessTier === "premium"
                ? "Watch with MGTV+"
                : item.coverage === "highlight"
                  ? "Watch highlights"
                  : "Watch replay"}
            </ButtonLink>
            {item.previewAvailable && (
              <ButtonLink
                variant="outline"
                to={"/sports/" + id + "/watch?preview=1"}
              >
                Watch free preview
              </ButtonLink>
            )}
            {sports.session && !sports.profileRequired ? (
              <Button
                variant="outline"
                aria-label={pref.saved?"Remove from My List":"Save to My List"}
                title={pref.saved?"Remove from My List":"Save to My List"}
                aria-pressed={pref.saved}
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  setNotice("");
                  void sports
                    .save(item, { saved: !pref.saved })
                    .then(() => setNotice("My List updated."))
                    .catch((e) => setNotice(e.message))
                    .finally(() => setBusy(false));
                }}
              >
                <EngagementIcon name="save" active={pref.saved}/>
              </Button>
            ) : (
              <ButtonLink variant="outline" to="/auth/sign-in">
                Sign in to save
              </ButtonLink>
            )}
            <ButtonLink variant="ghost" to="/sports">
              All Sports
            </ButtonLink>
          </div>
          <p role="status" className="mt-4 text-sm">
            {notice}
          </p>
          <ReportContent kind="sports" contentId={item.id} />
        </div>
      </section>
      <ContentRail
        title="More from the touchline"
        items={sports.items.filter((x) => x.id !== id).map(sportsItem)}
        seeAllHref="/sports"
        seeAllLabel="All sports"
      />
    </main>
  );
}
