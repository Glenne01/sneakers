# 🗄️ Documentation Base de Données SneakHouse

## Vue d'ensemble

SneakHouse utilise PostgreSQL via Supabase avec un schéma relationnel optimisé pour l'e-commerce de sneakers.

## Schéma Complet

### Diagramme ERD

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │    ORDERS       │    │   ORDER_ITEMS   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┤ user_id (FK)    │◄──┤ order_id (FK)   │
│ email           │    │ order_number    │    │ variant_id (FK) │
│ first_name      │    │ status          │    │ product_name    │
│ last_name       │    │ total_amount    │    │ quantity        │
│ phone           │    │ shipping_addr   │    │ unit_price      │
│ role            │    │ created_at      │    │ line_total      │
│ is_active       │    └─────────────────┘    └─────────────────┘
│ created_at      │             │
└─────────────────┘             ▼
                    ┌─────────────────┐
                    │    PAYMENTS     │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ order_id (FK)   │
                    │ amount          │
                    │ status          │
                    │ payment_method  │
                    │ transaction_id  │
                    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     BRANDS      │    │    PRODUCTS     │    │PRODUCT_VARIANTS │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┤ brand_id (FK)   │◄──┤ product_id (FK) │
│ name            │    │ category_id(FK) │    │ sku             │
│ description     │    │ name            │    │ color           │
│ created_at      │    │ description     │    │ price           │
└─────────────────┘    │ base_price      │    │ image_url       │
                       │ gender          │    │ is_active       │
┌─────────────────┐    │ is_active       │    └─────────────────┘
│   CATEGORIES    │    └─────────────────┘
├─────────────────┤             ▲
│ id (PK)         │─────────────┘
│ name            │
│ description     │
└─────────────────┘
```

## Tables Détaillées

### users
Table centrale des utilisateurs (clients, vendeurs, admins)

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer'
    CHECK (role IN ('customer', 'vendor', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

**Champs:**
- `id` - Identifiant unique UUID
- `email` - Email unique obligatoire
- `first_name`, `last_name` - Nom et prénom
- `phone` - Numéro de téléphone optionnel
- `role` - Rôle: customer, vendor, admin
- `is_active` - Statut actif/inactif
- `created_at`, `updated_at` - Timestamps de gestion

### brands
Marques de sneakers (Adidas, Nike, etc.)

```sql
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_brands_name ON brands(name);
```

### categories
Catégories de produits (Running, Basketball, etc.)

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_name ON categories(name);
```

### products
Produits de base (modèles de sneakers)

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  base_price DECIMAL(10,2),
  gender VARCHAR(20) CHECK (gender IN ('homme', 'femme', 'enfant', 'unisexe')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les requêtes courantes
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_price ON products(base_price);
```

### product_variants
Variantes de produits (couleurs, tailles, SKU)

```sql
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE,
  color VARCHAR(50),
  size VARCHAR(10),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0, -- À ajouter pour vraie gestion stock
  image_url TEXT,
  hover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index critiques
CREATE UNIQUE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_active ON product_variants(is_active);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity);
```

### orders
Commandes clients

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2),
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  shipping_address JSONB,
  billing_address JSONB,
  tracking_number VARCHAR(100),
  notes TEXT,
  processed_by UUID REFERENCES users(id),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_total ON orders(total_amount);
```

**Structure shipping_address (JSONB):**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "city": "Paris",
  "postal_code": "75001",
  "country": "France",
  "phone": "0123456789"
}
```

### order_items
Articles d'une commande

```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  size_id UUID, -- Référence optionnelle vers table sizes
  product_name VARCHAR(255), -- Dénormalisé pour historique
  variant_color VARCHAR(50),
  variant_sku VARCHAR(100),
  size_value VARCHAR(10),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour agrégations
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);
CREATE INDEX idx_order_items_product ON order_items(product_name);
```

### payments
Paiements associés aux commandes

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  payment_method VARCHAR(50) DEFAULT 'stripe',
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  transaction_id VARCHAR(255),
  provider_data JSONB, -- Données spécifiques au provider
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour réconciliation
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(processed_at);
```

## Tables Optionnelles (Extensions)

### sizes
Tailles standardisées (si besoin de plus de structure)

```sql
CREATE TABLE sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  size_value VARCHAR(10) NOT NULL, -- "42", "43", etc.
  size_display VARCHAR(20), -- "42 EU", "9 US", etc.
  size_type VARCHAR(20) DEFAULT 'EU', -- EU, US, UK
  category VARCHAR(20), -- homme, femme, enfant
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sizes_value ON sizes(size_value);
CREATE INDEX idx_sizes_type ON sizes(size_type);
```

### colors
Couleurs standardisées

```sql
CREATE TABLE colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  hex_code VARCHAR(7), -- #FF5733
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_colors_name ON colors(name);
```

### inventory_movements
Historique des mouvements de stock

```sql
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID REFERENCES product_variants(id),
  movement_type VARCHAR(20) CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason VARCHAR(100), -- 'sale', 'restock', 'damage', etc.
  reference_id UUID, -- order_id ou autre référence
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Vues Utiles

### Vue Produits avec Variantes

```sql
CREATE VIEW products_with_variants AS
SELECT
  p.id,
  p.name,
  p.description,
  b.name as brand_name,
  c.name as category_name,
  p.base_price,
  p.gender,
  pv.id as variant_id,
  pv.sku,
  pv.color,
  pv.price as variant_price,
  pv.image_url,
  pv.stock_quantity
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.is_active = true AND pv.is_active = true;
```

### Vue Commandes Complètes

```sql
CREATE VIEW orders_complete AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.total_amount,
  o.created_at,
  u.first_name || ' ' || u.last_name as customer_name,
  u.email as customer_email,
  COUNT(oi.id) as item_count,
  p.status as payment_status
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN payments p ON o.id = p.order_id
GROUP BY o.id, u.first_name, u.last_name, u.email, p.status;
```

## Requêtes d'Analytics

### Top Produits

```sql
SELECT
  oi.product_name,
  COUNT(*) as order_count,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.line_total) as total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'shipped', 'delivered')
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY oi.product_name
ORDER BY total_revenue DESC
LIMIT 10;
```

### Revenus par Période

```sql
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount) as daily_revenue
FROM orders
WHERE status IN ('confirmed', 'shipped', 'delivered')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

### Clients Top

```sql
SELECT
  u.first_name || ' ' || u.last_name as customer_name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as total_spent,
  MAX(o.created_at) as last_order_date
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status IN ('confirmed', 'shipped', 'delivered')
GROUP BY u.id, u.first_name, u.last_name, u.email
HAVING COUNT(o.id) > 1
ORDER BY total_spent DESC
LIMIT 20;
```

## Sécurité RLS (Row Level Security)

### Politiques de Base

```sql
-- Activer RLS sur toutes les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Utilisateurs voient leurs propres données
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid());

-- Clients voient leurs propres commandes
CREATE POLICY "customers_select_own_orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Admins ont accès complet
CREATE POLICY "admins_all_access" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Vendeurs voient les commandes assignées
CREATE POLICY "vendors_assigned_orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('vendor', 'admin')
    )
  );
```

## Maintenance & Performance

### Index de Performance

```sql
-- Index composites pour requêtes courantes
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_order_items_product_date ON order_items(product_name, created_at);
CREATE INDEX idx_variants_product_active ON product_variants(product_id, is_active);

-- Index partiels pour optimiser
CREATE INDEX idx_orders_recent ON orders(created_at)
  WHERE created_at > NOW() - INTERVAL '1 year';

CREATE INDEX idx_active_products ON products(id)
  WHERE is_active = true;
```

### Nettoyage Automatique

```sql
-- Fonction pour nettoyer les anciennes données
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Supprimer les paniers abandonnés (plus de 30 jours)
  DELETE FROM cart_items WHERE created_at < NOW() - INTERVAL '30 days';

  -- Archiver les commandes livrées anciennes
  UPDATE orders SET archived = true
  WHERE status = 'delivered'
    AND delivered_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Programmer l'exécution (via Supabase cron ou autre)
```

### Sauvegardes

```sql
-- Script de sauvegarde structure + données
pg_dump --schema-only sneakhouse > schema_backup.sql
pg_dump --data-only sneakhouse > data_backup.sql

-- Sauvegarde complète
pg_dump sneakhouse > full_backup.sql
```

Cette documentation couvre l'intégralité du schéma de base de données SneakHouse avec tous les aspects techniques nécessaires.