/**
 * Crée les tables puis charge le catalogue si la base est vide.
 *   npm run db:setup              sans danger à relancer, rien n'est écrasé
 *   npm run db:setup -- --reset   remplace le catalogue par catalog.js
 *                                 (les commandes passées sont conservées)
 */
import { readFile } from 'node:fs/promises'
import { categories, products, variantsOf } from './catalog.js'

// Premier déploiement Vercel, avant d'avoir branché Neon : on n'empêche pas la
// mise en ligne du site, on prévient juste.
if (!process.env.DATABASE_URL) {
  console.warn('⚠ DATABASE_URL absent : base non initialisée. Branche Neon puis redéploie.')
  process.exit(0)
}
const { pool, withTransaction } = await import('../src/db.js')

const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
await pool.query(schema)
console.log('✔ Tables prêtes')

const reset = process.argv.includes('--reset')
const { rows } = await pool.query('SELECT count(*)::int AS n FROM products')
if (rows[0].n > 0 && !reset) {
  console.log(`✔ Catalogue déjà présent (${rows[0].n} produits), rien à faire`)
} else {
  await withTransaction(async (db) => {
    if (reset) {
      // Les lignes de commande gardent leur nom et prix ; leur lien vers la variante passe à NULL.
      await db.query('DELETE FROM products')
      await db.query('DELETE FROM categories')
      console.log('✔ Ancien catalogue supprimé')
    }
    const categoryIds = {}
    for (const [position, c] of categories.entries()) {
      const { rows } = await db.query(
        `INSERT INTO categories (slug, name, tagline, image, position)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [c.slug, c.name, c.tagline, c.image, position],
      )
      categoryIds[c.slug] = rows[0].id
    }

    let variantCount = 0
    for (const p of products) {
      const { rows } = await db.query(
        `INSERT INTO products
           (slug, name, category_id, texture, description, details, images, option_names, badge, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          p.slug,
          p.name,
          categoryIds[p.category],
          p.texture,
          p.description,
          p.details,
          p.images,
          Object.keys(p.options),
          p.badge ?? null,
          p.featured ?? false,
        ],
      )
      for (const v of variantsOf(p)) {
        await db.query(
          `INSERT INTO variants (product_id, sku, options, price_eur, price_xaf, stock, position)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [rows[0].id, v.sku, v.options, v.price_eur, v.price_xaf, v.stock, v.position],
        )
        variantCount++
      }
    }
    console.log(`✔ Catalogue chargé : ${products.length} produits, ${variantCount} variantes`)
  })
}

await pool.end()
