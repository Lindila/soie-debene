import express from 'express'
import cors from 'cors'
import { CLIENT_URL } from './config.js'
import { shop } from './routes/shop.js'
import { webhooks } from './routes/webhooks.js'
import { OrderError } from './orders.js'
import { PaymentConfigError } from './payments/stripe.js'

/** L'API seule : lancée par index.js en local/Render, ou par api/index.js sur Vercel. */
const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: CLIENT_URL }))

// Les webhooks lisent le corps brut : ils passent avant express.json().
app.use('/api/webhooks', webhooks)
app.use(express.json({ limit: '100kb' }))
app.use('/api', shop)

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route inconnue' }))

app.use((err, _req, res, _next) => {
  if (err instanceof OrderError) return res.status(409).json({ error: err.message })
  if (err instanceof PaymentConfigError) {
    console.error(err.message)
    return res.status(503).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Erreur du serveur, réessaie dans un instant.' })
})

export default app
