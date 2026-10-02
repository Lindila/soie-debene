import pg from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL manquant : server/.env en local, ou base Neon branchée sur Vercel')
}

export const pool = new pg.Pool({ connectionString: DATABASE_URL })

export const query = (text, params) => pool.query(text, params)

export async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
