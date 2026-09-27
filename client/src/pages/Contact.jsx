import { Mail } from 'lucide-react'
import { BRAND, whatsappLink } from '../config.js'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

const FAQ = [
  {
    id: 'livraison',
    title: 'Livraison',
    text: 'Europe : Colissimo en 2 à 4 jours ouvrés (6,90 €, offert dès 150 €) ou Chronopost Express en 24 h (14,90 €). Cameroun : livraison à domicile en 24 – 48 h à Douala et Yaoundé (2 000 FCFA), envoi par agence de voyage dans les autres villes en 2 à 5 jours (5 000 FCFA).',
  },
  {
    id: 'paiement',
    title: 'Paiement sécurisé',
    text: 'En Europe, tu paies par carte bancaire, Apple Pay ou Google Pay via Stripe. Au Cameroun, par MTN Mobile Money ou Orange Money via NotchPay. Tu es redirigée vers la page sécurisée du prestataire : nous ne voyons ni ne stockons jamais tes données de paiement.',
  },
  {
    id: 'quantite',
    title: 'Combien de paquets commander ?',
    text: 'Pour une tête complète : 3 paquets jusqu’à 20", 4 paquets au-delà de 22" ou pour plus de volume. Avec une closure ou une frontale, un paquet de moins suffit souvent.',
  },
  {
    id: 'entretien',
    title: 'Entretien des mèches',
    text: 'Lave tes mèches toutes les 1 à 2 semaines avec un shampoing sans sulfate, applique un après-shampoing, démêle des pointes vers les racines et laisse sécher à l’air libre. La nuit, protège-les avec un bonnet ou une taie en satin. Bien entretenus, des cheveux Remy durent plus d’un an.',
  },
  {
    id: 'retours',
    title: 'Retours',
    text: 'Pour des raisons d’hygiène, nous ne reprenons que les mèches non ouvertes, dans leur emballage d’origine et sous 14 jours. Écris-nous sur WhatsApp pour organiser le retour.',
  },
]

export default function Contact() {
  return (
    <div className="container-x pt-12">
      <div className="text-center">
        <p className="eyebrow">On est là pour toi</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Contact & conseils</h1>
        <p className="mx-auto mt-4 max-w-lg text-cocoa">
          Une question sur une texture, une longueur ou ta commande ? Le plus rapide, c’est WhatsApp.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        <a
          href={whatsappLink('Bonjour ! J’ai une question : ')}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl bg-espresso p-8 text-cream transition hover:-translate-y-1"
        >
          <WhatsAppIcon className="h-8 w-8 text-whatsapp" />
          <p className="mt-6 font-serif text-3xl">WhatsApp</p>
          <p className="mt-2 text-sm text-cream/70">Réponse en quelques minutes, 7 j/7</p>
        </a>
        <a
          href={`mailto:${BRAND.email}`}
          className="rounded-3xl border border-espresso/15 bg-white p-8 transition hover:-translate-y-1"
        >
          <Mail size={32} strokeWidth={1.3} className="text-gold" />
          <p className="mt-6 font-serif text-3xl">E-mail</p>
          <p className="mt-2 text-sm text-taupe">{BRAND.email}</p>
        </a>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-6 text-center text-4xl">Questions fréquentes</h2>
        <div className="divide-y divide-espresso/10 border-y border-espresso/10">
          {FAQ.map((q) => (
            <details key={q.id} id={q.id} className="group scroll-mt-40 py-5" open={q.id === 'livraison'}>
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-2xl">
                {q.title}
                <span className="text-gold transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-cocoa">{q.text}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
