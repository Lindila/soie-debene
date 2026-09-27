import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Gem, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { api } from '../lib/api.js'
import { BRAND, whatsappLink } from '../config.js'
import { useShop } from '../context/ShopContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

const TEXTURES = [
  { name: 'Lisse', image: '/images/lisse-2.jpg', slug: 'tissage-bresilien-lisse' },
  { name: 'Body Wave', image: '/images/body-wave-2.jpg', slug: 'tissage-body-wave' },
  { name: 'Deep Wave', image: '/images/deep-wave-2.jpg', slug: 'tissage-deep-wave' },
  { name: 'Kinky Curly', image: '/images/kinky-1.jpg', slug: 'tissage-kinky-curly' },
]

const GALLERY = [1, 2, 3, 4, 5, 6].map((n) => `/images/galerie-${n}.jpg`)

export default function Home() {
  const { market } = useShop()
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    api('/categories').then(setCategories).catch(() => {})
    api('/products?featured=1').then(setFeatured).catch(() => {})
  }, [])

  const perks = [
    { icon: Gem, title: '100 % cheveux humains', text: 'Remy, cuticules alignées, sans nœuds' },
    {
      icon: Truck,
      title: market.id === 'cm' ? 'Livré en 24 – 48 h' : 'Livraison rapide',
      text: market.id === 'cm' ? 'À Douala et Yaoundé, partout au Cameroun' : 'Offerte dès 150 € en Europe',
    },
    {
      icon: ShieldCheck,
      title: 'Paiement sécurisé',
      text: market.id === 'cm' ? 'MTN MoMo, Orange Money' : 'Carte, Apple Pay, Google Pay',
    },
    { icon: Sparkles, title: 'Conseil personnalisé', text: 'On t’aide à choisir sur WhatsApp' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-10 pb-16 lg:grid-cols-12 lg:gap-6 lg:pt-16 lg:pb-24">
          <div className="animate-fade-up lg:col-span-5">
            <p className="eyebrow">Nouvelle collection</p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-medium sm:text-6xl xl:text-7xl">
              Des cheveux qui te <em className="text-gold">ressemblent</em>.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cocoa sm:text-lg">
              Tissages, perruques lace et closures en cheveux 100 % naturels. Brillants, doux, et faits pour durer
              plus d’un an.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/boutique" className="btn-dark">
                Découvrir la collection <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappLink('Bonjour ! J’aimerais un conseil pour choisir mes mèches.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light"
              >
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Un conseil ?
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-taupe">
              <span>
                <strong className="block font-serif text-3xl font-medium text-espresso">100 %</strong>
                cheveux naturels
              </span>
              <span className="h-10 w-px bg-espresso/15" />
              <span>
                <strong className="block font-serif text-3xl font-medium text-espresso">10 → 30"</strong>
                toutes les longueurs
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="absolute -top-10 -right-24 h-[120%] w-[85%] rounded-full bg-blush/60 blur-3xl" />
            <div className="relative grid grid-cols-12 gap-4">
              <div className="col-span-8 col-start-2 aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-espresso/20 lg:col-span-8 lg:col-start-4">
                <img
                  src="/images/hero-body-wave.jpg"
                  alt="Femme portant un tissage body wave"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-[-6%] left-0 w-[38%] overflow-hidden rounded-3xl border-6 border-cream shadow-xl lg:left-[6%] lg:w-[34%]">
                <img src="/images/deep-wave-1.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="absolute top-[8%] right-0 rounded-2xl bg-cream/95 px-5 py-4 shadow-lg backdrop-blur sm:right-[4%]">
                <p className="text-[10px] tracking-[0.2em] text-taupe uppercase">Texture star</p>
                <p className="font-serif text-xl">Body Wave</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Réassurance */}
      <section className="border-y border-espresso/10 bg-sand/60">
        <div className="container-x grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={22} strokeWidth={1.3} className="mt-0.5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-taupe">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="container-x pt-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Nos univers</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Trouve ton style</h2>
          </div>
          <Link to="/boutique" className="hidden items-center gap-2 text-sm hover:text-gold sm:flex">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/boutique?categorie=${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream sm:p-6">
                <p className="font-serif text-2xl sm:text-3xl">{c.name}</p>
                <p className="mt-1 hidden text-xs text-cream/80 sm:block">{c.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                  Découvrir <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best-sellers */}
      <section className="container-x pt-24">
        <div className="mb-10 text-center">
          <p className="eyebrow">Les préférées</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Nos best-sellers</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.slice(0, 8).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/boutique" className="btn-light">
            Voir toute la boutique <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Textures */}
      <section className="mt-24 bg-sand/60 py-24">
        <div className="container-x">
          <div className="mb-12 text-center">
            <p className="eyebrow">Guide des textures</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Quelle texture pour toi ?</h2>
            <p className="mx-auto mt-4 max-w-lg text-cocoa">
              Du lisse soyeux à la boucle afro, chaque texture existe de 10 à 30 pouces.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-4">
            {TEXTURES.map((t) => (
              <Link key={t.name} to={`/produit/${t.slug}`} className="group text-center">
                <div className="mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-full border-4 border-cream shadow-lg">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="mt-5 font-serif text-2xl transition group-hover:text-gold">{t.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Conseil WhatsApp */}
      <section className="container-x pt-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-espresso text-cream lg:grid-cols-2">
          <div className="flex flex-col justify-center p-10 sm:p-14 lg:p-20">
            <p className="eyebrow text-gold-light">Conseil gratuit</p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Pas sûre de ta longueur ou du nombre de paquets ?
            </h2>
            <p className="mt-5 max-w-md text-cream/75">
              Envoie-nous une photo de la coiffure qui te fait rêver : on te dit exactement quoi commander, sans
              engagement. Réponse en quelques minutes.
            </p>
            <div className="mt-9">
              <a
                href={whatsappLink('Bonjour ! J’aimerais un conseil. Voici la coiffure que je veux : ')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> Écrire sur WhatsApp
              </a>
            </div>
          </div>
          <div className="relative min-h-80">
            <img
              src="/images/tresses-3.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Comment commander */}
      <section className="container-x pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow">Simple et rapide</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Comment commander</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ['01', 'Choisis', 'Ta texture, ta longueur et ta couleur. Un doute ? Écris-nous.'],
            [
              '02',
              'Paie en sécurité',
              market.id === 'cm'
                ? 'Par MTN Mobile Money ou Orange Money, depuis ton téléphone.'
                : 'Par carte, Apple Pay ou Google Pay, sur une page sécurisée.',
            ],
            [
              '03',
              'Reçois',
              market.id === 'cm'
                ? 'À domicile en 24 – 48 h à Douala et Yaoundé.'
                : 'Chez toi en 2 à 4 jours, suivi inclus.',
            ],
          ].map(([n, title, text]) => (
            <div key={n} className="border-t border-espresso/15 pt-6">
              <p className="font-serif text-5xl text-gold">{n}</p>
              <p className="mt-4 font-serif text-2xl">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-cocoa">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galerie */}
      <section className="pt-24">
        <div className="container-x mb-10 text-center">
          <p className="eyebrow">Inspiration</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">#{BRAND.hashtag}</h2>
        </div>
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
          {GALLERY.map((src) => (
            <a
              key={src}
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-espresso/0 transition group-hover:bg-espresso/25" />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
