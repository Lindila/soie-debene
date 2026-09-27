# Maison Mèches — boutique en ligne

- `client/` : le site (React + Tailwind CSS), sur le port 5173
- `server/` : l'API (Node.js + Express + PostgreSQL), sur le port 5000

## Lancer en local

```
npm install
npm run db:setup     # crée les tables et charge le catalogue (une seule fois)
npm run dev          # lance le site et l'API
```

Ouvre ensuite http://localhost:5173

## Personnaliser

| Quoi | Où |
|---|---|
| Nom de la boutique, numéro WhatsApp, e-mail, réseaux | `client/src/config.js` |
| Produits, prix, photos de départ | `server/db/catalog.js` (avant `db:setup`) |
| Frais de livraison, pays livrés | `server/src/config.js` |
| Couleurs et polices | `client/src/index.css` (bloc `@theme`) |
| Photos | `client/public/images/` |

## Paiements (mode test)

Mets les clés dans `server/.env`, puis relance `npm run dev`.

- **Stripe (Europe)** : crée un compte sur stripe.com, puis copie la clé secrète de test (`sk_test_…`) dans `STRIPE_SECRET_KEY`. Pour payer en test, utilise la carte `4242 4242 4242 4242`, n'importe quelle date future et n'importe quel code.
- **NotchPay (Cameroun)** : crée un compte sur business.notchpay.co, puis copie la clé publique de test dans `NOTCHPAY_PUBLIC_KEY`.

Une commande ne passe « payée » que lorsque le serveur l'a vérifié directement chez Stripe ou NotchPay. En production, configure aussi les webhooks :

- Stripe : `https://TON-API/api/webhooks/stripe` (événements `checkout.session.*`), puis mets le secret dans `STRIPE_WEBHOOK_SECRET`.
- NotchPay : `https://TON-API/api/webhooks/notchpay`, puis mets la « hash key » dans `NOTCHPAY_WEBHOOK_HASH`.

## Mise en ligne (Vercel + Neon)

1. Sur vercel.com, choisis « Continue with GitHub », puis **Add New → Project** et importe . Ne touche à aucun réglage, puis clique sur **Deploy**. Le site s'affiche, mais sans produits.
2. Dans le projet, ouvre **Storage → Create Database → Neon**, puis **Connect**. Vercel ajoute  tout seul.
3. Ouvre **Deployments → ⋯ → Redeploy**. La base est créée et le catalogue chargé.
4. Plus tard, ajoute les clés de paiement dans **Settings → Environment Variables**, puis redéploie.

Alternative :  permet de tout déployer sur Render (Blueprint).
