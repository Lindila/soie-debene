export const PORT = Number(process.env.PORT) || 5000
// Sur Render, RENDER_EXTERNAL_URL est fourni automatiquement.
export const CLIENT_URL =
  process.env.CLIENT_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5173'

/**
 * Un marché = une devise + un moyen de paiement + ses modes de livraison.
 * Les montants sont en unités mineures : centimes pour l'EUR, francs pour le
 * XAF (qui n'a pas de décimales).
 */
export const MARKETS = {
  eu: {
    id: 'eu',
    label: 'Europe',
    currency: 'EUR',
    provider: 'stripe',
    countries: {
      FR: 'France',
      BE: 'Belgique',
      LU: 'Luxembourg',
      CH: 'Suisse',
      DE: 'Allemagne',
      ES: 'Espagne',
      IT: 'Italie',
      NL: 'Pays-Bas',
      PT: 'Portugal',
    },
    freeShippingFrom: 15000,
    shipping: [
      { id: 'standard', label: 'Colissimo', description: '2 à 4 jours ouvrés', price: 690, free: true },
      { id: 'express', label: 'Chronopost Express', description: 'Livraison en 24 h', price: 1490 },
    ],
  },
  cm: {
    id: 'cm',
    label: 'Cameroun',
    currency: 'XAF',
    provider: 'notchpay',
    countries: { CM: 'Cameroun' },
    freeShippingFrom: null,
    shipping: [
      { id: 'local', label: 'Douala / Yaoundé', description: 'À domicile en 24 à 48 h', price: 2000 },
      { id: 'national', label: 'Autres villes', description: 'Envoi par agence, 2 à 5 jours', price: 5000 },
    ],
  },
}

export function shippingPrice(market, methodId, subtotal) {
  const method = market.shipping.find((m) => m.id === methodId)
  if (!method) return null
  const isFree = method.free && market.freeShippingFrom !== null && subtotal >= market.freeShippingFrom
  return { ...method, price: isFree ? 0 : method.price }
}
