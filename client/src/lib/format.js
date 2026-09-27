const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const plain = new Intl.NumberFormat('fr-FR')

/** Montant en unités mineures (centimes pour EUR, francs pour XAF). */
export function formatMoney(amount, currency) {
  return currency === 'XAF' ? `${plain.format(amount)} FCFA` : eur.format(amount / 100)
}

export const priceKey = (currency) => (currency === 'XAF' ? 'price_xaf' : 'price_eur')
export const minPriceKey = (currency) => (currency === 'XAF' ? 'min_price_xaf' : 'min_price_eur')
