import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { api } from '../lib/api.js'
import { minPriceKey } from '../lib/format.js'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const SORTS = {
  featured: 'Les incontournables',
  'price-asc': 'Prix croissant',
  'price-desc': 'Prix décroissant',
}

export default function Shop() {
  const { market } = useShop()
  const [params, setParams] = useSearchParams()
  const category = params.get('categorie') ?? ''
  const sort = params.get('tri') ?? 'featured'
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/categories').then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setProducts(null)
    api(`/products${category ? `?category=${encodeURIComponent(category)}` : ''}`)
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [category])

  const sorted = useMemo(() => {
    if (!products) return null
    const key = minPriceKey(market.currency)
    const list = [...products]
    if (sort === 'price-asc') list.sort((a, b) => a[key] - b[key])
    if (sort === 'price-desc') list.sort((a, b) => b[key] - a[key])
    if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [products, sort, market.currency])

  const current = categories.find((c) => c.slug === category)

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="container-x pt-12">
      <div className="text-center">
        <p className="eyebrow">{current ? 'Collection' : 'La boutique'}</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">{current?.name ?? 'Toute la collection'}</h1>
        {current?.tagline && <p className="mt-4 text-cocoa">{current.tagline}</p>}
      </div>

      <div className="sticky top-[104px] z-20 -mx-5 mt-10 border-y border-espresso/10 bg-cream/95 px-5 py-3 backdrop-blur sm:top-[106px] sm:mx-0 sm:rounded-full sm:border sm:px-3">
        <div className="flex items-center justify-between gap-4">
          <div className="-my-1 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
            <FilterPill active={!category} onClick={() => update('categorie', '')}>
              Tout
            </FilterPill>
            {categories.map((c) => (
              <FilterPill key={c.slug} active={category === c.slug} onClick={() => update('categorie', c.slug)}>
                {c.name}
              </FilterPill>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => update('tri', e.target.value === 'featured' ? '' : e.target.value)}
            className="hidden shrink-0 rounded-full border border-espresso/15 bg-white px-4 py-2 text-sm outline-none sm:block"
            aria-label="Trier"
          >
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mt-16 text-center text-cocoa">{error}</p>}

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        {sorted
          ? sorted.map((p) => <ProductCard key={p.slug} product={p} />)
          : !error &&
            Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-sand" />
                <div className="mt-4 h-4 w-2/3 rounded bg-sand" />
                <div className="mt-2 h-4 w-1/3 rounded bg-sand" />
              </div>
            ))}
      </div>
      {sorted?.length === 0 && <p className="mt-10 text-center text-cocoa">Aucun produit pour le moment.</p>}
    </div>
  )
}

function FilterPill({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition ${
        active ? 'bg-espresso text-cream' : 'text-cocoa hover:bg-sand'
      }`}
    >
      {children}
    </button>
  )
}
