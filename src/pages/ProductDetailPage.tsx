import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { products } from '@/data/mockContent'
import { useInteraction } from '@/context/InteractionContext'
import { useToast } from '@/context/ToastContext'
import { LikeButton } from '@/components/shared/LikeButton'
import { RatingWidget } from '@/components/shared/RatingWidget'

const BADGE_COLORS: Record<string, string> = {
  new: 'bg-[#C9A84C] text-[#0A0A0A]',
  sale: 'bg-[#EF4444] text-white',
  exclusive: 'bg-[#818CF8] text-white',
  limited: 'bg-[#FB923C] text-white',
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = products.find(p => p.id === id)
  const [qty, setQty] = useState(1)
  const { addToCart } = useInteraction()
  const { addToast } = useToast()

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-[#4A4A4A] text-sm">Product not found.</p>
          <Link to="/shop" className="text-[#C9A84C] text-sm hover:text-[#E2C36A] mt-4 inline-block">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, qty)
    addToast(`${product.name} added to cart`, 'success')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 pt-10 pb-0">
        <div className="flex items-center gap-2 text-[10px] text-[#4A4A4A] font-semibold tracking-widest uppercase">
          <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#6B6B6B]">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-[#111111]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.badge && (
              <div className={`absolute top-4 left-4 text-[9px] font-black tracking-[0.15em] uppercase px-3 py-1.5 ${BADGE_COLORS[product.badge]}`}>
                {product.badge}
              </div>
            )}
            {/* Gold accent corner */}
            <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-[#C9A84C]" />
            <div className="absolute bottom-0 right-0 w-0.5 h-12 bg-[#C9A84C]" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.3em] uppercase mb-4">{product.category}</p>

            {/* Name */}
            <h1
              className="text-[#F5F5F5] leading-none mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '0.03em' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-[#C9A84C]' : 'text-[#2A2A2A]'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#4A4A4A] text-xs">{product.rating} · {product.reviewCount} reviews</span>
            </div>

            {/* Description */}
            <p className="text-[#A3A3A3] text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(t => (
                <span key={t} className="text-[#4A4A4A] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 border border-white/8">
                  {t}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-[#C9A84C]" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[#3A3A3A] text-xl line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-[#EF4444] text-xs font-bold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/12">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 text-center text-[#F5F5F5] text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                  className="flex-1 h-12 bg-[#C9A84C] text-[#0A0A0A] font-black tracking-widest uppercase text-sm hover:bg-[#E2C36A] transition-all cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

            {/* Stock indicator */}
            <p className="text-[#4ADE80] text-[10px] font-semibold tracking-widest uppercase mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] inline-block" />
              In Stock — Ships in 2-4 business days
            </p>

            {/* Like + your rating */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/6">
              <LikeButton id={product.id} baseCount={product.reviewCount} label="Wishlist" />
              <RatingWidget id={product.id} label="Rate this product" />
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 md:px-16 pb-16">
          <div className="border-t border-white/6 pt-12">
            <h2
              className="text-[#F5F5F5] mb-8"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', letterSpacing: '0.05em' }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/shop/${p.id}`} className="group block bg-[#111111] hover:bg-[#161616] transition-colors">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-[#F5F5F5] text-xs font-semibold truncate group-hover:text-[#C9A84C] transition-colors">{p.name}</p>
                    <p className="text-[#C9A84C] text-sm font-bold mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>${p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
