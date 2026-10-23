import { Link } from "react-router"
import {
  lifestyleArticles,
  lifestyleContent,
  products,
  type LifestyleArticle,
} from "@/data/mockContent"
import { MediaCard } from "@/components/home/MediaCard"
import { Text } from "@/components/ui/Text"
import { useCatalog } from "@/hooks/useCatalog"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
import { EmptyFeature } from "@/components/shared/EmptyFeature"

const CAT_LABELS: Record<string, string> = {
  All: "All",
  food: "Food & Cooking",
  travel: "Travel",
  fashion: "Fashion",
  culture: "Culture",
  wellness: "Wellness",
}

const CAT_COLORS: Record<string, string> = {
  food: "bg-[#FB923C]/15 text-[#FB923C]",
  travel: "bg-[#22D3EE]/15 text-[#22D3EE]",
  fashion: "bg-[#818CF8]/15 text-[#818CF8]",
  culture: "bg-[#C9A84C]/15 text-[#C9A84C]",
  wellness: "bg-[#4ADE80]/15 text-[#4ADE80]",
}

function ArticleCard({
  article,
  large,
}: {
  article: LifestyleArticle
  large?: boolean
}) {
  if (!large)
    return (
      <MediaCard
        item={lifestyleContent.find((item) => item.id === article.id)!}
        fluid
      />
    )
  return (
    <Link
      to={`/lifestyle/${article.id}`}
      className="group block relative overflow-hidden rounded-xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 ${
            large
              ? "bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/20"
              : "bg-gradient-to-t from-[#0E0E0E] via-black/30 to-transparent"
          }`}
        />
        {/* Category badge */}
        <div
          className={`absolute top-4 left-4 text-xs font-black tracking-[0.2em] uppercase px-2.5 py-1.5 ${CAT_COLORS[article.category]}`}
        >
          {CAT_LABELS[article.category]}
        </div>
        {large && (
          <div className="relative px-6 pb-8 pt-40 md:max-w-3xl md:px-10 md:pt-52">
            <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-3">
              Featured Story
            </p>
            <Text
              as="h2"
              className="font-display text-4xl md:text-6xl text-text-primary leading-tight mb-3"
            >
              {article.title}
            </Text>
            <p className="text-[#A3A3A3] text-sm leading-relaxed mb-5 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-[#C9A84C] text-[#0A0A0A] text-xs font-black tracking-widest uppercase px-6 py-2.5 hover:bg-[#E2C36A] transition-colors inline-block">
                Read story
              </div>
              <span className="text-text-secondary text-xs">
                Sample · {article.date} · {article.readTime}
              </span>
            </div>
          </div>
        )}
      </div>
      {!large && (
        <div className="p-5">
          <h3
            className="text-[#F5F5F5] leading-tight group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-2"
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "1.2rem",
              letterSpacing: "0.02em",
            }}
          >
            {article.title}
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-xs uppercase tracking-widest">
              {article.date}
            </span>
            <span className="text-text-secondary text-xs">
              {article.readTime}
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}

export function LifestylePage() {
  const { lifestyleArticles, lifestyleContent } = useCatalog()
  const featured = lifestyleArticles.find((a) => a.featured)!

  const shopPicks = products
    .filter((p) => ["clothing", "accessories"].includes(p.category))
    .slice(0, 4)
  if (!featured) return <EmptyFeature />

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* PAGE HEADER — Editorial masthead */}
      <div className="border-b border-white/6 px-6 md:px-16 py-8">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-[#C9A84C] text-xs font-black tracking-[0.4em] uppercase mb-2">
              MGTV · Caribbean Lifestyle
            </p>
            <h1
              className="text-[#F5F5F5] leading-none"
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "0.04em",
              }}
            >
              Lifestyle
            </h1>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-[#A3A3A3] text-sm hover:text-[#C9A84C] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Visit Shop
          </Link>
        </div>
      </div>

      {/* FEATURED ARTICLE */}
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <ArticleCard article={featured} large />
      </div>

      <DiscoveryResults
        items={lifestyleContent}
        scope="lifestyle"
        title="Explore lifestyle"
      />

      {/* SHOP TIE-IN — "Style the Lifestyle" */}
      <section className="border-t border-white/6 px-6 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-2">
                From the Shop
              </p>
              <h2
                className="text-[#F5F5F5] leading-none"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "2rem",
                  letterSpacing: "0.05em",
                }}
              >
                Style the Lifestyle
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[#C9A84C] text-sm font-semibold hover:text-[#E2C36A] transition-colors flex items-center gap-1"
            >
              Shop All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shopPicks.map((product) => (
              <Link
                key={product.id}
                to={`/shop/${product.id}`}
                className="group block bg-[#111111] hover:bg-[#161616] transition-colors"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">
                    {product.name}
                  </h3>
                  <p
                    className="text-[#C9A84C] font-bold mt-1"
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "1.2rem",
                    }}
                  >
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CARIBBEAN EXPERIENCES */}
      <section className="px-6 md:px-16 pb-16">
        <div className="max-w-7xl mx-auto border-t border-white/6 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-2">
                Sample experience concepts
              </p>
              <h2
                className="text-[#F5F5F5] leading-none"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "2rem",
                  letterSpacing: "0.05em",
                }}
              >
                Caribbean Experiences
              </h2>
            </div>
          </div>
          {/* Experience grid */}
          <div className="grid md:grid-cols-3 gap-0 border border-white/6">
            {[
              {
                title: "VIP Music Masterclass",
                subtitle: "Sample artist-led class concept",
                img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
                price: "$149",
                tag: "Virtual",
              },
              {
                title: "Jamaica Music Tour",
                subtitle: "Sample 5-day travel concept",
                img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
                price: "$1,299",
                tag: "Travel",
              },
              {
                title: "Caribbean Cooking Class",
                subtitle: "Sample cooking-class concept",
                img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
                price: "$79",
                tag: "Online",
              },
            ].map((exp, i) => (
              <Link
                key={i}
                to="/shop"
                className="group relative overflow-hidden border-r border-white/6 last:border-r-0"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-black tracking-widest uppercase px-2 py-1 bg-[#C9A84C] text-[#0A0A0A]">
                      {exp.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3
                      className="text-white text-lg leading-tight group-hover:text-[#C9A84C] transition-colors"
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[#A3A3A3] text-xs">{exp.subtitle}</p>
                      <span
                        className="text-[#C9A84C] font-bold text-sm"
                        style={{ fontFamily: "Bebas Neue, sans-serif" }}
                      >
                        {exp.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
