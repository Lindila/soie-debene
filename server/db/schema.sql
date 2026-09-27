CREATE TABLE IF NOT EXISTS categories (
  id          serial PRIMARY KEY,
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  tagline     text,
  image       text,
  position    int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id           serial PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  category_id  int NOT NULL REFERENCES categories(id),
  texture      text,
  description  text NOT NULL,
  details      text[] NOT NULL DEFAULT '{}',
  images       text[] NOT NULL DEFAULT '{}',
  -- Noms des options dans l'ordre d'affichage, ex. {Longueur,Couleur}
  option_names text[] NOT NULL DEFAULT '{}',
  badge        text,
  featured     boolean NOT NULL DEFAULT false,
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS variants (
  id          serial PRIMARY KEY,
  product_id  int NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku         text UNIQUE NOT NULL,
  -- ex. {"Longueur": "18\"", "Couleur": "Noir naturel (1B)"}
  options     jsonb NOT NULL DEFAULT '{}',
  price_eur   int NOT NULL CHECK (price_eur >= 0), -- centimes
  price_xaf   int NOT NULL CHECK (price_xaf >= 0), -- francs CFA
  stock       int NOT NULL DEFAULT 0 CHECK (stock >= 0),
  position    int NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS variants_product_idx ON variants(product_id);

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number           int UNIQUE NOT NULL DEFAULT nextval('order_number_seq'),
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'paid', 'failed', 'shipped', 'delivered', 'cancelled')),
  market           text NOT NULL,
  currency         text NOT NULL,
  subtotal         int NOT NULL,
  shipping         int NOT NULL,
  total            int NOT NULL,
  shipping_method  text NOT NULL,
  customer_name    text NOT NULL,
  email            text NOT NULL,
  phone            text NOT NULL,
  address          jsonb NOT NULL,
  payment_provider text NOT NULL,
  payment_ref      text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  paid_at          timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id            serial PRIMARY KEY,
  order_id      uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id    int REFERENCES variants(id) ON DELETE SET NULL,
  product_name  text NOT NULL,
  variant_label text NOT NULL,
  image         text,
  unit_price    int NOT NULL,
  quantity      int NOT NULL CHECK (quantity > 0)
);
