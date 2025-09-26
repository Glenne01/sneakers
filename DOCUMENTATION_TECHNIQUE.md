# Documentation Technique - SneakHouse

## 🏗️ Architecture générale

### Stack Technologique
- **Frontend**: Next.js 15 avec TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Animations**: Framer Motion
- **État global**: Zustand
- **Notifications**: React Hot Toast
- **Emails**: Nodemailer (SMTP Gmail)

### Structure du projet
```
src/
├── app/                    # App Router de Next.js
│   ├── admin/             # Pages d'administration
│   ├── api/               # API Routes
│   ├── checkout/          # Processus de commande
│   └── [autres-pages]/    # Pages publiques
├── components/            # Composants réutilisables
│   ├── admin/            # Composants admin
│   ├── layout/           # Layout et navigation
│   ├── products/         # Composants produits
│   └── ui/               # Composants UI de base
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires et configuration
├── stores/               # États globaux (Zustand)
└── types/                # Types TypeScript
```

## 🗄️ Base de données

### Modèle de données principal

#### Table `users`
```sql
- id (UUID, PK)
- auth_user_id (UUID, FK vers auth.users)
- email (VARCHAR, UNIQUE)
- first_name, last_name (VARCHAR)
- phone (VARCHAR, nullable)
- role (ENUM: admin, vendor, customer)
- is_active (BOOLEAN, default true)
- created_at, updated_at (TIMESTAMP)
```

#### Table `products`
```sql
- id (UUID, PK)
- brand_id (UUID, FK vers brands)
- category_id (UUID, FK vers categories)
- name (VARCHAR)
- description (TEXT)
- base_price (NUMERIC)
- gender (ENUM: homme, femme, enfant, unisexe)
- is_active (BOOLEAN)
- created_by (UUID, FK vers users)
- created_at, updated_at (TIMESTAMP)
```

#### Table `product_variants`
```sql
- id (UUID, PK)
- product_id (UUID, FK vers products)
- sku (VARCHAR, UNIQUE)
- color (VARCHAR)
- price (NUMERIC)
- image_url, hover_image_url (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### Table `orders`
```sql
- id (UUID, PK)
- order_number (VARCHAR, UNIQUE)
- user_id (UUID, FK vers users)
- status (ENUM: pending, confirmed, processing, shipped, delivered, cancelled)
- subtotal, shipping_cost, tax_amount, total_amount (NUMERIC)
- shipping_address, billing_address (JSONB)
- tracking_number (VARCHAR)
- processed_by (UUID, FK vers users)
- created_at, updated_at (TIMESTAMP)
```

### Relations importantes
- **Un utilisateur** peut avoir plusieurs commandes (1:N)
- **Un produit** peut avoir plusieurs variantes (1:N)
- **Une commande** contient plusieurs articles via `order_items` (N:M)
- **Le stock** est géré par variante et taille via `product_stock`

## 🔐 Authentification et autorisation

### Système de rôles
1. **Customer** (client)
   - Consulter produits
   - Passer commandes
   - Gérer son compte

2. **Vendor** (vendeur)
   - Accès administration limitée
   - Gérer les commandes
   - Consulter analytics

3. **Admin** (administrateur)
   - Accès complet
   - Gestion utilisateurs et vendeurs
   - Configuration système

### Middleware d'autorisation
- Hook `usePermissions()` pour vérifier les droits
- Composant `AdminLayout` protège les pages admin
- RLS (Row Level Security) activé sur certaines tables

## 🛒 Fonctionnalités clés

### Gestion du panier
- État global avec Zustand (`cartStore`)
- Persistance localStorage
- Calculs automatiques (sous-total, livraison, total)
- Gestion des stocks en temps réel

### Processus de commande
1. **Ajout au panier** → Vérification stock
2. **Checkout** → Saisie informations client/livraison
3. **Paiement** → Validation (simulation)
4. **Confirmation** → Création commande + Email
5. **Suivi** → Mise à jour statut par admin/vendeur

### Système d'emails
- **Confirmation de commande** automatique
- Templates HTML responsive
- Configuration SMTP Gmail
- Gestion d'erreurs non-bloquante

## 🔧 APIs et services

### API Routes principales
```
/api/
├── send-confirmation     # Envoi email confirmation
└── product-stock/[id]   # Gestion stock produits
```

### Services Supabase
- Authentification utilisateur
- CRUD sur toutes les entités
- Requêtes complexes avec jointures
- Gestion des images (Storage)

### Hooks personnalisés
- `usePermissions`: Gestion des droits d'accès
- `useAuth`: État d'authentification
- Stores Zustand pour états globaux

## 🎨 Interface utilisateur

### Design System
- **Couleurs primaires**: Orange (#f97316) et variants
- **Typography**: System fonts (-apple-system, etc.)
- **Composants**: Basés sur Tailwind + Headless UI
- **Responsive**: Mobile-first approch

### Composants réutilisables
- `Button`: Bouton avec variants
- `ProductCard`: Affichage produit
- `AdminLayout`: Layout administration
- `Header/Footer`: Navigation site

### Animations
- Framer Motion pour transitions
- Hover effects sur produits
- Loading states
- Page transitions

## 🚀 Déploiement et configuration

### Variables d'environnement
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
EMAIL_USER=
EMAIL_PASSWORD=
```

### Build et production
- Next.js build optimisé
- Images optimisées automatiquement
- TypeScript strict mode
- ESLint configuration

### Performance
- SSR/SSG hybride
- Image lazy loading
- Code splitting automatique
- Caching Supabase

## 🛠️ Maintenance et debug

### Logs et monitoring
- Console logs pour erreurs
- Toast notifications utilisateur
- Activity logs en base (table `activity_logs`)

### Tests et validation
- TypeScript pour la validation de types
- Validation côté client et serveur
- Gestion d'erreurs centralisée

### Évolutions futures
- Tests unitaires (Jest/React Testing Library)
- CI/CD pipeline
- Monitoring avancé (Sentry)
- Cache Redis pour performance
- Paiements réels (Stripe/PayPal)