import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Check, ChevronDown, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import { api } from '../lib/api.js'
import { priceKey } from '../lib/format.js'
import { whatsappLink } from '../config.js'
import { useShop } from '../context/ShopContext.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { slug } = useParams()
  const { market, money, addToCart } = useShop()
  const [product, setProduct] = useState(null)
  const [missing, setMissing] = useState(false)
  const [selection, setSelection] = useState({})
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setProduct(null)
    setMissing(false)
    setImageIndex(0)
    setQuantity(1)
    api(`/products/${slug}`)
      .then((p) => {
        setProduct(p)
        // Présélectionne la première variante en stock.
        const first = p.variants.find((v) => v.stock > 0) ?? p.variants[0]
        setSelection(first.options)
      })
      .catch(() => setMissing(true))
  }, [slug])

  const variant = useMemo(
    () =>
      product?.variants.find((v) => product.option_names.every((name) => v.options[name] === selection[name])),
    [product, selection],
  )

  if (missing) return <NotFound />
  if (!product) {
    return (
      <div className="container-x grid animate-pulse gap-10 pt-10 lg:grid-cols-2">
        <div className="aspect-[4/5] rounded-3xl bg-sand" />
        <div className="space-y-4 pt-10">
          <div className="h-10 w-3/4 rounded bg-sand" />
          <div className="h-6 w-1/4 rounded bg-sand" />
        </div>
      </div>
    )
  }

  const valuesOf = (name) => [...new Set(product.variants.map((v) => v.options[name]))]
  /** Une valeur est disponible si une variante en stock l'associe aux autres choix actuels. */
  const isAvailable = (name, value) =>
    product.variants.some(
      (v) =>
        v.stock > 0 &&
        v.options[name] === value &&
        product.option_names.every((other) => other === name || v.options[other] === selection[other]),
    )

  const label = product.option_names.map((n) => selection[n]).join(' · ')
  const price = variant ? variant[priceKey(market.currency)] : null
  const inStock = variant && variant.stock > 0

  const handleAdd = () => {
    addToCart(
      {
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        label,
        image: product.images[0],
        price_eur: variant.price_eur,
        price_xaf: variant.price_xaf,
      },
      quantity,
    )
  }

  const whatsappMessage = `Bonjour ! Je suis intéressée par : ${product.name} (${label})${
    price ? ` à ${money(price)}` : ''
  }, quantité ${quantity}. Est-ce disponible ?`

  return (
    <div className="container-x pt-8">
      <nav className="mb-8 text-xs text-taupe">
        <Link to="/" className="hover:text-espresso">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to={`/boutique?categorie=${product.category}`} className="hover:text-espresso">
          {product.category_name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-espresso">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Galerie */}
        <div className="lg:col-span-7">
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {product.images.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setImageIndex(i)}
                    className={`aspect-[4/5] w-20 overflow-hidden rounded-xl border-2 transition ${
                      i === imageIndex ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="aspect-[4/5] flex-1 overflow-hidden rounded-3xl bg-sand">
              <img
                key={imageIndex}
                src={product.images[imageIndex]}
                alt={product.name}
                className="h-full w-full animate-fade-up object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Achat */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">{product.texture}</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl">{price !== null ? money(price) : '—'}</p>
            {product.category === 'tissages' && (
              <p className="mt-1 text-xs text-taupe">Prix par paquet</p>
            )}

            <div className="mt-8 space-y-7">
              {product.option_names.map((name) => (
                <div key={name}>
                  <p className="mb-3 text-sm">
                    {name} : <span className="text-taupe">{selection[name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {valuesOf(name).map((value) => {
                      const selected = selection[name] === value
                      const available = isAvailable(name, value)
                      return (
                        <button
                          key={value}
                          onClick={() => setSelection((s) => ({ ...s, [name]: value }))}
                          className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${
                            selected
                              ? 'border-espresso bg-espresso text-cream'
                              : 'border-espresso/15 bg-white hover:border-espresso'
                          } ${available ? '' : 'text-taupe line-through opacity-60'}`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <div className="flex items-center rounded-full border border-espresso/15 bg-white">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3.5" aria-label="Moins">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(variant?.stock || 1, q + 1))}
                  className="p-3.5"
                  aria-label="Plus"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleAdd} disabled={!inStock} className="btn-dark flex-1">
                {inStock ? 'Ajouter au panier' : 'Épuisé dans cette option'}
              </button>
            </div>

            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-3 w-full border border-whatsapp/40 bg-whatsapp/10 text-espresso hover:bg-whatsapp/20"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Commander ou poser une question sur WhatsApp
            </a>

            {inStock && variant.stock <= 3 && (
              <p className="mt-4 text-sm text-gold">Plus que {variant.stock} en stock</p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-cocoa">
              <p className="flex items-center gap-2 rounded-xl bg-sand/70 p-3">
                <Truck size={16} className="text-gold" />
                {market.id === 'cm' ? 'Livré en 24 – 48 h' : 'Expédié sous 24 h'}
              </p>
              <p className="flex items-center gap-2 rounded-xl bg-sand/70 p-3">
                <ShieldCheck size={16} className="text-gold" />
                {market.id === 'cm' ? 'MoMo & Orange Money' : 'Paiement sécurisé'}
              </p>
            </div>

            <div className="mt-8 border-t border-espresso/10">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>
              <Accordion title="Caractéristiques">
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold" /> {d}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Livraison & retours">
                <p>
                  {market.id === 'cm'
                    ? 'Livraison à domicile en 24 – 48 h à Douala et Yaoundé (2 000 FCFA), envoi par agence dans les autres villes (5 000 FCFA).'
                    : 'Colissimo en 2 à 4 jours (offert dès 150 €) ou Chronopost Express en 24 h.'}{' '}
                  Pour des raisons d’hygiène, les mèches ne sont reprises que non ouvertes, dans leur emballage
                  d’origine, sous 14 jours.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-espresso/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-5 text-left">
        <span className="font-serif text-xl">{title}</span>
        <ChevronDown size={18} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-cocoa">{children}</div>}
    </div>
  )
}
