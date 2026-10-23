import { useSaved } from "@/context/SavedContext"
import { useAppState } from "@/context/AppStateContext"
import { useCatalog } from "@/hooks/useCatalog"
import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
export function MyListPage() {
  const app = useAppState()
  const { saved } = useSaved()
  const { catalog } = useCatalog()
  const items = catalog.filter((item) => saved.has(item.id))
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16">
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
  )
}
