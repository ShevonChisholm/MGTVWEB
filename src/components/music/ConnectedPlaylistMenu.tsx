import { useState } from "react";
import { useMusic } from "@/context/MusicContext";
import { libraryRequest } from "@/lib/musicLibrary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SessionDialog } from "@/components/shared/SessionDialog";
export function ConnectedPlaylistMenu({
  musicId,
  format,
  label = "Add to playlist",
  onSaved,
}: {
  musicId: string;
  format: "audio" | "video";
  label?: string;
  onSaved?: () => void;
}) {
  const { session } = useMusic();
  const [open, setOpen] = useState(false),
    [lists, setLists] = useState<any[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState("");
  async function load() {
    setOpen(true);
    setError("");
    setDone("");
    if (!session?.activeProfileId) return;
    setBusy(true);
    try {
      let after = "";
      let all: any[] = [];
      do {
        const r = await libraryRequest(
          "/my-playlists?limit=50" +
            (after ? "&after=" + encodeURIComponent(after) : ""),
          session,
        );
        all.push(...r.items);
        after = r.nextCursor ?? "";
      } while (after);
      setLists(all.filter((p) => p.playlistKind === format));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => void load()}>
        {label}
      </Button>
      {open && (
        <SessionDialog
          title="Find its place in your collection"
          onClose={() => setOpen(false)}
        >
          {!session?.activeProfileId ? (
            <ButtonLink to={session ? "/profiles" : "/auth/sign-in"}>
              Sign in and choose a profile
            </ButtonLink>
          ) : (
            <>
              <p className="mb-5 text-sm text-text-secondary">
                Choose one of your {format === "audio" ? "track" : "video"}{" "}
                playlists.
              </p>
              {error && (
                <p role="alert" className="mb-4 text-rose-300">
                  {error}
                </p>
              )}
              {done && (
                <p role="status" className="mb-4 text-gold">
                  {done}
                </p>
              )}
              {busy && <p role="status">Saving or loading playlists…</p>}
              <div className="grid gap-3">
                {lists.map((p) => (
                  <Button
                    variant="outline"
                    key={p.id}
                    disabled={busy || p.musicIds.includes(musicId)}
                    onClick={() => {
                      setBusy(true);
                      setError("");
                      void libraryRequest(
                        "/my-playlists/" + p.id,
                        session,
                        "PATCH",
                        { musicIds: [...p.musicIds, musicId] },
                        p.version,
                      )
                        .then((saved) => {
                          setLists((old) =>
                            old.map((x) => (x.id === saved.id ? saved : x)),
                          );
                          setDone("Added to " + p.title);
                          onSaved?.();
                        })
                        .catch((e) => setError(e.message))
                        .finally(() => setBusy(false));
                    }}
                  >
                    {p.title}
                    {p.musicIds.includes(musicId) ? " · Already added" : ""}
                  </Button>
                ))}
              </div>
              {!lists.length && !busy && <p>No compatible playlists yet.</p>}
              <ButtonLink
                className="mt-6"
                variant="ghost"
                to="/music?view=playlists"
              >
                Manage or create playlists
              </ButtonLink>
            </>
          )}
        </SessionDialog>
      )}
    </>
  );
}
