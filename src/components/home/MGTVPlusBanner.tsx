import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

export function MGTVPlusBanner() {
  return (
    <section className="mx-auto my-8 max-w-[1760px] px-6 md:px-8">
      <div className="flex flex-col flex-wrap items-start justify-between gap-8 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-dim to-bg-surface p-6 md:flex-row md:items-center md:p-10">
        <div className="max-w-xl">
          <Text className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">
            MGTV+
          </Text>
          <Text
            as="h2"
            className="mb-4 font-display text-3xl leading-none text-text-primary md:text-5xl"
          >
            Explore the MGTV+ concept
          </Text>
          <Text className="text-base leading-relaxed text-text-secondary">
            A look at the proposed plans and selected series and films. Benefits
            are unconfirmed; playback is simulated.
          </Text>
        </div>
        <div className="flex min-w-0 max-w-full flex-col items-start gap-4">
          <div>
            <Text className="text-sm text-text-secondary">
              Sample monthly price
            </Text>
            <Text className="mt-1 text-sm text-text-secondary">
              <Text as="span" className="font-display text-4xl text-gold">
                $7.99
              </Text>{" "}
              /month
            </Text>
          </div>
          <ButtonLink size="lg" to="/mgtv-plus">
            Explore MGTV+
          </ButtonLink>
          <Text className="text-sm text-text-secondary">
            Payments are not connected.
          </Text>
        </div>
      </div>
    </section>
  )
}
