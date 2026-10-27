import { Link } from "react-router";
import type { ContentItem } from "@/data/mockContent";
import LifestyleArtwork from "./LifestyleArtwork";
export default function LifestyleCard({
  item,
  headingLevel = 3,
}: {
  item: ContentItem;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className="lifestyle-card"
      data-content-type="lifestyle"
      data-content-id={item.id}
    >
      <Link
        to={"/lifestyle/" + item.id}
        aria-label={"Read " + item.title}
        className="lifestyle-card__art"
      >
        <LifestyleArtwork
          key={item.thumbnail}
          src={item.thumbnail}
          alt={item.imageAlt ?? ""}
        />
      </Link>
      <div className="lifestyle-card__body">
        <p className="lifestyle-card__category">{item.genre}</p>
        <Heading className="lifestyle-card__title">
          <Link to={"/lifestyle/" + item.id}>{item.title}</Link>
        </Heading>
        <p className="lifestyle-card__summary">{item.description}</p>
        <p className="lifestyle-card__meta">
          {item.date} · {item.readTime}
        </p>
        <Link to={"/lifestyle/" + item.id} className="lifestyle-card__action">
          Read story <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
