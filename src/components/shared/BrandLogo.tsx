/** Owner-approved MGTV mark. Keep its aspect ratio and original gold treatment. */
export function BrandLogo({
  className = "h-10 w-20",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/mgtv-logo-gold-v1-256.webp`}
      srcSet={[128, 256, 512]
        .map(
          (w) =>
            `${import.meta.env.BASE_URL}brand/mgtv-logo-gold-v1-${w}.webp ${w}w`,
        )
        .join(", ")}
      sizes="128px"
      width={1782}
      height={883}
      alt={decorative ? "" : "MGTV"}
      draggable={false}
      decoding="async"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
