import { Link } from 'react-router'
import { useShop } from '../context/ShopContext.jsx'
import { minPriceKey } from '../lib/format.js'

export default function ProductCard({ product }) {
  const { money, market } = useShop()
  const [first, second] = product.images
  const soldOut = product.stock === 0

  return (
    <Link to={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <img
          src={first}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
            second ? 'group-hover:opacity-0' : ''
          }`}
        />
        {second && (
          <img
            src={second}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        {(product.badge || soldOut) && (
          <span className="absolute top-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase">
            {soldOut ? 'Épuisé' : product.badge}
          </span>
        )}
        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-espresso/90 py-2.5 text-center text-xs tracking-wide text-cream opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Choisir ma longueur
        </span>
      </div>
      <div className="mt-4 px-1">
        <p className="text-[11px] tracking-[0.2em] text-taupe uppercase">{product.texture}</p>
        <h3 className="mt-1 text-xl leading-snug transition group-hover:text-gold">{product.name}</h3>
        <p className="mt-1 text-sm text-cocoa">
          <span className="text-taupe">dès </span>
          {money(product[minPriceKey(market.currency)])}
        </p>
      </div>
    </Link>
  )
}
