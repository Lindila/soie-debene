import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Lock } from 'lucide-react'
import { api } from '../lib/api.js'
import { whatsappLink } from '../config.js'
import { useShop } from '../context/ShopContext.jsx'
import MarketSwitch from '../components/MarketSwitch.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

const PAYMENT_INFO = {
  stripe: {
    title: 'Carte bancaire, Apple Pay, Google Pay',
    text: 'Tu seras redirigée vers la page de paiement sécurisée Stripe. Nous ne voyons jamais tes données bancaires.',
  },
  notchpay: {
    title: 'MTN Mobile Money · Orange Money',
    text: 'Tu seras redirigée vers la page sécurisée NotchPay pour valider le paiement depuis ton téléphone.',
  },
}

export default function Checkout() {
  const { cart, market, money, subtotal, priceOf } = useShop()
  const countries = Object.entries(market.countries ?? {})
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    postalCode: '',
    country: '',
    shippingMethod: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pays et livraison par défaut, remis à zéro quand on change de marché.
  useEffect(() => {
    setForm((f) => ({
      ...f,
      country: countries[0]?.[0] ?? '',
      shippingMethod: market.shipping[0]?.id ?? '',
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market.id, market.shipping.length])

  const method = market.shipping.find((m) => m.id === form.shippingMethod)
  const shippingCost =
    method && method.free && market.freeShippingFrom !== null && subtotal >= market.freeShippingFrom
      ? 0
      : (method?.price ?? 0)
  const total = subtotal + shippingCost

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { paymentUrl } = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          market: market.id,
          items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          name: form.name,
          email: form.email,
          phone: form.phone,
          shippingMethod: form.shippingMethod,
          address: { line1: form.line1, city: form.city, postalCode: form.postalCode, country: form.country },
        }),
      })
      window.location.href = paymentUrl
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-5xl">Ton panier est vide</h1>
        <Link to="/boutique" className="btn-dark mt-8">
          Voir la boutique
        </Link>
      </div>
    )
  }

  const whatsappOrder = `Bonjour ! Je souhaite commander :\n${cart
    .map((i) => `• ${i.quantity} × ${i.name} (${i.label}) — ${money(priceOf(i) * i.quantity)}`)
    .join('\n')}\nSous-total : ${money(subtotal)}`

  const payment = PAYMENT_INFO[market.provider ?? (market.id === 'cm' ? 'notchpay' : 'stripe')]

  return (
    <div className="container-x pt-10">
      <h1 className="text-center text-5xl">Finaliser ma commande</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <form onSubmit={submit} className="space-y-10 lg:col-span-7">
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl">Je commande depuis</h2>
              <MarketSwitch />
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">Mes coordonnées</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field sm:col-span-2" placeholder="Nom complet" autoComplete="name" required value={form.name} onChange={set('name')} />
              <input className="field" type="email" placeholder="E-mail" autoComplete="email" required value={form.email} onChange={set('email')} />
              <input
                className="field"
                type="tel"
                placeholder={market.id === 'cm' ? 'Téléphone (6XX XX XX XX)' : 'Téléphone'}
                autoComplete="tel"
                required
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">Adresse de livraison</h2>
            <div className="grid gap-4 sm:grid-cols-6">
              <input
                className="field sm:col-span-6"
                placeholder={market.id === 'cm' ? 'Quartier, rue, point de repère' : 'Adresse'}
                autoComplete="street-address"
                required
                value={form.line1}
                onChange={set('line1')}
              />
              {market.id !== 'cm' && (
                <input className="field sm:col-span-2" placeholder="Code postal" autoComplete="postal-code" required value={form.postalCode} onChange={set('postalCode')} />
              )}
              <input
                className={`field ${market.id === 'cm' ? 'sm:col-span-3' : 'sm:col-span-2'}`}
                placeholder="Ville"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={set('city')}
              />
              <select
                className={`field ${market.id === 'cm' ? 'sm:col-span-3' : 'sm:col-span-2'}`}
                value={form.country}
                onChange={set('country')}
                aria-label="Pays"
              >
                {countries.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">Livraison</h2>
            <div className="space-y-3">
              {market.shipping.map((m) => {
                const free = m.free && market.freeShippingFrom !== null && subtotal >= market.freeShippingFrom
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-5 transition ${
                      form.shippingMethod === m.id ? 'border-espresso' : 'border-espresso/15 hover:border-espresso/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={m.id}
                      checked={form.shippingMethod === m.id}
                      onChange={set('shippingMethod')}
                      className="accent-espresso"
                    />
                    <span className="flex-1">
                      <span className="block font-medium">{m.label}</span>
                      <span className="text-sm text-taupe">{m.description}</span>
                    </span>
                    <span className="font-medium">{free ? 'Offerte' : money(m.price)}</span>
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl">Paiement</h2>
            <div className="rounded-2xl border border-espresso/15 bg-white p-5">
              <p className="flex items-center gap-2 font-medium">
                <Lock size={16} className="text-gold" /> {payment.title}
              </p>
              <p className="mt-2 text-sm text-taupe">{payment.text}</p>
            </div>
          </section>

          {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-dark w-full py-4 text-base">
            <Lock size={16} /> {submitting ? 'Redirection vers le paiement…' : `Payer ${money(total)}`}
          </button>

          <p className="text-center text-sm text-taupe">
            Tu préfères commander par message ?{' '}
            <a
              href={whatsappLink(whatsappOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-espresso underline underline-offset-4"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Envoyer mon panier sur WhatsApp
            </a>
          </p>
        </form>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-sand/70 p-6 sm:p-8 lg:sticky lg:top-32">
            <h2 className="text-2xl">Récapitulatif</h2>
            <ul className="mt-6 space-y-5">
              {cart.map((i) => (
                <li key={i.variantId} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0">
                    <img src={i.image} alt="" className="h-full w-full rounded-lg object-cover" />
                    <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-espresso text-[10px] text-cream">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg leading-tight">{i.name}</p>
                    <p className="text-xs text-taupe">{i.label}</p>
                  </div>
                  <p className="text-sm">{money(priceOf(i) * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-espresso/10 pt-6 text-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd>{shippingCost === 0 ? 'Offerte' : money(shippingCost)}</dd>
              </div>
              <div className="flex justify-between border-t border-espresso/10 pt-4 text-lg font-medium">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
