import {OriginalLabel} from "@/components/shared/OriginalLabel";
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
    <main className="bg-bg-base pt-16">
      <section className="relative isolate overflow-hidden">
        <img
          src={item.artwork.landscapeUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
        <div className="relative max-w-4xl px-6 py-24 md:px-8">
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
          <OriginalLabel label={item?.originalLabel}/>
          <Text className="mb-4 text-sm text-text-secondary">
            {item.sport} · {item.competition} · {item.classification} ·{" "}
            {Math.ceil(item.durationSeconds / 60)} min
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
                {pref.saved ? "Saved to My List" : "Save to My List"}
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
        title="More Sports"
        items={sports.items.filter((x) => x.id !== id).map(sportsItem)}
        seeAllHref="/sports"
        seeAllLabel="All sports"
      />
    </main>
  );
}
