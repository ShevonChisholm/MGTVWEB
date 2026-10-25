import { Link } from "react-router";
import { useLibraryPage } from "@/lib/musicLibrary";
export function MusicCollectionCredits({ musicId }: { musicId: string }) {
  const view = useLibraryPage("/music/" + musicId + "/collections");
  return (
    <div className="my-5 flex flex-wrap gap-4 text-sm">
      {view.data?.artists.map((a: any) => (
        <Link
          key={a.id}
          className="text-gold hover:underline"
          to={"/music/artist/" + a.id}
        >
          Meet {a.title}
        </Link>
      ))}
      {view.data?.albums.map((a: any) => (
        <Link
          key={a.id}
          className="text-gold hover:underline"
          to={"/music/album/" + a.id}
        >
          On {a.title}
        </Link>
      ))}
      {view.error && (
        <p role="status" className="text-text-secondary">
          Artist and album links could not be loaded.
        </p>
      )}
    </div>
  );
}
