import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { PORT } from './config.js'
import app from './app.js'

// Hors Vercel, le même serveur sert aussi le site compilé (client/dist).
const siteDir = fileURLToPath(new URL('../../client/dist', import.meta.url))
if (existsSync(siteDir)) {
  app.use(express.static(siteDir, { maxAge: '1h' }))
  app.get('/{*page}', (_req, res) => res.sendFile(path.join(siteDir, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`API prête sur http://localhost:${PORT}`)
})
