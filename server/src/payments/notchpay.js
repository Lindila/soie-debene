import crypto from 'node:crypto'
import { CLIENT_URL } from '../config.js'
import { PaymentConfigError } from './stripe.js'

const API = 'https://api.notchpay.co'
const FINAL_FAILURES = ['canceled', 'failed', 'rejected', 'abandoned', 'expired']

export function publicKey() {
  const key = process.env.NOTCHPAY_PUBLIC_KEY
  if (!key) {
    throw new PaymentConfigError(
      'Paiement Mobile Money indisponible : NOTCHPAY_PUBLIC_KEY manque dans server/.env',
    )
  }
  return key
}

async function notchpay(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: publicKey(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init.headers,
    },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`NotchPay ${res.status} : ${body.message ?? 'réponse invalide'}`)
  }
  return body
}

/** Crée un paiement NotchPay (MTN MoMo, Orange Money…) et renvoie { url, reference }. */
export async function createNotchpayPayment(order) {
  const body = await notchpay('/payments', {
    method: 'POST',
    body: JSON.stringify({
      amount: order.total,
      currency: 'XAF',
      customer: { name: order.customer_name, email: order.email, phone: order.phone },
      description: `Commande n° ${order.number}`,
      reference: `cmd-${order.number}-${order.id.slice(0, 8)}`,
      callback: `${CLIENT_URL}/commande/${order.id}`,
      locked_country: 'CM',
    }),
  })
  return { url: body.authorization_url, reference: body.transaction?.reference }
}

/** État d'un paiement, lu directement chez NotchPay. */
export async function fetchNotchpayStatus(reference) {
  const { transaction } = await notchpay(`/payments/${encodeURIComponent(reference)}`)
  return {
    paid: transaction?.status === 'complete',
    failed: FINAL_FAILURES.includes(transaction?.status),
    amount: Number(transaction?.amount),
  }
}

export function verifyNotchpaySignature(rawBody, signature) {
  const hash = process.env.NOTCHPAY_WEBHOOK_HASH
  if (!hash) throw new PaymentConfigError('NOTCHPAY_WEBHOOK_HASH manque dans server/.env')
  if (typeof signature !== 'string') return false
  const expected = crypto.createHmac('sha256', hash).update(rawBody).digest('hex')
  return (
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
}
