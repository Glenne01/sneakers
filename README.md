# 🔥 SneakHouse - E-commerce de Sneakers

> Plateforme e-commerce moderne spécialisée dans la vente de sneakers avec interface admin et vendeur.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)

## ✨ Fonctionnalités Principales

### 🛒 Site Client
- **Catalogue de sneakers** avec filtrage par marque, genre, prix
- **Système de panier** avec gestion des variantes (tailles, couleurs)
- **Processus de commande** complet avec paiement Stripe simulé
- **Compte client** avec historique des commandes
- **Interface responsive** mobile-friendly

### 👨‍💼 Espace Admin (`/admin`)
- **Dashboard** avec métriques et statistiques
- **Gestion des utilisateurs** (clients, vendeurs, admins)
- **Gestion des produits** (CRUD complet)
- **Gestion des commandes** avec changement de statut
- **Gestion des vendeurs** avec création et activation
- **Analytics** détaillées avec graphiques

### 🏪 Espace Vendeur (`/vendeur`)
- **Dashboard vendeur** avec stats personnalisées
- **Gestion des commandes** assignées au vendeur
- **Gestion des produits** avec ajout/modification
- **Gestion des stocks** avec alertes et actions rapides
- **Analytics vendeur** avec performance de vente

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend    → Next.js 15 + TypeScript + Tailwind CSS
Backend     → Supabase (PostgreSQL + Auth + Storage)
State       → Zustand pour le panier et l'état global
UI          → Headless UI + Heroicons + Framer Motion
Email       → Nodemailer avec templates HTML
Paiement    → Stripe (simulé)
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

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
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
- **Suivi en temps réel** par variante produit
- **Alertes** de rupture de stock
- **Actions rapides** +1/-1 directement dans l'interface
- **Statistiques** de valeur de stock

### Système de Commandes
- **Statuts multiples** : pending, confirmed, processing, shipped, delivered, cancelled
- **Changement de statut** en temps réel
- **Notifications email** automatiques
- **Filtrage avancé** par statut, client, produit

## 🐛 Problèmes Connus

### Stocks
- Les stocks sont actuellement simulés (pas de colonne `stock_quantity`)
- Pour un vrai système, ajouter une colonne stock dans `product_variants`

### Commandes
- Les requêtes complexes avec jointures peuvent échouer silencieusement
- Solution temporaire : requêtes séparées pour orders → users → order_items

### Email
- Configuration SMTP requise pour les confirmations de commande
- Utiliser un service comme Gmail avec mot de passe d'application

## 📝 Base de Données

### Tables Principales
- `users` - Utilisateurs (clients, vendeurs, admins)
- `products` - Produits avec relations marques/catégories
- `product_variants` - Variantes avec prix et images
- `orders` - Commandes clients
- `order_items` - Articles de commande
- `payments` - Paiements traités

## 🚀 Roadmap

### À développer
- [ ] Vrai système de gestion des stocks
- [ ] Graphiques avec Chart.js dans Analytics
- [ ] Upload d'images produits
- [ ] Authentification utilisateurs complète
- [ ] API REST documentée
- [ ] Tests unitaires

---

**Développé avec ❤️ par l'équipe SneakHouse**
