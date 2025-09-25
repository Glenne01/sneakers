# SneakHouse - Documentation du Projet

## 📋 Vue d'ensemble

**SneakHouse** est une boutique e-commerce moderne spécialisée dans la vente de sneakers premium Adidas. Le projet est développé avec Next.js 15 et utilise Supabase comme backend-as-a-service pour la gestion des données et de l'authentification.

### Informations générales
- **Nom du projet**: SneakHouse
- **Version**: 0.1.0
- **Type**: Application e-commerce Next.js
- **Domaine**: https://sneakhouse.fr
- **Spécialisation**: Sneakers premium Adidas

## 🛠 Stack Technique

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.21
- **UI Components**: Headless UI 2.2.8
- **Icons**: Heroicons 2.2.0
- **Forms**: React Hook Form 7.63.0
- **State Management**: Zustand 5.0.8
- **Notifications**: React Hot Toast 2.6.0

### Backend & Database
- **BaaS**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth Helpers
- **Client**: @supabase/supabase-js 2.57.4

### Outils de Développement
- **Bundler**: Turbopack (Next.js)
- **Linter**: ESLint 9
- **Package Manager**: npm
- **Fonts**: Google Fonts (Montserrat, Inter)

## 📁 Structure du Projet

```
sneakers/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── (pages)/
│   │   │   ├── page.tsx        # Page d'accueil
│   │   │   ├── layout.tsx      # Layout principal
│   │   │   ├── sneakers/       # Catalogue produits
│   │   │   ├── produit/[slug]/ # Pages produit dynamiques
│   │   │   ├── checkout/       # Processus de commande
│   │   │   ├── compte/         # Compte utilisateur
│   │   │   └── settings/       # Paramètres
│   │   ├── admin/              # Interface d'administration
│   │   │   ├── page.tsx        # Dashboard admin
│   │   │   ├── products/       # Gestion produits
│   │   │   ├── users/          # Gestion utilisateurs
│   │   │   ├── orders/         # Gestion commandes
│   │   │   ├── vendors/        # Gestion vendeurs
│   │   │   └── analytics/      # Statistiques
│   │   └── api/                # API Routes
│   │       └── product-stock/  # API gestion stock
│   ├── components/             # Composants réutilisables
│   │   ├── ui/                 # Composants UI génériques
│   │   ├── layout/             # Composants layout
│   │   ├── products/           # Composants produits
│   │   ├── cart/               # Composants panier
│   │   └── admin/              # Composants admin
│   ├── stores/                 # State management (Zustand)
│   │   ├── cartStore.ts        # Store du panier
│   │   └── adminStore.ts       # Store admin
│   ├── lib/                    # Utilitaires et configuration
│   │   ├── supabase.ts         # Configuration Supabase
│   │   ├── products.ts         # Fonctions produits
│   │   └── utils.ts            # Utilitaires généraux
│   ├── hooks/                  # Custom hooks
│   │   └── usePermissions.ts   # Hook permissions
│   └── types/                  # Définitions TypeScript
│       ├── database.ts         # Types database
│       └── admin.ts            # Types admin
├── public/                     # Assets statiques
├── .env.local                  # Variables d'environnement
├── tailwind.config.js          # Configuration Tailwind
├── next.config.ts              # Configuration Next.js
└── package.json                # Dépendances et scripts
```

## 🎯 Fonctionnalités Principales

### 🏪 E-commerce
- **Catalogue produits** avec filtrage par genre (homme, femme, enfant)
- **Pages produit détaillées** avec variants (tailles, couleurs)
- **Panier d'achat** avec gestion des quantités
- **Processus de checkout** complet
- **Gestion des stocks** en temps réel

### 👤 Gestion Utilisateurs
- **Authentification** via Supabase Auth
- **Comptes utilisateurs** avec profils personnalisés
- **Historique des commandes**
- **Système de permissions** (client, vendeur, admin)

### 🔧 Interface Administrateur
- **Dashboard analytics** avec métriques
- **Gestion produits** (CRUD complet)
- **Gestion utilisateurs** et permissions
- **Gestion commandes** et statuts
- **Gestion vendeurs** partenaires

### 🎨 UX/UI
- **Design responsive** mobile-first
- **Animations fluides** avec Framer Motion
- **Interface moderne** avec Tailwind CSS
- **Performance optimisée** avec Next.js 15

## 🌐 Pages et Routing

### Pages Publiques
- `/` - Page d'accueil avec hero section et produits populaires
- `/sneakers` - Catalogue complet avec filtres
- `/produit/[slug]` - Pages produit détaillées
- `/checkout` - Processus de commande
- `/compte` - Espace client (connexion requise)
- `/settings` - Paramètres utilisateur

### Pages Administrateur
- `/admin` - Dashboard principal
- `/admin/products` - Gestion des produits
- `/admin/users` - Gestion des utilisateurs
- `/admin/orders` - Gestion des commandes
- `/admin/vendors` - Gestion des vendeurs
- `/admin/analytics` - Statistiques et métriques

## 🔒 Authentification et Permissions

### Niveaux de Permission
1. **Client** - Navigation et achat
2. **Vendeur** - Gestion de leurs produits
3. **Administrateur** - Accès complet à l'interface admin

### Sécurité
- **Row Level Security (RLS)** activé sur Supabase
- **Authentification JWT** via Supabase Auth
- **Variables d'environnement** sécurisées
- **Validation côté client et serveur**

## 📊 Base de Données

### Tables Principales (via Supabase)
- **products** - Catalogue produits
- **product_variants** - Variants (tailles, couleurs, stock)
- **users** - Profils utilisateurs
- **orders** - Commandes
- **order_items** - Articles de commande
- **categories** - Catégories produits

## 🚀 Scripts NPM

```bash
# Développement avec Turbopack
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint
```

## 🔧 Configuration

### Variables d'Environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://pnkomglhvrwaddshwjff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_...
```

### Tailwind CSS
- Configuration personnalisée avec couleurs de marque
- Utilisation de plugins (@tailwindcss/forms)
- Classes utilitaires custom pour gradients

### Next.js
- App Router activé
- Turbopack pour le développement et la production
- Optimisations d'images automatiques
- Fonts Google intégrées

## 📈 Performance et SEO

### Optimisations
- **SSR/SSG** avec Next.js App Router
- **Images optimisées** avec next/image
- **Fonts optimisées** avec next/font
- **Code splitting** automatique
- **Lazy loading** des composants

### SEO
- **Métadonnées complètes** (title, description, keywords)
- **Open Graph** et Twitter Cards
- **Structured data** pour les produits
- **Sitemap** automatique
- **Robots.txt** configuré

## 🎨 Design System

### Couleurs Principales
- **Orange/Rouge** - Couleurs de marque (#f97316, #ef4444)
- **Gradients** - Utilisés pour les CTA et accents
- **Neutres** - Grays pour le texte et backgrounds

### Typography
- **Montserrat** - Font principale (headings)
- **Inter** - Font secondaire (body text)
- **Responsive** - Tailles adaptatives

### Composants
- **Button** - Composant bouton réutilisable
- **ProductCard** - Carte produit standardisée
- **Layout** - Structure de page commune
- **AdminLayout** - Layout spécifique admin

## 🔄 State Management

### Zustand Stores
- **cartStore** - Gestion du panier d'achat
- **adminStore** - État de l'interface admin

### Avantages de Zustand
- Léger et simple d'utilisation
- Pas de boilerplate
- TypeScript first
- Persistence possible

## 📱 Responsive Design

### Breakpoints
- **Mobile First** - Design optimisé mobile
- **Tailwind Breakpoints** - sm, md, lg, xl, 2xl
- **Composants adaptatifs** - Grid et flex responsive
- **Images adaptatives** - Sizes et srcSet automatiques

## 🧪 Qualité du Code

### Linting et Formatting
- **ESLint** avec config Next.js
- **TypeScript** strict mode
- **Conventions** de nommage cohérentes

### Structure
- **Separation of Concerns** - Composants, stores, utils séparés
- **Custom Hooks** - Logique réutilisable
- **Type Safety** - TypeScript partout

## 🚀 Déploiement

### Recommandations
- **Vercel** - Hébergement optimisé Next.js
- **Supabase** - Backend automatiquement géré
- **Variables d'env** - Configuration via dashboard
- **Domaine custom** - sneakhouse.fr

## 📋 TODO et Améliorations

### Fonctionnalités à ajouter
- [ ] Système de wishlist
- [ ] Évaluations et avis produits
- [ ] Programme de fidélité
- [ ] Chat client en temps réel
- [ ] Multi-langue (i18n)

### Optimisations
- [ ] PWA (Progressive Web App)
- [ ] Service Worker pour cache
- [ ] Optimisations Core Web Vitals
- [ ] Tests automatisés (Jest/Cypress)

---

*Documentation générée le 25 septembre 2025 par Claude Code*