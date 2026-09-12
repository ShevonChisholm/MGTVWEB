import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { products, lifestyleArticles, type Product, type ProductCategory } from '@/data/mockContent'
import { useInteraction } from '@/context/InteractionContext'
import { useToast } from '@/context/ToastContext'

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'merch', label: 'Merch' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'travel', label: 'Travel' },
]

const BADGE_COLORS: Record<string, string> = {
  new: 'bg-[#C9A84C] text-[#0A0A0A]',
  sale: 'bg-[#EF4444] text-white',
  exclusive: 'bg-[#818CF8] text-white',
  limited: 'bg-[#FB923C] text-white',
}

function ProductCard({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false)
  const { addToCart } = useInteraction()
  const { addToast } = useToast()

  const handleQuickAdd = (e: MouseEvent) => {
    e.preventDefault()
    addToCart(product, 1)
    addToast(`${product.name} added to cart`, 'success')
  }

  return (
    <div className="group relative bg-[#111111] hover:bg-[#161616] transition-colors duration-200">
      <Link to={`/shop/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.badge && (
            <div className={`absolute top-3 left-3 text-[9px] font-black tracking-[0.15em] uppercase px-2 py-1 ${BADGE_COLORS[product.badge]}`}>
              {product.badge}
            </div>
          )}
          {/* Quick add overlay */}
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] text-xs font-black tracking-widest uppercase text-center py-2.5 hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              + Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[#A3A3A3] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
            {product.category}
          </p>
          <h3 className="text-[#F5F5F5] text-sm font-semibold leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[#C9A84C] font-bold text-base" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[#4A4A4A] text-sm line-through">${product.originalPrice}</span>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.rating) ? 'text-[#C9A84C]' : 'text-[#2A2A2A]'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[#4A4A4A] text-[10px]">({product.reviewCount})</span>
          </div>
        </div>
      </Link>
      {/* Save */}
      <button
        onClick={() => setSaved(v => !v)}
        className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-[#C9A84C]/20 transition-colors cursor-pointer"
        aria-label="Save"
      >
        <svg className={`w-4 h-4 ${saved ? 'text-[#C9A84C] fill-current' : 'text-white'}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  )
}

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')

  const featuredProduct = products.find(p => p.category === 'travel')!
  const featuredLifestyle = lifestyleArticles.find(a => a.featured)!

  let filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">

      {/* HERO — Commerce + Culture Split */}
      <section
        className="relative overflow-hidden"
        style={{ height: 'clamp(440px, 62vh, 680px)' }}
      >
        <div className="absolute inset-0 flex">
          {/* Left: Dark editorial panel */}
          <div className="relative w-full md:w-[48%] bg-[#080808] flex flex-col justify-end px-12 md:px-16 pb-14 z-10">
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent" />
            {/* Giant watermark */}
            <div
              className="absolute inset-0 flex items-center justify-start pl-8 pointer-events-none overflow-hidden select-none"
              aria-hidden
            >
              <span
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(6rem, 16vw, 12rem)',
                  letterSpacing: '-0.02em',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(201,168,76,0.06)',
                  lineHeight: 1,
                }}
              >
                SHOP
              </span>
            </div>
            {/* Nav breadcrumb */}
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.35em] uppercase mb-6">
              MGTV · Commerce &amp; Culture
            </p>
            <h1
              className="text-[#F5F5F5] leading-none mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '0.03em' }}
            >
              Wear the<br />
              <span className="text-[#C9A84C]">Culture</span>
            </h1>
            <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-[340px] mb-8">
              Exclusive MGTV merch, Caribbean artisan goods, curated experiences, and culture-forward products — all in one place.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-[#C9A84C] text-[#0A0A0A] text-sm font-black tracking-widest uppercase px-8 py-3.5 hover:bg-[#E2C36A] transition-colors cursor-pointer">
                Shop Now
              </button>
              <Link to="/lifestyle" className="text-[#A3A3A3] text-sm font-semibold hover:text-[#C9A84C] transition-colors flex items-center gap-1.5">
                Explore Lifestyle
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Product showcase */}
          <div className="hidden md:block flex-1 relative overflow-hidden">
            {/* Background product images in a mosaic */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0.5 opacity-90">
              {products.slice(0, 6).map((p, i) => (
                <div key={p.id} className="relative overflow-hidden" style={{ opacity: i === 2 || i === 3 ? 1 : 0.6 }}>
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Gradient blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* LIFESTYLE FEATURE BANNER */}
      <section className="border-y border-white/5">
        <Link to="/lifestyle" className="group flex items-center justify-between px-8 md:px-16 py-5 hover:bg-white/2 transition-colors">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 overflow-hidden flex-shrink-0">
              <img src={featuredLifestyle.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <p className="text-[#C9A84C] text-[9px] font-black tracking-[0.25em] uppercase mb-0.5">Featured on Lifestyle</p>
              <p className="text-[#F5F5F5] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors">{featuredLifestyle.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#A3A3A3] text-xs group-hover:text-[#C9A84C] transition-colors flex-shrink-0">
            <span>Read</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </section>

      {/* FILTERS + PRODUCT GRID */}
      <section className="max-w-[1320px] mx-auto px-8 md:px-16 py-14">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-[#F5F5F5] leading-none"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.05em' }}
            >
              {activeCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.value === activeCategory)?.label}
            </h2>
            <p className="text-[#4A4A4A] text-xs mt-1">{filtered.length} products</p>
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[#4A4A4A] text-xs">Sort:</span>
            {[
              { value: 'featured', label: 'Featured' },
              { value: 'price-asc', label: 'Price ↑' },
              { value: 'price-desc', label: 'Price ↓' },
              { value: 'rating', label: 'Top Rated' },
            ].map(s => (
              <button
                key={s.value}
                onClick={() => setSortBy(s.value as typeof sortBy)}
                className={`text-xs px-3 py-1.5 transition-colors cursor-pointer ${sortBy === s.value ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold' : 'text-[#6B6B6B] hover:text-[#A3A3A3]'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-white/6 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                activeCategory === cat.value
                  ? 'text-[#F5F5F5] border-[#C9A84C]'
                  : 'text-[#4A4A4A] border-transparent hover:text-[#A3A3A3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FEATURED EXPERIENCE BANNER */}
      <section className="max-w-[1320px] mx-auto px-8 md:px-16 pb-16">
        <div
          className="relative overflow-hidden"
          style={{ minHeight: 260 }}
        >
          <img src={featuredProduct.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="relative z-10 p-10 md:p-14 max-w-lg">
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.35em] uppercase mb-4">Featured Experience</p>
            <h3
              className="text-[#F5F5F5] leading-none mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', letterSpacing: '0.03em' }}
            >
              {featuredProduct.name}
            </h3>
            <p className="text-[#A3A3A3] text-sm leading-relaxed mb-6">{featuredProduct.description}</p>
            <Link
              to={`/shop/${featuredProduct.id}`}
              className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-sm font-black tracking-widest uppercase px-8 py-3.5 hover:bg-[#E2C36A] transition-colors"
            >
              From ${featuredProduct.price}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
