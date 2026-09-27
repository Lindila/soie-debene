import { query, withTransaction } from './db.js'
import { client as stripeClient, createStripeCheckout, fetchStripeStatus } from './payments/stripe.js'
import { createNotchpayPayment, fetchNotchpayStatus, publicKey as notchpayKey } from './payments/notchpay.js'
import { shippingPrice } from './config.js'

export class OrderError extends Error {}

const variantLabel = (optionNames, options) =>
  optionNames.map((name) => options[name]).filter(Boolean).join(' · ')

/**
 * Crée la commande (statut « pending ») à partir des prix en base — jamais de
 * ceux envoyés par le navigateur — puis ouvre la session de paiement.
 */
export async function createOrder(market, input) {
  // Refuse avant d'enregistrer quoi que ce soit si le paiement n'est pas configuré.
  if (market.provider === 'stripe') stripeClient()
  else notchpayKey()

  const ids = input.items.map((i) => i.variantId)
  const { rows: variants } = await query(
    `SELECT v.id, v.options, v.price_eur, v.price_xaf, v.stock,
            p.name, p.option_names, p.images[1] AS image
       FROM variants v JOIN products p ON p.id = v.product_id
      WHERE v.id = ANY($1) AND p.active`,
    [ids],
  )
  const byId = new Map(variants.map((v) => [v.id, v]))

  const items = input.items.map(({ variantId, quantity }) => {
    const v = byId.get(variantId)
    if (!v) throw new OrderError('Un article de ton panier n’est plus disponible.')
    const label = variantLabel(v.option_names, v.options)
    if (v.stock < quantity) {
      throw new OrderError(
        v.stock === 0
          ? `${v.name} (${label}) est en rupture de stock.`
          : `Il ne reste que ${v.stock} × ${v.name} (${label}).`,
      )
    }
    return {
      variant_id: v.id,
      product_name: v.name,
      variant_label: label,
      image: v.image,
      unit_price: market.currency === 'EUR' ? v.price_eur : v.price_xaf,
      quantity,
    }
  })

  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  const shipping = shippingPrice(market, input.shippingMethod, subtotal)
  if (!shipping) throw new OrderError('Mode de livraison invalide.')
  if (!market.countries[input.address.country]) {
    throw new OrderError('Nous ne livrons pas encore ce pays depuis ce marché.')
  }

  const order = await withTransaction(async (db) => {
    const { rows } = await db.query(
      `INSERT INTO orders (market, currency, subtotal, shipping, total, shipping_method,
                           customer_name, email, phone, address, payment_provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        market.id,
        market.currency,
        subtotal,
        shipping.price,
        subtotal + shipping.price,
        shipping.label,
        input.name,
        input.email,
        input.phone,
        input.address,
        market.provider,
      ],
    )
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, variant_id, product_name, variant_label, image, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [rows[0].id, item.variant_id, item.product_name, item.variant_label, item.image, item.unit_price, item.quantity],
      )
    }
    return rows[0]
  })

  let payment
  try {
    payment =
      market.provider === 'stripe'
        ? await createStripeCheckout(order, items)
        : await createNotchpayPayment(order)
  } catch (err) {
    await query(`UPDATE orders SET status = 'failed' WHERE id = $1`, [order.id])
    throw err
  }

  await query('UPDATE orders SET payment_ref = $2 WHERE id = $1', [order.id, payment.reference])
  return { orderId: order.id, paymentUrl: payment.url }
}

/**
 * Passe la commande en « payée » et décrémente le stock, une seule fois.
 * Le montant payé doit correspondre exactement au total de la commande.
 */
export async function markOrderPaid(orderId, paidAmount) {
  return withTransaction(async (db) => {
    const { rows } = await db.query(
      `SELECT total FROM orders WHERE id = $1 AND status = 'pending' FOR UPDATE`,
      [orderId],
    )
    if (!rows.length) return false
    if (paidAmount !== rows[0].total) {
      console.error(`Commande ${orderId} : montant payé ${paidAmount} ≠ total ${rows[0].total}`)
      return false
    }
    await db.query(`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = $1`, [orderId])
    await db.query(
      `UPDATE variants v SET stock = GREATEST(v.stock - oi.quantity, 0)
         FROM order_items oi
        WHERE oi.order_id = $1 AND oi.variant_id = v.id`,
      [orderId],
    )
    return true
  })
}

/**
 * Pour une commande encore en attente, demande son état au prestataire de
 * paiement. Complète les webhooks : utile en local, où ils n'arrivent pas.
 */
export async function syncPaymentStatus(order) {
  if (order.status !== 'pending' || !order.payment_ref) return order.status
  const status =
    order.payment_provider === 'stripe'
      ? await fetchStripeStatus(order.payment_ref)
      : await fetchNotchpayStatus(order.payment_ref)

  if (status.paid && (await markOrderPaid(order.id, status.amount))) return 'paid'
  if (status.failed) {
    await query(`UPDATE orders SET status = 'failed' WHERE id = $1 AND status = 'pending'`, [order.id])
    return 'failed'
  }
  return order.status
}

export async function findOrderByPaymentRef(reference) {
  const { rows } = await query('SELECT * FROM orders WHERE payment_ref = $1', [reference])
  return rows[0] ?? null
}
