/**
 * Crée les tables puis synchronise la base avec catalog.js :
 *   npm run db:setup
 * Lancé à chaque déploiement. Ajoute les nouveaux produits, met à jour textes,
 * photos et prix, et masque les produits retirés du catalogue. Ne touche ni aux
 * stocks existants ni aux commandes.
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

await withTransaction(async (db) => {
  const categoryIds = {}
  for (const [position, c] of categories.entries()) {
    const { rows } = await db.query(
      `INSERT INTO categories (slug, name, tagline, image, position)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE
         SET name = $2, tagline = $3, image = $4, position = $5
       RETURNING id`,
      [c.slug, c.name, c.tagline, c.image, position],
    )
    categoryIds[c.slug] = rows[0].id
  }

  let variantCount = 0
  for (const p of products) {
    const { rows } = await db.query(
      `INSERT INTO products
         (slug, name, category_id, texture, description, details, images, option_names, badge, featured, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
       ON CONFLICT (slug) DO UPDATE
         SET name = $2, category_id = $3, texture = $4, description = $5, details = $6,
             images = $7, option_names = $8, badge = $9, featured = $10, active = true
       RETURNING id`,
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
    const productId = rows[0].id
    const variants = variantsOf(p)
    for (const v of variants) {
      // Le stock n'est fixé qu'à la création : les ventes ne sont jamais écrasées.
      await db.query(
        `INSERT INTO variants (product_id, sku, options, price_eur, price_xaf, stock, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (sku) DO UPDATE
           SET product_id = $1, options = $3, price_eur = $4, price_xaf = $5, position = $7`,
        [productId, v.sku, v.options, v.price_eur, v.price_xaf, v.stock, v.position],
      )
    }
    // Les commandes passées gardent leurs lignes : leur lien vers la variante passe à NULL.
    await db.query('DELETE FROM variants WHERE product_id = $1 AND sku <> ALL($2)', [
      productId,
      variants.map((v) => v.sku),
    ])
    variantCount += variants.length
  }

  const { rowCount: hidden } = await db.query(
    'UPDATE products SET active = false WHERE active AND slug <> ALL($1)',
    [products.map((p) => p.slug)],
  )
  console.log(
    `✔ Catalogue synchronisé : ${products.length} produits, ${variantCount} variantes` +
      (hidden ? `, ${hidden} produit(s) retiré(s) masqué(s)` : ''),
  )
})

await pool.end()
