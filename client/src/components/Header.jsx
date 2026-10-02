import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { BRAND } from '../config.js'
import { useShop } from '../context/ShopContext.jsx'
import MarketSwitch from './MarketSwitch.jsx'

const NAV = [
  { to: '/boutique', label: 'Boutique' },
  { to: '/boutique?categorie=perruques', label: 'Perruques' },
  { to: '/boutique?categorie=tissages', label: 'Tissages' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { cartCount, setCartOpen, market, money } = useShop()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const announcement =
    market.id === 'cm'
      ? 'Paiement MTN Mobile Money & Orange Money · Livraison 24 – 48 h à Douala et Yaoundé'
      : `Livraison offerte dès ${money(market.freeShippingFrom ?? 15000)} · Paiement sécurisé en 1 clic`

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-espresso px-4 py-2 text-center text-[11px] tracking-[0.15em] text-cream/90 uppercase sm:text-xs">
        {announcement}
      </div>
      <div
        className={`border-b transition duration-300 ${
          scrolled ? 'border-espresso/10 bg-cream/90 backdrop-blur-md' : 'border-transparent bg-cream'
        }`}
      >
        <div className="container-x flex h-18 items-center justify-between gap-4">
          <button
            className="-ml-2 p-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link to="/" className="flex flex-col items-center leading-none lg:items-start">
            <span className="font-serif text-2xl font-semibold tracking-wide sm:text-3xl">{BRAND.name}</span>
            <span className="mt-1 hidden text-[10px] tracking-[0.3em] text-gold uppercase sm:block">
              {BRAND.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="text-sm tracking-wide text-cocoa transition hover:text-gold"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <MarketSwitch />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative -mr-2 p-2 transition hover:text-gold"
              aria-label={`Panier, ${cartCount} article(s)`}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-espresso/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-cream p-6 shadow-2xl">
            <div className="mb-10 flex items-center justify-between">
              <span className="font-serif text-2xl font-semibold">{BRAND.name}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" className="-mr-2 p-2">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="border-b border-espresso/10 py-4 font-serif text-2xl"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <p className="mb-3 text-xs tracking-[0.2em] text-taupe uppercase">Je commande depuis</p>
              <MarketSwitch />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
