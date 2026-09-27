import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { api } from '../lib/api.js'
import { formatMoney } from '../lib/format.js'
import { whatsappLink } from '../config.js'
import { useShop } from '../context/ShopContext.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

/** Page de retour après paiement : attend la confirmation du prestataire. */
export default function Order() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { clearCart } = useShop()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let attempts = 0
    let timer
    const load = async () => {
      try {
        const data = await api(`/orders/${id}`)
        setOrder(data)
        if (data.status === 'paid') clearCart()
        // Le paiement peut mettre quelques secondes à être confirmé.
        if (data.status === 'pending' && !params.get('annule') && ++attempts < 20) {
          timer = setTimeout(load, 3000)
        }
      } catch (err) {
        setError(err.message)
      }
    }
    load()
    return () => clearTimeout(timer)
  }, [id, params, clearCart])

  if (error) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl">Commande introuvable</h1>
        <Link to="/" className="btn-dark mt-8">Retour à l’accueil</Link>
      </div>
    )
  }
  if (!order) return <div className="container-x py-32 text-center text-taupe">Chargement…</div>

  const money = (n) => formatMoney(n, order.currency)
  const paid = ['paid', 'shipped', 'delivered'].includes(order.status)
  const failed = order.status === 'failed' || order.status === 'cancelled' || params.get('annule')

  return (
    <div className="container-x max-w-2xl pt-16 text-center">
      {paid ? (
        <CheckCircle2 size={56} strokeWidth={1.2} className="mx-auto text-gold" />
      ) : failed ? (
        <XCircle size={56} strokeWidth={1.2} className="mx-auto text-taupe" />
      ) : (
        <Clock size={56} strokeWidth={1.2} className="mx-auto animate-pulse text-gold" />
      )}

      <p className="eyebrow mt-6">Commande n° {order.number}</p>
      <h1 className="mt-3 text-5xl">
        {paid
          ? `Merci ${order.firstName} !`
          : failed
            ? 'Paiement non abouti'
            : 'Paiement en cours de confirmation…'}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-cocoa">
        {paid
          ? 'Ton paiement est confirmé. Tu vas recevoir un message dès que ta commande est expédiée.'
          : failed
            ? 'Aucun montant n’a été prélevé. Tu peux réessayer ou nous écrire sur WhatsApp.'
            : 'Valide le paiement sur ton téléphone si ce n’est pas déjà fait. Cette page se met à jour toute seule.'}
      </p>

      <div className="mt-10 rounded-3xl bg-sand/70 p-6 text-left sm:p-8">
        <ul className="space-y-4">
          {order.items.map((i, n) => (
            <li key={n} className="flex items-center gap-4">
              <img src={i.image} alt="" className="h-16 w-13 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-serif text-lg leading-tight">{i.product_name}</p>
                <p className="text-xs text-taupe">
                  {i.variant_label} · × {i.quantity}
                </p>
              </div>
              <p className="text-sm">{money(i.unit_price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-espresso/10 pt-5 text-sm">
          <div className="flex justify-between">
            <dt>Livraison ({order.shippingMethod})</dt>
            <dd>{order.shipping === 0 ? 'Offerte' : money(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <dt>Total</dt>
            <dd>{money(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {failed ? (
          <Link to="/commander" className="btn-dark">Réessayer le paiement</Link>
        ) : (
          <Link to="/boutique" className="btn-dark">Continuer mes achats</Link>
        )}
        <a
          href={whatsappLink(`Bonjour ! Je vous écris au sujet de ma commande n° ${order.number}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-light"
        >
          <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Suivre sur WhatsApp
        </a>
      </div>
    </div>
  )
}
