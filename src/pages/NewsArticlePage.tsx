import { useParams, Link } from 'react-router'
import { newsArticles, extraNewsArticles, latestNews } from '@/data/mockContent'

const allNewsArticles = { ...newsArticles, ...extraNewsArticles }
import { ShareBar } from '@/components/shared/ShareBar'

export function NewsArticlePage() {
  const { id } = useParams()
  const article = id ? allNewsArticles[id] : null

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 flex flex-col items-center justify-center text-center px-8">
        <p className="text-[#6B6B6B] text-lg mb-4">Article not found.</p>
        <Link to="/news" className="text-[#C9A84C] hover:underline text-sm">← Back to News</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={article.hero} alt={article.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      {/* Article body */}
      <div className="max-w-[760px] mx-auto px-8 py-10">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase">{article.category}</span>
          <span className="text-[#3A3A3A]">·</span>
          <span className="text-[#6B6B6B] text-xs">{article.publishedAt}</span>
          <span className="text-[#3A3A3A]">·</span>
          <span className="text-[#6B6B6B] text-xs">By {article.author}</span>
        </div>

        <h1
          className="text-4xl md:text-6xl text-[#F5F5F5] leading-tight mb-8"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          {article.title}
        </h1>

        <div className="space-y-5">
          {article.body.map((para, i) => (
            <p key={i} className="text-[#A3A3A3] text-base leading-relaxed">{para}</p>
          ))}
        </div>

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-white/8">
          <ShareBar title={article.title} />
        </div>
      </div>

      {/* Related */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pb-16">
        <h2 className="text-3xl text-[#F5F5F5] mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Related Stories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {latestNews.filter(n => n.id !== id).slice(0, 3).map(item => (
            <Link key={item.id} to={`/news/${item.id}`} className="group bg-[#141414] rounded-xl overflow-hidden border border-white/5 hover:border-[#C9A84C]/20 transition-colors">
              <div className="relative aspect-video overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <span className="text-[#C9A84C] text-[10px] font-bold tracking-widest uppercase">{item.genre}</span>
                <h3 className="text-[#F5F5F5] text-sm font-semibold mt-1.5 leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#6B6B6B] text-xs mt-2">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
