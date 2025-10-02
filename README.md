# 🔥 SneakHouse - E-commerce de Sneakers

> Plateforme e-commerce moderne spécialisée dans la vente de sneakers avec interface admin et vendeur.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

## 🌐 Déploiement

Le site est déployé en production sur **Vercel** avec déploiement automatique depuis la branche `main`.

- **URL de production** : [https://sneakers-two-sigma.vercel.app](https://sneakers-two-sigma.vercel.app)
- **Déploiement continu** : Chaque push sur `main` déclenche automatiquement un nouveau déploiement
- **Preview deployments** : Chaque pull request génère un environnement de preview unique
- **Variables d'environnement** : Configurées directement dans le dashboard Vercel

## ✨ Fonctionnalités Principales

### 🛒 Site Client
- **Catalogue de sneakers** avec filtrage par marque, genre, prix
- **Système de panier** avec gestion des variantes (tailles, couleurs)
- **Processus de commande** complet avec paiement Stripe
- **Gestion automatique des stocks** après achat
- **Compte client** avec historique des commandes et téléchargement de factures PDF
- **Emails de confirmation** automatiques
- **Interface responsive** mobile-friendly avec design moderne

### 👨‍💼 Espace Admin (`/admin`)
- **Dashboard** avec métriques et statistiques
- **Gestion des utilisateurs** (clients, vendeurs, admins)
- **Gestion des produits** (CRUD complet)
- **Gestion des commandes** avec changement de statut
- **Gestion des vendeurs** avec création et activation
- **Analytics** détaillées avec graphiques

### 🏪 Espace Vendeur (`/vendeur`)
- **Dashboard vendeur** avec stats personnalisées
- **Gestion des commandes** avec filtrage et changement de statut
- **Gestion des stocks** (produits) avec interface complète
- Interface identique à l'admin pour commandes et stocks

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend       → Next.js 15 + TypeScript + Tailwind CSS
Backend        → Supabase (PostgreSQL + Auth + Storage)
State          → Zustand pour le panier et l'état global
UI             → Headless UI + Heroicons + Framer Motion
Email          → Resend (en mode simulation)
Paiement       → Stripe Checkout
PDF            → pdfkit pour génération de factures
Déploiement    → Vercel (CI/CD automatique)
```

### Structure du Projet
```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── admin/             # Interface administration
│   ├── vendeur/           # Interface vendeur
│   ├── api/               # API Routes (email, etc.)
│   ├── sneakers/          # Catalogue produits
│   └── checkout/          # Processus de commande
├── components/            # Composants réutilisables
│   ├── admin/            # Composants spécifiques admin
│   ├── vendor/           # Composants spécifiques vendeur
│   └── ui/               # Composants UI génériques
├── lib/                  # Utilitaires et configurations
├── stores/               # État global (Zustand)
├── types/                # Types TypeScript
└── styles/               # Styles CSS
```

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- Compte Supabase
- Variables d'environnement configurées

### Configuration
```bash
# 1. Cloner le projet
git clone <votre-repo>
cd sneakers

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

### Variables d'environnement
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Resend (Email - optionnel)
RESEND_API_KEY=your_resend_api_key
```

### Démarrage
```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

## 🎯 Guide d'Utilisation

### Accès aux Interfaces

**En production (Vercel)** :
- **Site client** : [https://sneakers-two-sigma.vercel.app](https://sneakers-two-sigma.vercel.app)
- **Admin** : [https://sneakers-two-sigma.vercel.app/admin](https://sneakers-two-sigma.vercel.app/admin)
- **Vendeur** : [https://sneakers-two-sigma.vercel.app/vendeur](https://sneakers-two-sigma.vercel.app/vendeur)

**En local** :
- **Site client** : `http://localhost:3000`
- **Admin** : `http://localhost:3000/admin`
- **Vendeur** : `http://localhost:3000/vendeur`

### Rôles Utilisateurs
- **Customer** : Commandes et compte client
- **Vendor** : Gestion produits et commandes assignées
- **Admin** : Accès complet à toute la plateforme

### Processus de Commande
1. **Ajout au panier** depuis le catalogue
2. **Validation panier** avec choix tailles/couleurs
3. **Informations client** (nom, email, téléphone)
4. **Adresse livraison** avec validation
5. **Paiement** (simulé Stripe)
6. **Confirmation** avec email automatique

## 📊 Fonctionnalités Avancées

### Gestion des Stocks
- **Décrément automatique** après chaque achat
- **Suivi des mouvements** avec historique dans `stock_movements`
- **Prévention stock négatif** (minimum à 0)
- **Audit trail** complet pour chaque mouvement

### Système de Commandes
- **Statuts multiples** : pending, confirmed, processing, shipped, delivered, cancelled
- **Changement de statut** en temps réel
- **Emails de confirmation** automatiques (mode simulation)
- **Génération de factures PDF** téléchargeables
- **Filtrage avancé** par statut, client, numéro de commande

### Paiement
- **Intégration Stripe Checkout** complète
- **Vérification du paiement** avant création de commande
- **Gestion des métadonnées** du panier dans la session Stripe
- **Redirection automatique** après paiement réussi

## 🐛 Notes Techniques

### Gestion des Sessions
- **localStorage** utilisé pour l'authentification côté client (évite les timeouts Supabase)
- **Timeouts sur les fetches** (5s) pour éviter les chargements infinis
- **Cache désactivé** sur toutes les API routes (`force-dynamic`, `revalidate = 0`)

### Emails
- **Resend API** configurée mais en mode simulation
- Pour activer : définir `RESEND_API_KEY` dans les variables d'environnement Vercel
- Templates HTML responsive inclus

### Factures PDF
- **pdfkit** utilisé pour la génération côté serveur
- Compatible avec Vercel Edge Runtime
- Téléchargement direct depuis la page commandes client

## 📝 Base de Données

### Tables Principales
- `users` - Utilisateurs (clients, vendeurs, admins)
- `products` - Produits avec relations marques/catégories
- `product_variants` - Variantes avec prix et images
- `product_stock` - Stocks par variante et taille
- `stock_movements` - Historique des mouvements de stock
- `orders` - Commandes clients
- `order_items` - Articles de commande avec détails complets
- `payments` - Paiements Stripe traités
- `sizes` - Tailles disponibles (EU, US, UK)

## 🚀 Roadmap

### ✅ Fonctionnalités Implémentées
- [x] Gestion automatique des stocks avec décrément
- [x] Paiement Stripe Checkout intégré
- [x] Génération de factures PDF
- [x] Système de commandes complet
- [x] Interfaces Admin et Vendeur
- [x] Déploiement automatique sur Vercel
- [x] Emails de confirmation (mode simulation)

### 📋 À Développer
- [ ] Activation complète des emails (Resend API)
- [ ] Graphiques analytics avec Chart.js
- [ ] Upload d'images produits
- [ ] Système d'avis clients
- [ ] Wishlist / Favoris
- [ ] Programme de fidélité
- [ ] Tests unitaires et E2E

## 🔒 Sécurité

- **Row Level Security (RLS)** activée sur toutes les tables Supabase
- **Validation des paiements** côté serveur avant création de commande
- **Protection des routes admin** et vendeur
- **Variables d'environnement** sécurisées sur Vercel
- **Sanitisation des inputs** utilisateurs

---

**🎨 Développé avec ❤️ pour SneakHouse**
