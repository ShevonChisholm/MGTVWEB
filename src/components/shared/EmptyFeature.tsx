import { Text } from "@/components/ui/Text"
export function EmptyFeature() {
  return (
    <section className="bg-bg-surface px-6 py-16 md:px-16">
      <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
        MGTV
      </Text>
      <Text as="h1" className="font-display text-5xl">
        Explore your way
      </Text>
      <Text className="mt-4 text-text-secondary">
        No featured content is available for this profile's current controls.
      </Text>
    </section>
  )
}
