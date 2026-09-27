const BASE = import.meta.env.VITE_API_URL ?? ''

export async function api(path, init) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? 'Le serveur ne répond pas. Réessaie dans un instant.')
  return body
}
