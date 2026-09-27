import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import { formatMoney, priceKey } from '../lib/format.js'

const ShopContext = createContext(null)

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Navigation privée : le panier vit seulement le temps de la visite.
  }
}

/** Au premier passage, devine le marché d'après le fuseau horaire. */
function guessMarket() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  return zone.startsWith('Africa/') ? 'cm' : 'eu'
}

export function ShopProvider({ children }) {
  const [markets, setMarkets] = useState([])
  const [marketId, setMarketId] = useState(() => readStorage('market', null) ?? guessMarket())
  const [cart, setCart] = useState(() => readStorage('cart', []))
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    api('/markets').then(setMarkets).catch(() => {})
  }, [])
  useEffect(() => {
    writeStorage('cart', cart)
  }, [cart])
  useEffect(() => {
    writeStorage('market', marketId)
  }, [marketId])

  const market = markets.find((m) => m.id === marketId) ?? {
    id: marketId,
    currency: marketId === 'cm' ? 'XAF' : 'EUR',
    shipping: [],
    countries: {},
  }

  const addToCart = useCallback((item, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((i) => i.variantId === item.variantId)
      if (existing) {
        return current.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: Math.min(i.quantity + quantity, 20) } : i,
        )
      }
      return [...current, { ...item, quantity }]
    })
    setCartOpen(true)
  }, [])

  const setQuantity = useCallback((variantId, quantity) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((i) => i.variantId !== variantId)
        : current.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(quantity, 20) } : i)),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const value = useMemo(() => {
    const key = priceKey(market.currency)
    const subtotal = cart.reduce((sum, i) => sum + i[key] * i.quantity, 0)
    return {
      markets,
      market,
      setMarketId,
      cart,
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      money: (amount) => formatMoney(amount, market.currency),
      priceOf: (item) => item[key],
      addToCart,
      setQuantity,
      clearCart,
      cartOpen,
      setCartOpen,
    }
  }, [markets, market, cart, cartOpen, addToCart, setQuantity, clearCart])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
