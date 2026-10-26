/** Only accept the label returned for an explicitly classified published revision. */
export function OriginalLabel({ label }: { label?: string | null }) {
  return label === "MGTV Original" ? (
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
      MGTV Original
    </p>
  ) : null;
}
