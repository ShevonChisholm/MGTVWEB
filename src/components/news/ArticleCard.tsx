import { Link } from "react-router";
import type { ContentItem } from "@/data/mockContent";
import NewsArtwork from "./NewsArtwork";
export default function ArticleCard({
  item,
  headingLevel = 3,
}: {
  item: ContentItem;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className="news-card"
      data-content-type="news"
      data-content-id={item.id}
    >
      <Link
        to={"/news/" + item.id}
        aria-label={"Read " + item.title}
        className="news-card__art"
      >
        <NewsArtwork
          key={item.thumbnail}
          src={item.thumbnail}
          alt={item.imageAlt ?? ""}
        />
      </Link>
      <div className="news-card__body">
        <p className="news-card__category">{item.genre}</p>
        <Heading className="news-card__title">
          <Link to={"/news/" + item.id}>{item.title}</Link>
        </Heading>
        <p className="news-card__summary">{item.description}</p>
        <p className="news-card__meta">
          {item.date} · {item.readTime}
        </p>
        <Link to={"/news/" + item.id} className="news-card__action">
          Read story <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
