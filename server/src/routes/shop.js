import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db.js'
import { MARKETS } from '../config.js'
import { createOrder, syncPaymentStatus } from '../orders.js'

export const shop = Router()

shop.get('/markets', (_req, res) => {
  res.json(
    Object.values(MARKETS).map(({ id, label, currency, provider, countries, shipping, freeShippingFrom }) => ({
      id,
      label,
      currency,
      provider,
      countries,
      shipping,
      freeShippingFrom,
    })),
  )
})

shop.get('/categories', async (_req, res) => {
  const { rows } = await query(
    `SELECT c.slug, c.name, c.tagline, c.image, count(p.id)::int AS product_count
       FROM categories c LEFT JOIN products p ON p.category_id = c.id AND p.active
      GROUP BY c.id HAVING count(p.id) > 0 ORDER BY c.position`,
  )
  res.json(rows)
})

const PRODUCT_LIST = `
  SELECT p.slug, p.name, p.texture, p.badge, p.images, p.featured,
         c.slug AS category, c.name AS category_name,
         min(v.price_eur)::int AS min_price_eur, min(v.price_xaf)::int AS min_price_xaf,
         sum(v.stock)::int AS stock
    FROM products p
    JOIN categories c ON c.id = p.category_id
    JOIN variants v ON v.product_id = p.id
   WHERE p.active`

shop.get('/products', async (req, res) => {
  const params = []
  let sql = PRODUCT_LIST
  if (typeof req.query.category === 'string') {
    params.push(req.query.category)
    sql += ` AND c.slug = $${params.length}`
  }
  if (req.query.featured === '1') sql += ' AND p.featured'
  sql += ' GROUP BY p.id, c.id ORDER BY c.position, p.id'
  const { rows } = await query(sql, params)
  res.json(rows)
})

shop.get('/products/:slug', async (req, res) => {
  const { rows } = await query(
    `SELECT p.id, p.slug, p.name, p.texture, p.badge, p.description, p.details, p.images,
            p.option_names, c.slug AS category, c.name AS category_name,
            json_agg(json_build_object(
              'id', v.id, 'options', v.options, 'price_eur', v.price_eur,
              'price_xaf', v.price_xaf, 'stock', v.stock
            ) ORDER BY v.position) AS variants
       FROM products p
       JOIN categories c ON c.id = p.category_id
       JOIN variants v ON v.product_id = p.id
      WHERE p.slug = $1 AND p.active
      GROUP BY p.id, c.id`,
    [req.params.slug],
  )
  if (!rows.length) return res.status(404).json({ error: 'Produit introuvable' })
  res.json(rows[0])
})

const orderInput = z.object({
  market: z.enum(Object.keys(MARKETS)),
  items: z
    .array(z.object({ variantId: z.number().int().positive(), quantity: z.number().int().min(1).max(20) }))
    .min(1, 'Ton panier est vide.')
    .max(50),
  name: z.string().trim().min(2, 'Indique ton nom complet.').max(120),
  email: z.email('Adresse e-mail invalide.'),
  phone: z.string().trim().min(8, 'Numéro de téléphone invalide.').max(25),
  shippingMethod: z.string(),
  address: z.object({
    line1: z.string().trim().min(3, 'Indique ton adresse.').max(200),
    city: z.string().trim().min(2, 'Indique ta ville.').max(100),
    postalCode: z.string().trim().max(20).optional().default(''),
    country: z.string().length(2),
  }),
})

shop.post('/orders', async (req, res) => {
  const parsed = orderInput.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  // Une même variante ajoutée deux fois compte pour une seule ligne.
  const merged = new Map()
  for (const { variantId, quantity } of parsed.data.items) {
    merged.set(variantId, (merged.get(variantId) ?? 0) + quantity)
  }
  const input = {
    ...parsed.data,
    items: [...merged].map(([variantId, quantity]) => ({ variantId, quantity })),
  }
  res.status(201).json(await createOrder(MARKETS[input.market], input))
})

shop.get('/orders/:id', async (req, res) => {
  if (!z.uuid().safeParse(req.params.id).success) {
    return res.status(404).json({ error: 'Commande introuvable' })
  }
  const { rows } = await query('SELECT * FROM orders WHERE id = $1', [req.params.id])
  const order = rows[0]
  if (!order) return res.status(404).json({ error: 'Commande introuvable' })

  let status = order.status
  try {
    status = await syncPaymentStatus(order)
  } catch (err) {
    console.error('Vérification du paiement impossible :', err.message)
  }

  const { rows: items } = await query(
    'SELECT product_name, variant_label, image, unit_price, quantity FROM order_items WHERE order_id = $1 ORDER BY id',
    [order.id],
  )
  res.json({
    id: order.id,
    number: order.number,
    status,
    currency: order.currency,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    shippingMethod: order.shipping_method,
    firstName: order.customer_name.split(' ')[0],
    items,
  })
})
