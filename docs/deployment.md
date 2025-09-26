# 🚀 Guide d'Installation et Déploiement SneakHouse

## Installation Locale

### Prérequis Système

- **Node.js** 18.0.0 ou supérieur
- **npm** 9.0.0 ou supérieur (inclus avec Node.js)
- **Git** pour cloner le repository
- **Compte Supabase** (gratuit)
- **Compte email SMTP** (Gmail recommandé)

### Étape 1: Clonage et Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/sneakhouse.git
cd sneakhouse

# Installer les dépendances
npm install

# Vérifier l'installation
npm run build
```

### Étape 2: Configuration Supabase

#### Créer un Projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Attendre la création (2-3 minutes)
4. Noter l'URL et la clé anonyme

#### Configurer la Base de Données

```sql
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Créer les tables (voir schema complet dans database.md)
-- Brands
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  base_price DECIMAL(10,2),
  gender VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE,
  color VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  hover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
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

-- Order Items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id),
  size_id UUID, -- Référence vers une table sizes si nécessaire
  product_name VARCHAR(255),
  variant_color VARCHAR(50),
  variant_sku VARCHAR(100),
  size_value VARCHAR(10),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  transaction_id VARCHAR(255),
  provider_data JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Désactiver RLS pour développement (TEMPORAIRE)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
```

#### Données de Test

```sql
-- Ajouter des marques
INSERT INTO brands (name, description) VALUES
('Adidas', 'Marque allemande de sportswear'),
('Nike', 'Marque américaine d\'équipement sportif'),
('Jordan', 'Sous-marque Nike de basketball');

-- Ajouter des catégories
INSERT INTO categories (name, description) VALUES
('Running', 'Chaussures de course'),
('Basketball', 'Chaussures de basketball'),
('Lifestyle', 'Chaussures casual');

-- Ajouter des produits de test
INSERT INTO products (name, description, brand_id, base_price, gender)
SELECT
  'Stan Smith',
  'Sneaker iconique en cuir blanc',
  brands.id,
  100.00,
  'unisexe'
FROM brands WHERE name = 'Adidas';
```

### Étape 3: Variables d'Environnement

```bash
# Créer le fichier .env.local
cp .env.example .env.local

# Éditer .env.local
nano .env.local
```

```env
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme

# Email Configuration (Gmail recommandé)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
EMAIL_FROM=noreply@sneakhouse.com

# Optionnel
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Étape 4: Configuration Email (Gmail)

1. Activer l'authentification à 2 facteurs sur Gmail
2. Générer un mot de passe d'application :
   - Google Account → Security → 2-Step Verification
   - App passwords → Generate new password
   - Copier le mot de passe dans `EMAIL_PASSWORD`

### Étape 5: Démarrage

```bash
# Mode développement
npm run dev

# Vérifier que tout fonctionne
open http://localhost:3000
```

## Déploiement Production

### Option 1: Vercel (Recommandée)

#### Prérequis
- Compte GitHub
- Compte Vercel
- Repository Git poussé sur GitHub

#### Étapes de Déploiement

1. **Préparer le Repository**
```bash
# S'assurer que tout est commité
git add .
git commit -m "Prêt pour déploiement"
git push origin main
```

2. **Configurer Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Connecter avec GitHub
- Import Project → Sélectionner le repository
- Configurer les variables d'environnement

3. **Variables d'Environnement Vercel**
```
NEXT_PUBLIC_SUPABASE_URL = https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = votre-cle-anonyme
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = votre-email@gmail.com
EMAIL_PASSWORD = votre-mot-de-passe-app
EMAIL_FROM = noreply@sneakhouse.com
NEXT_PUBLIC_SITE_URL = https://votre-site.vercel.app
```

4. **Déploiement**
- Cliquer "Deploy"
- Attendre la construction (2-3 minutes)
- Site accessible sur `https://votre-projet.vercel.app`

#### Configuration Domaine Personnalisé

1. Dans Vercel → Project Settings → Domains
2. Ajouter votre domaine : `sneakhouse.com`
3. Configurer les DNS selon les instructions
4. Attendre la propagation (quelques heures)

### Option 2: Netlify

```bash
# Build local
npm run build

# Déployer sur Netlify
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.next
```

### Option 3: Docker (Serveur Personnel)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./
RUN npm ci --only=production

# Copier source code
COPY . .

# Build application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
```

```bash
# Build et run Docker
docker build -t sneakhouse .
docker run -p 3000:3000 --env-file .env.local sneakhouse
```

## Configuration Production

### Base de Données Production

#### Activer RLS (Sécurité)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- etc...

-- Politiques de base
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins full access" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Sauvegardes Automatiques

```sql
-- Configurer dans Supabase Dashboard
-- Database → Backups → Enable automatic backups
-- Point-in-time recovery: Enable
```

### Monitoring & Alertes

#### Vercel Analytics
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  analytics: {
    // Activer Vercel Analytics
    id: process.env.VERCEL_ANALYTICS_ID,
  },
}
```

#### Sentry (Monitoring d'Erreurs)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance & Optimisation

#### Next.js Optimisations

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['supabase.co', 'votre-cdn.com'],
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

#### CDN pour Images

```bash
# Configurer Supabase Storage
# Storage → Create bucket "products-images"
# Upload images optimisées
# Utiliser les URLs CDN dans product_variants.image_url
```

### Sécurité Production

#### Headers de Sécurité

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

#### Variables Sensibles

```env
# Ne JAMAIS commiter les vraies valeurs
# Utiliser des secrets managers en production

# Development
EMAIL_PASSWORD=fake-password

# Production (Vercel/Netlify)
EMAIL_PASSWORD=real-app-password-from-gmail
```

### Maintenance & Updates

#### Mises à Jour de Sécurité

```bash
# Audit régulier
npm audit

# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit fix
```

#### Sauvegarde Base de Données

```bash
# Script de sauvegarde automatique
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql

# Uploader vers stockage cloud
aws s3 cp backup_$DATE.sql s3://backups-bucket/
```

## Troubleshooting Déploiement

### Erreurs Communes

#### Build Errors

```bash
# Erreur: Module not found
# Solution: Vérifier les imports et case sensitivity
npm run build -- --verbose

# Erreur: Environment variables
# Solution: Vérifier .env.local
printenv | grep NEXT_PUBLIC
```

#### Database Connection

```javascript
// Test de connexion Supabase
import { supabase } from './lib/supabase'

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count')
  console.log('Connection:', error ? 'Failed' : 'Success')
}
```

#### Email Issues

```bash
# Test envoi email
curl -X POST http://localhost:3000/api/send-confirmation \
  -H "Content-Type: application/json" \
  -d '{"orderNumber":"TEST","customerEmail":"test@example.com",...}'
```

### Logs & Debugging

```javascript
// lib/logger.ts (Production)
export function log(level: string, message: string, meta?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Envoyer à service de logs (Datadog, LogRocket, etc.)
    console.log(JSON.stringify({ level, message, meta, timestamp: new Date() }))
  } else {
    console.log(`[${level}] ${message}`, meta)
  }
}
```

### Performance Monitoring

```bash
# Lighthouse CI pour tests automatiques
npm install -g @lhci/cli

# Configuration .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
      },
    },
  },
};
```

Cette documentation couvre l'installation complète et le déploiement sécurisé de SneakHouse en production.