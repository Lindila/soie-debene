import { Link } from 'react-router'
import { Mail } from 'lucide-react'
import { BRAND, whatsappLink } from '../config.js'
import { WhatsAppIcon } from './WhatsAppFloat.jsx'

export default function Footer() {
  return (
    <footer className="mt-24 bg-espresso text-cream">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl font-semibold">{BRAND.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Tissages, perruques et mèches en cheveux 100 % naturels, sélectionnés pour leur qualité et leur tenue.
            Livraison en Europe et au Cameroun.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={whatsappLink('Bonjour !')}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition hover:border-gold hover:text-gold"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition hover:border-gold hover:text-gold"
              aria-label="E-mail"
            >
              <Mail size={16} />
            </a>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded-full border border-cream/20 px-4 text-xs transition hover:border-gold hover:text-gold"
            >
              Instagram
            </a>
            <a
              href={BRAND.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded-full border border-cream/20 px-4 text-xs transition hover:border-gold hover:text-gold"
            >
              TikTok
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5">Boutique</p>
          <ul className="space-y-3 text-sm text-cream/75">
            <li><Link to="/boutique?categorie=tissages" className="hover:text-gold">Tissages</Link></li>
            <li><Link to="/boutique?categorie=perruques" className="hover:text-gold">Perruques</Link></li>
            <li><Link to="/boutique?categorie=closures-frontals" className="hover:text-gold">Closures & Frontals</Link></li>
            <li><Link to="/boutique?categorie=meches-a-tresser" className="hover:text-gold">Mèches à tresser</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Aide</p>
          <ul className="space-y-3 text-sm text-cream/75">
            <li><Link to="/contact" className="hover:text-gold">Contact & conseils</Link></li>
            <li><Link to="/contact#livraison" className="hover:text-gold">Livraison</Link></li>
            <li><Link to="/contact#paiement" className="hover:text-gold">Paiement sécurisé</Link></li>
            <li><Link to="/contact#entretien" className="hover:text-gold">Entretien des mèches</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.</p>
          <p>Carte bancaire · Apple Pay · MTN MoMo · Orange Money</p>
        </div>
      </div>
    </footer>
  )
}
