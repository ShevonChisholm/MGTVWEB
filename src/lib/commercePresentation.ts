export type ShopOption = {
  id: string;
  label: string;
  price_minor: number;
  available: number;
  active?: boolean;
  starts_at?: string | null;
};
export type ShopProduct = {
  id: string;
  name: string;
  category: string;
  kind: "physical" | "digital" | "experience" | "travel";
  image_version_id?: string | null;
  options: ShopOption[];
};
export function productPresentation(p: ShopProduct, now = Date.now()) {
  const dated = p.kind === "experience" || p.kind === "travel";
  const options = p.options.filter((o) => o.active !== false);
  const future = options.filter(
    (o) => !dated || (!!o.starts_at && Date.parse(o.starts_at) > now),
  );
  const bookable = future.filter((o) => Number(o.available) > 0);
  const prices = (bookable.length ? bookable : future)
    .map((o) => o.price_minor)
    .filter((n) => Number.isSafeInteger(n) && n > 0);
  const price = prices.length ? Math.min(...prices) : null;
  const variedPrice = new Set(prices).size > 1;
  const nextDate = bookable
    .map((o) => o.starts_at)
    .filter((d): d is string => !!d)
    .sort()[0];
  const ticket = p.category.toLowerCase() === "event tickets";
  const type = ticket
    ? "Event ticket"
    : {
        physical: "Merchandise",
        digital: "Digital artwork",
        experience: "Experience",
        travel: "Travel",
      }[p.kind];
  const availability = bookable.length
    ? dated
      ? "Dates available"
      : "Available"
    : dated && !future.length
      ? "No upcoming dates"
      : options.length
        ? "Sold out"
        : "Currently unavailable";
  const detail = dated
    ? nextDate
      ? new Intl.DateTimeFormat("en-JM", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/Jamaica",
        }).format(new Date(nextDate)) + " · Jamaica time"
      : "Check back for new dates"
    : p.kind === "digital"
      ? "Download after verified payment"
      : options.length > 1
        ? options.length + " options · choose your fit"
        : options[0]?.label || "View product details";
  const action = !bookable.length
    ? "View details"
    : ticket
      ? "View tickets"
      : dated
        ? "Choose a date"
        : p.kind === "digital"
          ? "Explore artwork"
          : options.length > 1
            ? "Choose an option"
            : "View product";
  return {
    type,
    price,
    variedPrice,
    availability,
    available: bookable.length > 0,
    detail,
    action,
  };
}
