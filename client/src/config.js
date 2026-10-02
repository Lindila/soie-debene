/**
 * Identité de la boutique : tout ce qui s'affiche sur le site est ici.
 * Remplace ces valeurs par les tiennes.
 */
export const BRAND = {
  name: 'Human Hair',
  tagline: 'Cheveux 100 % naturels',
  hashtag: 'HumanHairShop',
  // Numéro WhatsApp au format international, sans + ni espaces (ex. 237 6XX XX XX XX)
  whatsapp: '237657631817',
  email: 'nonoyvana92@gmail.com',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
}

export function whatsappLink(message) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`
}
