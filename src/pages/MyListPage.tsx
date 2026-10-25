import {SavedLifestyleStories} from "./ConnectedLifestyle";
import { MovieDiscovery } from "@/components/movies/MovieDiscovery";
import { useSaved } from "@/context/SavedContext";
import { useAppState } from "@/context/AppStateContext";
import { useCatalog } from "@/hooks/useCatalog";
import { ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { DiscoveryResults } from "@/components/shared/DiscoveryResults";
export function MyListPage() {
  return import.meta.env.VITE_API_MODE === "connected" ? (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-[1760px] px-6 md:px-8">
        <Text as="h1" className="font-display text-5xl">
          My List
        </Text>
        <Text className="mt-4 text-sm text-text-secondary">
          Films, series, music and lifestyle stories saved for your current profile.
        </Text>
      </div>
      <MovieDiscovery saved title="Saved films" />
      <MovieDiscovery collection="sports" saved title="Saved sports" />
      <MovieDiscovery collection="shows" saved title="Saved series" />
      <MovieDiscovery collection="music" saved title="Saved music" />
      <SavedLifestyleStories/>
    </main>
  ) : (
    <PrototypeMyListPage />
  );
}
function PrototypeMyListPage() {
  const app = useAppState();
  const { saved } = useSaved();
  const { catalog } = useCatalog();
  const items = catalog.filter((item) => saved.has(item.id));
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1760px] px-6 py-16 md:px-8">
        <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
          {app.profile?.name}'s collection
        </Text>
        <Text as="h1" className="font-display text-5xl">
          My List
        </Text>
        <Text className="mt-4 text-sm text-text-secondary">
          {items.length} available saved items. Separate for each profile;
          reload resets the demo.
        </Text>
        {items.length ? (
          <DiscoveryResults
            items={items}
            scope="my-list"
            title="Saved for you"
            layout="contained"
          />
        ) : (
          <div className="space-y-5 py-16">
            <Text as="h2" className="font-display text-3xl">
              {saved.size
                ? "No saved items available for this profile."
                : "Your next favourites belong here."}
            </Text>
            <Text className="text-sm text-text-secondary">
              {saved.size
                ? "Content controls hide the saved items in this view. Your saved list has not been deleted."
                : "Choose Save on a title to add it to My List. Choose Saved to remove it. Your list belongs to this demo profile and resets when you reload."}
            </Text>
            <ButtonLink to="/">Explore MGTV</ButtonLink>
          </div>
        )}
      </div>
    </main>
  );
}
