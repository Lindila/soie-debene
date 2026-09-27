import express, { Router } from 'express'
import { parseStripeWebhook } from '../payments/stripe.js'
import { verifyNotchpaySignature } from '../payments/notchpay.js'
import { findOrderByPaymentRef, syncPaymentStatus } from '../orders.js'
import { query } from '../db.js'

/**
 * Webhooks des prestataires de paiement. Le corps doit rester brut pour
 * vérifier la signature. On ne croit jamais le contenu du webhook sur parole :
 * on relit l'état du paiement chez le prestataire avant de valider.
 */
export const webhooks = Router()
webhooks.use(express.raw({ type: '*/*' }))

webhooks.post('/stripe', async (req, res) => {
  let event
  try {
    event = parseStripeWebhook(req.body, req.headers['stripe-signature'])
  } catch (err) {
    console.error('Webhook Stripe refusé :', err.message)
    return res.status(400).send('Signature invalide')
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded' ||
    event.type === 'checkout.session.expired'
  ) {
    const orderId = event.data.object.metadata?.order_id
    const { rows } = await query('SELECT * FROM orders WHERE id = $1', [orderId])
    if (rows[0]) await syncPaymentStatus(rows[0])
  }
  res.json({ received: true })
})

webhooks.post('/notchpay', async (req, res) => {
  if (!verifyNotchpaySignature(req.body, req.headers['x-notch-signature'])) {
    return res.status(403).send('Signature invalide')
  }
  const payload = JSON.parse(req.body.toString('utf8'))
  const reference = payload.data?.reference
  const order = reference ? await findOrderByPaymentRef(reference) : null
  if (order) await syncPaymentStatus(order)
  res.json({ received: true })
})
