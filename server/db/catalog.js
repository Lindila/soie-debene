/**
 * Catalogue Human Hair. Les prix sont provisoires : EUR en centimes, XAF en
 * francs CFA. Toute modification est appliquée en base par `npm run db:setup`,
 * lancé automatiquement à chaque déploiement.
 */

const inches = (from, to) =>
  Array.from({ length: (to - from) / 2 + 1 }, (_, i) => `${from + i * 2}"`)

/** Prix EUR → XAF, arrondi à 500 FCFA. */
const toXaf = (cents) => Math.round((cents / 100) * 655.957 / 500) * 500

const length = (o) => parseInt(o.Longueur)

export const categories = [
  {
    slug: 'perruques',
    name: 'Perruques',
    tagline: 'Lace wigs prêtes à porter, du bob au très long',
    image: '/images/perruque-deep-curly-1.jpg',
  },
  {
    slug: 'tissages',
    name: 'Mèches & tissages',
    tagline: 'Pour tresses, crochet, tissage ou perruque',
    image: '/images/tissages-rayon.jpg',
  },
]

/** `price(options)` renvoie le prix en centimes d'euro ; le prix FCFA en est déduit. */
export const products = [
  {
    slug: 'kinky-human-hair-12',
    name: 'Kinky Human Hair 12"',
    category: 'tissages',
    texture: 'Kinky',
    badge: 'Nouveau',
    featured: true,
    images: ['/images/kinky-human-hair-2.jpg', '/images/kinky-human-hair-1.jpg'],
    description:
      'Des mèches naturelles à la texture kinky, pour un look unique. Douces, légères et durables, elles se coiffent en box braids, en crochet braids, en tissage classique ou en perruque.',
    details: [
      '100 % cheveux humains, qualité premium',
      'Texture kinky naturelle, finitions soignées',
      'Taille 12" (30 cm)',
      'Pour box braids, crochet braids, tissage classique et perruques',
      'Facile à coiffer et à entretenir',
    ],
    options: { Couleur: ['Noir naturel (1B)', 'Châtain (4)', 'Blond miel (27)'] },
    price: (o) => 2900 + (o.Couleur === 'Noir naturel (1B)' ? 0 : 500),
  },
  {
    slug: 'perruque-lisse-lace-frontal',
    name: 'Perruque Lisse Lace Frontal 13x4',
    category: 'perruques',
    texture: 'Lisse',
    badge: 'Best-seller',
    featured: true,
    images: ['/images/perruque-lisse-longue-1.jpg', '/images/perruque-lisse-longue-2.jpg'],
    description:
      'Un lisse long, brillant et fluide, avec une lace frontale transparente qui se fond sur le front pour une naissance des cheveux naturelle. Se porte raie au milieu ou sur le côté.',
    details: [
      'Cheveux humains 100 % naturels',
      'Lace frontale transparente 13x4, pré-épilée',
      'Bonnet ajustable avec sangle élastique',
      'Peut être lissée, bouclée et coiffée',
    ],
    options: { Longueur: inches(16, 30), Densité: ['180 %', '250 %'] },
    price: (o) => 15900 + (length(o) - 16) * 1000 + (o.Densité === '250 %' ? 3000 : 0),
  },
  {
    slug: 'perruque-deep-curly',
    name: 'Perruque Deep Curly',
    category: 'perruques',
    texture: 'Deep Curly',
    badge: 'Nouveau',
    featured: true,
    images: ['/images/perruque-deep-curly-1.jpg'],
    description:
      'Des boucles profondes, denses et rebondies pour un volume glamour du matin au soir. Lace HD pour une raie naturelle et invisible.',
    details: [
      'Cheveux humains 100 % naturels',
      'Lace HD 13x4',
      'Boucles définies qui tiennent après lavage',
      'Bonnet ajustable',
    ],
    options: { Longueur: inches(14, 24), Densité: ['180 %', '250 %'] },
    price: (o) => 16900 + (length(o) - 14) * 1000 + (o.Densité === '250 %' ? 3000 : 0),
  },
  {
    slug: 'perruque-bob-water-wave',
    name: 'Perruque Bob Water Wave',
    category: 'perruques',
    texture: 'Water Wave',
    badge: 'Best-seller',
    featured: true,
    images: ['/images/perruque-water-wave-1.jpg', '/images/perruque-water-wave-2.jpg', '/images/perruque-water-wave-3.jpg', '/images/perruque-water-wave-4.jpg'],
    description:
      'Le bob bouclé qui va à tout le monde : léger, frais, plein de mouvement. Idéal au quotidien, facile à entretenir.',
    details: [
      'Cheveux humains 100 % naturels',
      'Lace 4x4 transparente',
      'Boucles water wave naturelles',
      'Bonnet ajustable',
    ],
    options: { Longueur: inches(10, 16) },
    price: (o) => 9900 + (length(o) - 10) * 800,
  },
  {
    slug: 'perruque-bob-lisse-4x4',
    name: 'Perruque Bob Lisse 4x4',
    category: 'perruques',
    texture: 'Lisse',
    featured: true,
    images: ['/images/perruque-bob-lisse-1.jpg', '/images/perruque-bob-lisse-2.jpg'],
    description:
      'Un carré lisse net et élégant, coupé droit. Lace 4x4 pour une raie au milieu impeccable. Le classique chic, prêt en 5 minutes.',
    details: [
      'Cheveux humains 100 % naturels',
      'Lace 4x4 transparente',
      'Coupe droite, finition nette',
      'Bonnet ajustable',
    ],
    options: { Longueur: inches(8, 14) },
    price: (o) => 8900 + (length(o) - 8) * 700,
  },
  {
    slug: 'perruque-bob-ombre-bordeaux',
    name: 'Perruque Bob Ombré Bordeaux',
    category: 'perruques',
    texture: 'Lisse · Couleur 1B/99J',
    badge: 'Tendance',
    featured: true,
    images: ['/images/perruque-bob-bordeaux-1.jpg'],
    description:
      'Racines foncées et longueurs bordeaux profond : un ombré tendance qui illumine le teint. Lace frontale transparente pour une naissance des cheveux parfaite.',
    details: [
      'Cheveux humains 100 % naturels, coloration 1B/99J',
      'Lace frontale transparente 13x4',
      'Coupe bob asymétrique',
      'Bonnet ajustable',
    ],
    options: { Longueur: inches(10, 14) },
    price: (o) => 11900 + (length(o) - 10) * 800,
  },
  {
    slug: 'tissage-curly',
    name: 'Tissage Curly',
    category: 'tissages',
    texture: 'Curly',
    featured: true,
    images: ['/images/tissage-curly-main.jpg', '/images/tissages-rayon.jpg'],
    description:
      'Des boucles généreuses et souples, en paquets de cheveux naturels. Pour un tissage, une perruque sur mesure ou un rajout de volume.',
    details: [
      'Cheveux humains 100 % naturels',
      'Paquet de 100 g',
      'Comptez 3 paquets pour une tête complète',
      'Se marie avec une closure ou une frontale',
    ],
    options: { Longueur: inches(10, 26), Couleur: ['Noir naturel (1B)', 'Châtain (4)', 'Blond miel (27)'] },
    price: (o) => 3500 + (length(o) - 10) * 400 + (o.Couleur === 'Noir naturel (1B)' ? 0 : 1000),
  },
]

function combinations(options) {
  return Object.entries(options).reduce(
    (acc, [name, values]) => acc.flatMap((combo) => values.map((v) => ({ ...combo, [name]: v }))),
    [{}],
  )
}

const skuPart = (value) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '').toUpperCase()

export function variantsOf(product) {
  return combinations(product.options).map((options, position) => {
    const priceEur = product.price(options)
    return {
      sku: [product.slug.toUpperCase(), ...Object.values(options).map(skuPart)].join('-'),
      options,
      price_eur: priceEur,
      price_xaf: toXaf(priceEur),
      stock: 10,
      position,
    }
  })
}
