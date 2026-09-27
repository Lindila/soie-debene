import Stripe from 'stripe'
import { CLIENT_URL } from '../config.js'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export class PaymentConfigError extends Error {}

export function client() {
  if (!stripe) {
    throw new PaymentConfigError(
      'Paiement par carte indisponible : STRIPE_SECRET_KEY manque dans server/.env',
    )
  }
  return stripe
}

/** Crée une page de paiement Stripe Checkout et renvoie { url, reference }. */
export async function createStripeCheckout(order, items) {
  const session = await client().checkout.sessions.create({
    mode: 'payment',
    customer_email: order.email,
    client_reference_id: order.id,
    metadata: { order_id: order.id },
    line_items: [
      ...items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: item.unit_price,
          product_data: { name: `${item.product_name} — ${item.variant_label}` },
        },
      })),
      ...(order.shipping > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency: 'eur',
                unit_amount: order.shipping,
                product_data: { name: 'Livraison' },
              },
            },
          ]
        : []),
    ],
    success_url: `${CLIENT_URL}/commande/${order.id}`,
    cancel_url: `${CLIENT_URL}/commande/${order.id}?annule=1`,
  })
  return { url: session.url, reference: session.id }
}

/** État d'une session Stripe, lu directement chez Stripe (jamais depuis le navigateur). */
export async function fetchStripeStatus(sessionId) {
  const session = await client().checkout.sessions.retrieve(sessionId)
  return {
    paid: session.payment_status === 'paid',
    failed: session.status === 'expired',
    amount: session.amount_total,
  }
}

export function parseStripeWebhook(rawBody, signature) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new PaymentConfigError('STRIPE_WEBHOOK_SECRET manque dans server/.env')
  }
  return client().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
}
