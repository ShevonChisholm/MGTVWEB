import { Text } from '@/components/ui/Text'
import { ButtonLink } from '@/components/ui/Button'

export function ContentUnavailable({ kind = 'Content', backTo = '/', backLabel = 'Explore MGTV' }: { kind?: string; backTo?: string; backLabel?: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg-base px-6 pt-24 text-center">
      <Text className="text-xs uppercase tracking-widest text-gold">MGTV sample catalog</Text>
      <Text as="h1" className="font-display text-5xl text-text-primary">{kind} unavailable</Text>
      <Text className="max-w-md text-sm leading-relaxed text-text-secondary">This item isn’t in the prototype catalog and cannot be played here. No alternative item has been substituted.</Text>
      <ButtonLink to={backTo}>{backLabel}</ButtonLink>
    </main>
  )
}
