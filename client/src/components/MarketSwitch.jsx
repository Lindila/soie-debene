import { useShop } from '../context/ShopContext.jsx'

const OPTIONS = [
  { id: 'eu', label: 'Europe', currency: '€' },
  { id: 'cm', label: 'Cameroun', currency: 'FCFA' },
]

export default function MarketSwitch() {
  const { market, setMarketId } = useShop()
  return (
    <div className="flex rounded-full border border-espresso/15 bg-white/60 p-0.5 text-xs">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          onClick={() => setMarketId(o.id)}
          className={`rounded-full px-3 py-1.5 transition ${
            market.id === o.id ? 'bg-espresso text-cream' : 'text-cocoa hover:text-espresso'
          }`}
          aria-pressed={market.id === o.id}
        >
          {o.label} <span className="opacity-60">{o.currency}</span>
        </button>
      ))}
    </div>
  )
}
