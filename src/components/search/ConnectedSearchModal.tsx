import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { SessionDialog } from "@/components/shared/SessionDialog";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useDiscovery } from "@/lib/connectedDiscovery";
import { homepageItem } from "@/lib/homepage";
import { contentPath } from "@/data/mockContent";
const path = (r: any) =>
  r.kind === "episode"
    ? "/watch/episodes/" + r.id
    : ["artist", "album", "playlist"].includes(r.kind)
      ? "/music/" + r.kind + "/" + r.id
      : contentPath(homepageItem(r));
export default function ConnectedSearchModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [query, setQuery] = useState(""),
    [term, setTerm] = useState(""),
    input = useRef<HTMLInputElement>(null),
    navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => setTerm(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);
  const p = new URLSearchParams({ q: term, limit: "8" }),
    search = useDiscovery(p.toString(), !!term),
    current = term === query.trim();
  return (
    <SessionDialog title="Search MGTV" onClose={onClose} initialFocus={input}>
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/search?q=" + encodeURIComponent(query.trim()));
          onClose();
        }}
      >
        <Input
          ref={input}
          value={query}
          maxLength={120}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search titles, artists and stories"
          placeholder="Titles, artists, sports, stories…"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={!query.trim()}>
          Search
        </Button>
      </form>
      {search.profileRequired ? (
        <ButtonLink to="/profiles" onClick={onClose}>
          Choose profile
        </ButtonLink>
      ) : query.trim() && (!current || search.loading) ? (
        <p role="status" className="py-6 text-text-secondary">
          Finding stories…
        </p>
      ) : query.trim() && search.error ? (
        <div role="alert">
          <p>{search.error}</p>
          <Button variant="ghost" onClick={search.retry}>
            Try again
          </Button>
        </div>
      ) : query.trim() ? (
        <div className="space-y-1">
          {(search.data?.items ?? []).map((r: any) => (
            <Link
              key={r.kind + r.id}
              to={path(r)}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-bg-elevated"
            >
              <img
                className={
                  "h-12 w-16 shrink-0 object-cover " +
                  (r.kind === "artist" ? "rounded-full" : "rounded-md")
                }
                src={r.content.artwork?.landscapeUrl ?? r.content.coverUrl}
                alt=""
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{r.content.title}</p>
                <p className="text-xs text-text-secondary">
                  {r.content.artist ?? r.content.genre ?? r.content.category}
                </p>
              </div>
              <span className="text-xs capitalize text-gold">{r.kind}</span>
            </Link>
          ))}
          {!search.data?.items.length && (
            <p className="py-6 text-text-secondary">
              No matching stories. Try another title or artist.
            </p>
          )}
          <ButtonLink
            variant="ghost"
            to={"/search?q=" + encodeURIComponent(query.trim())}
            onClick={onClose}
          >
            See all results
          </ButtonLink>
        </div>
      ) : (
        <p className="py-6 text-sm text-text-secondary">
          A story, a sound, a moment. What are you looking for?
        </p>
      )}
    </SessionDialog>
  );
}
