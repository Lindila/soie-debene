/**
 * Catalogue de départ. Les prix sont indicatifs : EUR en centimes, XAF en
 * francs CFA. Modifie-les ici avant `npm run db:setup`, ou directement en base.
 */

const inches = (from, to) =>
  Array.from({ length: (to - from) / 2 + 1 }, (_, i) => `${from + i * 2}"`)

const NATURAL = 'Noir naturel (1B)'
const BLOND = 'Blond miel (613)'

/** Prix EUR → XAF, arrondi à 500 FCFA. */
const toXaf = (cents) => Math.round((cents / 100) * 655.957 / 500) * 500

export const categories = [
  {
    slug: 'tissages',
    name: 'Tissages',
    tagline: 'Paquets 100 % naturels, du lisse au bouclé',
    image: '/images/hero-body-wave.jpg',
  },
  {
    slug: 'perruques',
    name: 'Perruques',
    tagline: 'Lace frontales prêtes à porter',
    image: '/images/perruque-lisse-1.jpg',
  },
  {
    slug: 'closures-frontals',
    name: 'Closures & Frontals',
    tagline: 'Pour une raie naturelle et invisible',
    image: '/images/closure-1.jpg',
  },
  {
    slug: 'meches-a-tresser',
    name: 'Mèches à tresser',
    tagline: 'Box braids, knotless, twists',
    image: '/images/tresses-1.jpg',
  },
]

/**
 * `price(options)` renvoie le prix en centimes d'euro de la variante ; le prix
 * en francs CFA en est déduit.
 */
export const products = [
  {
    slug: 'tissage-bresilien-lisse',
    name: 'Tissage Brésilien Lisse',
    category: 'tissages',
    texture: 'Lisse',
    badge: 'Best-seller',
    featured: true,
    images: ['/images/lisse-1.jpg', '/images/lisse-2.jpg', '/images/lisse-3.jpg'],
    description:
      'Un lisse soyeux et brillant qui bouge avec naturel. Cheveux humains Remy, cuticules alignées : pas de nœuds, pas de frisottis, et une tenue de 12 mois et plus avec un bon entretien.',
    details: [
      'Cheveux humains 100 % Remy, non traités',
      'Paquet de 100 g, trame double',
      'Se lisse, se boucle et se colore',
      'Comptez 3 paquets pour une tête complète',
    ],
    options: { Longueur: inches(10, 30), Couleur: [NATURAL, BLOND] },
    price: (o) => 3500 + (parseInt(o.Longueur) - 10) * 400 + (o.Couleur === BLOND ? 1500 : 0),
  },
  {
    slug: 'tissage-body-wave',
    name: 'Tissage Body Wave',
    category: 'tissages',
    texture: 'Body Wave',
    badge: 'Nouveau',
    featured: true,
    images: ['/images/hero-body-wave.jpg', '/images/body-wave-2.jpg'],
    description:
      'Des ondulations souples et un volume qui dure toute la journée. La texture la plus polyvalente : elle se porte détachée, en chignon ou lissée.',
    details: [
      'Cheveux humains 100 % Remy',
      'Paquet de 100 g, trame double',
      'Ondulation qui revient après lavage',
      'Comptez 3 paquets pour une tête complète',
    ],
    options: { Longueur: inches(10, 30), Couleur: [NATURAL, BLOND] },
    price: (o) => 3800 + (parseInt(o.Longueur) - 10) * 400 + (o.Couleur === BLOND ? 1500 : 0),
  },
  {
    slug: 'tissage-deep-wave',
    name: 'Tissage Deep Wave',
    category: 'tissages',
    texture: 'Deep Wave',
    featured: true,
    images: ['/images/deep-wave-1.jpg', '/images/deep-wave-2.jpg'],
    description:
      'Des boucles profondes, rebondies et bien définies. Un rendu glamour qui garde sa forme lavage après lavage.',
    details: [
      'Cheveux humains 100 % Remy',
      'Paquet de 100 g, trame double',
      'Boucles définies, sans produit',
      'Comptez 3 à 4 paquets pour une tête complète',
    ],
    options: { Longueur: inches(10, 30) },
    price: (o) => 4000 + (parseInt(o.Longueur) - 10) * 400,
  },
  {
    slug: 'tissage-kinky-curly',
    name: 'Tissage Kinky Curly',
    category: 'tissages',
    texture: 'Kinky Curly',
    featured: true,
    images: ['/images/kinky-1.jpg', '/images/kinky-2.jpg', '/images/kinky-3.jpg'],
    description:
      'Une boucle afro serrée qui se fond avec les cheveux naturels crépus. Pour un volume généreux et une allure 100 % naturelle.',
    details: [
      'Cheveux humains 100 % Remy',
      'Paquet de 100 g, trame double',
      'Se fond avec les cheveux crépus type 4',
      'Comptez 3 paquets pour une tête complète',
    ],
    options: { Longueur: inches(10, 24) },
    price: (o) => 4200 + (parseInt(o.Longueur) - 10) * 400,
  },
  {
    slug: 'perruque-lace-frontal-lisse',
    name: 'Perruque Lace Frontal 13x4 Lisse',
    category: 'perruques',
    texture: 'Lisse',
    badge: 'Best-seller',
    featured: true,
    images: ['/images/perruque-lisse-1.jpg', '/images/lisse-3.jpg'],
    description:
      'Prête à porter en 10 minutes. Lace frontale HD 13x4 pré-épilée, naissance des cheveux naturelle, bonnet ajustable avec sangle élastique.',
    details: [
      'Cheveux humains 100 % Remy',
      'Lace HD 13x4, pré-épilée, nœuds décolorés',
      'Bonnet taille M ajustable (54 – 58 cm)',
      'Peut être coiffée, lissée et bouclée',
    ],
    options: { Longueur: inches(14, 26), Densité: ['150 %', '180 %'] },
    price: (o) => 14900 + (parseInt(o.Longueur) - 14) * 900 + (o.Densité === '180 %' ? 2500 : 0),
  },
  {
    slug: 'perruque-lisse-frange',
    name: 'Perruque Lisse à Frange',
    category: 'perruques',
    texture: 'Lisse',
    images: ['/images/perruque-frange.jpg'],
    description:
      'Sans colle, sans lace à couper : une perruque à frange qui s’enfile et se porte immédiatement. Idéale pour débuter.',
    details: [
      'Cheveux humains 100 % Remy',
      'Sans colle (glueless), frange prédécoupée',
      'Bonnet taille M ajustable',
    ],
    options: { Longueur: inches(10, 20) },
    price: (o) => 9900 + (parseInt(o.Longueur) - 10) * 700,
  },
  {
    slug: 'perruque-afro-kinky',
    name: 'Perruque Afro Kinky',
    category: 'perruques',
    texture: 'Kinky Curly',
    badge: 'Nouveau',
    featured: true,
    images: ['/images/perruque-afro.jpg', '/images/kinky-3.jpg'],
    description:
      'Un afro volumineux et naturel, lace 4x4 pour une raie discrète. Le look d’un vrai afro, sans les heures de coiffage.',
    details: [
      'Cheveux humains 100 % Remy',
      'Lace transparente 4x4',
      'Densité 200 %, volume généreux',
    ],
    options: { Longueur: inches(12, 18) },
    price: (o) => 15900 + (parseInt(o.Longueur) - 12) * 900,
  },
  {
    slug: 'closure-4x4-lisse',
    name: 'Closure 4x4 Lisse',
    category: 'closures-frontals',
    texture: 'Lisse',
    images: ['/images/closure-1.jpg'],
    description:
      'Termine ton tissage avec une raie naturelle, sans laisser de cheveux dehors. Raie libre : au milieu, sur le côté, comme tu veux.',
    details: [
      'Cheveux humains 100 % Remy',
      'Lace 4x4, raie libre',
      'Se marie avec nos tissages lisses',
    ],
    options: { Longueur: inches(10, 20), 'Type de lace': ['Transparente', 'HD'] },
    price: (o) => 3900 + (parseInt(o.Longueur) - 10) * 300 + (o['Type de lace'] === 'HD' ? 1500 : 0),
  },
  {
    slug: 'frontal-13x4-body-wave',
    name: 'Frontal 13x4 Body Wave',
    category: 'closures-frontals',
    texture: 'Body Wave',
    images: ['/images/frontal-1.jpg'],
    description:
      'Une frontale d’oreille à oreille pour coiffer les cheveux en arrière ou en queue de cheval, avec une naissance des cheveux invisible.',
    details: [
      'Cheveux humains 100 % Remy',
      'Lace 13x4, pré-épilée',
      'Se marie avec nos tissages body wave',
    ],
    options: { Longueur: inches(12, 20), 'Type de lace': ['Transparente', 'HD'] },
    price: (o) => 5900 + (parseInt(o.Longueur) - 12) * 400 + (o['Type de lace'] === 'HD' ? 2000 : 0),
  },
  {
    slug: 'meches-tresses-pre-etirees',
    name: 'Mèches à tresser pré-étirées',
    category: 'meches-a-tresser',
    texture: 'Tresses',
    badge: 'Best-seller',
    featured: true,
    images: ['/images/tresses-1.jpg', '/images/tresses-2.jpg', '/images/tresses-3.jpg'],
    description:
      'Des pointes déjà effilées pour des tresses nettes en moins de temps. Légères, douces, sans démangeaisons grâce au traitement anti-irritation.',
    details: [
      'Fibre synthétique premium, traitée anti-démangeaisons',
      'Pré-étirées, pointes effilées',
      'Longueur 26" (66 cm), lot de 3 paquets',
      'Comptez 2 à 3 lots pour des box braids',
    ],
    options: { Couleur: ['Noir (1B)', 'Châtain (4)', 'Ombré cuivré (1B/30)', 'Blond (27)'] },
    price: () => 1290,
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
