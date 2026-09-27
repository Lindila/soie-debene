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

## Mise en ligne

1. **Base de données** : crée une base PostgreSQL gratuite sur neon.tech. Mets son URL dans `DATABASE_URL`, puis lance `npm run db:setup`.
2. **API** : déploie sur Railway ou Render.
   - Dossier racine : `server`
   - Commande de démarrage : `npm start`
   - Variables d'environnement : celles de `server/.env`, avec `CLIENT_URL` = l'adresse du site.
3. **Site** : déploie sur Vercel.
   - Dossier racine : `client`
   - Variable d'environnement : `VITE_API_URL` = l'adresse de l'API.
4. **Nom de domaine** : ajoute-le dans Vercel.
