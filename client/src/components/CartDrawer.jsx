import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useShop } from '../context/ShopContext.jsx'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQuantity, subtotal, money, priceOf, market } = useShop()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, setCartOpen])

  const freeFrom = market.freeShippingFrom
  const remaining = freeFrom ? freeFrom - subtotal : null

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-espresso/40 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
          <h2 className="text-2xl">Mon panier</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Fermer le panier" className="-mr-2 p-2">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag size={40} strokeWidth={1} className="text-taupe" />
            <p className="font-serif text-2xl">Ton panier est vide</p>
            <p className="text-sm text-taupe">Découvre nos tissages et perruques en cheveux 100 % naturels.</p>
            <Link to="/boutique" onClick={() => setCartOpen(false)} className="btn-dark">
              Voir la boutique
            </Link>
          </div>
        ) : (
          <>
            {remaining !== null && (
              <div className="border-b border-espresso/10 px-6 py-4 text-sm">
                {remaining > 0 ? (
                  <p>
                    Plus que <strong>{money(remaining)}</strong> pour la livraison offerte
                  </p>
                ) : (
                  <p className="text-gold">Livraison standard offerte ✓</p>
                )}
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / freeFrom) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <ul className="flex-1 divide-y divide-espresso/10 overflow-y-auto px-6">
              {cart.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-5">
                  <Link
                    to={`/produit/${item.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="h-28 w-22 shrink-0 overflow-hidden rounded-lg bg-sand"
                  >
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-lg leading-tight">{item.name}</p>
                      <p className="text-sm font-medium whitespace-nowrap">{money(priceOf(item) * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-xs text-taupe">{item.label}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-espresso/15">
                        <button
                          onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                          className="p-2"
                          aria-label="Retirer un"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                          className="p-2"
                          aria-label="Ajouter un"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => setQuantity(item.variantId, 0)}
                        className="text-xs text-taupe underline-offset-4 hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-espresso/10 px-6 py-6">
              <div className="mb-1 flex justify-between text-lg">
                <span>Sous-total</span>
                <span className="font-medium">{money(subtotal)}</span>
              </div>
              <p className="mb-5 text-xs text-taupe">Livraison calculée à l’étape suivante.</p>
              <button
                onClick={() => {
                  setCartOpen(false)
                  navigate('/commander')
                }}
                className="btn-dark w-full"
              >
                Passer commande
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
