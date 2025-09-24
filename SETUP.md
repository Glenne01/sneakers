# Configuration SneakHouse

## 1. Configuration Supabase

### Variables d'environnement (.env.local)
Remplacez les valeurs dans le fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhb...
```

### 2. Base de données
Le schéma SQL complet a été fourni et doit être exécuté dans l'éditeur SQL de Supabase.

### 3. Politiques RLS (Row Level Security)
Les politiques sont déjà définies dans le script SQL.

## 2. Démarrage de l'application

### Installation des dépendances
```bash
npm install
```

### Lancement en développement
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 3. Structure du projet

### Pages disponibles
- `/` - Page d'accueil avec hero section
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/catalogue` - Liste des produits (à développer)
- `/produit/[slug]` - Fiche produit (à développer)

### Fonctionnalités implémentées
- ✅ Structure Next.js 15 avec TypeScript
- ✅ Tailwind CSS avec design system complet
- ✅ Authentification Supabase complète
- ✅ Gestion d'état avec Zustand
- ✅ Système de panier persistant
- ✅ Interface responsive mobile-first
- ✅ Animations avec Framer Motion
- ✅ Système de notifications (toast)
- ✅ Composants UI réutilisables

### Couleurs du thème
- Orange principal : #FE6601
- Noir : #000000
- Blanc : #FFFFFF
- Gris clair : #B4B4B4

### Police
- Principale : Montserrat
- Accent : Intro Rust

## 4. Prochaines étapes

1. **Catalogue produits** - Interface avec filtres et recherche
2. **Fiche produit** - Page détaillée avec sélecteur de taille
3. **Système de panier** - Checkout et processus de commande
4. **Interface d'administration** - Dashboard pour gérer les produits et commandes

## 5. Base de données

Les données de test sont déjà intégrées avec :
- 2 produits principaux (Gazelle, Handball Spezial)
- 8 variantes de couleurs
- Stock généré aléatoirement
- Toutes les tailles de 36 à 46

## 6. Authentification

Le système d'authentification est complet avec :
- Inscription/Connexion
- Profils utilisateurs
- Système de rôles (admin, vendor, customer)
- Gestion des sessions
- Pages protégées

L'application est maintenant prête pour les développements suivants !