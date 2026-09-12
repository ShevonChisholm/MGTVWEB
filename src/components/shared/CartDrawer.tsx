import { useEffect } from 'react'
import { Link } from 'react-router'
import { useInteraction } from '@/context/InteractionContext'

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateCartQty, cartTotal } = useInteraction()

  useEffect(() => {
    if (cartOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[90]"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#111111] border-l border-white/8 z-[91] flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: cartOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-[#F5F5F5] font-semibold text-sm">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="text-[#4A4A4A] hover:text-[#A3A3A3] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-14 h-14 bg-[#1A1A1A] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2A2A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[#4A4A4A] text-sm">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={() => setCartOpen(false)}
                className="text-[#C9A84C] text-sm hover:text-[#E2C36A] transition-colors"
              >
                Browse the Shop →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 px-6 py-4">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-sm font-medium leading-snug line-clamp-2">{product.name}</p>
                    <p className="text-[#C9A84C] text-sm font-bold mt-0.5" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                      ${product.price}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => qty === 1 ? removeFromCart(product.id) : updateCartQty(product.id, qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors cursor-pointer text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-[#F5F5F5] text-xs font-semibold">{qty}</span>
                        <button
                          onClick={() => updateCartQty(product.id, qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors cursor-pointer text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#3A3A3A] hover:text-[#EF4444] transition-colors cursor-pointer text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/8 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#A3A3A3] text-sm">Subtotal</span>
              <span className="text-[#F5F5F5] font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.05em' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-[#C9A84C] text-[#0A0A0A] font-black tracking-widest uppercase text-sm py-3.5 hover:bg-[#E2C36A] transition-colors cursor-pointer">
              Checkout
            </button>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="block text-center text-[#4A4A4A] text-xs hover:text-[#A3A3A3] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
