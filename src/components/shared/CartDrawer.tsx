import { useInteraction } from "@/context/InteractionContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "./SessionDialog"
import { PurchaseDemo } from "./PurchaseDemo"
export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateCartQty,
    cartTotal,
  } = useInteraction()
  if (!cartOpen) return null
  return (
    <SessionDialog
      title="Your cart · Demo only"
      placement="drawer"
      onClose={() => setCartOpen(false)}
    >
      <Text className="mb-6 text-sm text-text-secondary">
        Session-only shopping preview. Payments and orders are not connected.
      </Text>
      {!cart.length ? (
        <div className="space-y-5 py-8">
          <Text>Your cart is empty.</Text>
          <ButtonLink
            to="/shop"
            variant="outline"
            onClick={() => setCartOpen(false)}
          >
            Browse the shop
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="divide-y divide-text-muted/20">
            {cart.map(({ product, qty }) => (
              <article key={product.id} className="flex gap-4 py-5">
                <img
                  src={product.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold">{product.name}</Text>
                  <Text className="mt-1 text-sm text-gold">
                    ${product.price}
                  </Text>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() =>
                        qty === 1
                          ? removeFromCart(product.id)
                          : updateCartQty(product.id, qty - 1)
                      }
                    >
                      −
                    </Button>
                    <Text className="text-sm">{qty}</Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => updateCartQty(product.id, qty + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove ${product.name} from cart`}
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Text>Sample subtotal</Text>
            <Text className="font-display text-3xl text-gold">
              ${cartTotal.toFixed(2)}
            </Text>
          </div>
          <PurchaseDemo label="Preview checkout" className="mt-6 w-full" />
        </>
      )}
    </SessionDialog>
  )
}
