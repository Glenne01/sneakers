# Guide des Pages - SneakHouse
## Rôles et utilité de chaque page

---

## 🏠 PAGES PUBLIQUES (Visiteurs)

### **Page d'Accueil** (`/`)
**Rôle** : Point d'entrée principal du site
**Utilité** :
- Présente la marque SneakHouse et Adidas
- Affiche les produits phares/nouveautés
- Guide l'utilisateur vers la boutique
- Créer une première impression professionnelle
**Pourquoi** : C'est la vitrine de votre business, elle doit convaincre et convertir les visiteurs en clients

### **Catalogue Sneakers** (`/sneakers`)
**Rôle** : Boutique en ligne principale
**Utilité** :
- Affiche tous les produits Adidas disponibles
- Filtrage par genre (Homme, Femme, Enfant)
- Recherche par nom/modèle
- Tri par prix, popularité, nouveauté
- Ajout direct au panier
**Pourquoi** : C'est le cœur de votre e-commerce, où se font 90% des ventes

### **Détail Produit** (`/sneakers/[id]`)
**Rôle** : Fiche produit détaillée
**Utilité** :
- Photos haute qualité avec zoom
- Description complète
- Sélection taille et couleur
- Vérification stock en temps réel
- Ajout aux favoris
**Pourquoi** : Convainc le client d'acheter en montrant tous les détails

### **Panier** (`/panier`)
**Rôle** : Récapitulatif avant achat
**Utilité** :
- Voir tous les articles sélectionnés
- Modifier quantités/tailles
- Calculer frais de port (gratuit > 100€)
- Aller vers la commande
**Pourquoi** : Dernière étape avant l'engagement d'achat, doit être claire et rassurante

### **Checkout** (`/checkout`)
**Rôle** : Processus de commande complet
**Utilité** :
- Saisie informations client
- Adresse de livraison
- Mode de paiement
- Récapitulatif final
- Confirmation de commande
**Pourquoi** : Convertit le panier en vente réelle, étape critique du business

---

## 👤 PAGES CLIENTS CONNECTÉS

### **Connexion** (`/login`)
**Rôle** : Authentification des utilisateurs
**Utilité** :
- Se connecter avec email/mot de passe
- Lien vers création de compte
- Récupération de mot de passe
**Pourquoi** : Permet de personnaliser l'expérience et garder l'historique des achats

### **Inscription** (`/signup`)
**Rôle** : Création de nouveaux comptes clients
**Utilité** :
- Formulaire complet (nom, email, téléphone)
- Validation en temps réel
- Création automatique du profil
**Pourquoi** : Acquérir de nouveaux clients et construire une base utilisateur

### **Mon Compte** (`/compte`)
**Rôle** : Gestion du profil utilisateur
**Utilité** :
- Modifier informations personnelles
- Changer mot de passe
- Voir statistiques personnelles
**Pourquoi** : Fidéliser les clients en leur donnant le contrôle de leurs données

### **Mes Commandes** (`/commandes`)
**Rôle** : Historique et suivi des achats
**Utilité** :
- Liste de toutes les commandes passées
- Statut en temps réel (en cours, expédié, livré)
- Détails de chaque commande
- Numéros de suivi
**Pourquoi** : Rassurer les clients sur leurs achats et réduire les demandes SAV

### **Mes Favoris** (`/favoris`)
**Rôle** : Liste de souhaits personnalisée
**Utilité** :
- Sauvegarder des produits pour plus tard
- Voir disponibilité/prix des favoris
- Achat rapide depuis les favoris
**Pourquoi** : Encourage les achats futurs et augmente le taux de conversion

### **Paramètres** (`/settings`)
**Rôle** : Configuration du compte
**Utilité** :
- Préférences de communication
- Gestion des adresses de livraison
- Paramètres de confidentialité
**Pourquoi** : Personnaliser l'expérience selon les préférences de chaque client

---

## 🔧 PAGES ADMINISTRATION

### **Dashboard Admin** (`/admin`)
**Rôle** : Vue d'ensemble de l'activité
**Utilité** :
- Statistiques de ventes en temps réel
- Graphiques de performance
- Résumé des commandes du jour
- Indicateurs clés (CA, nb commandes, clients)
**Pourquoi** : Pilotage business, prise de décision basée sur les données

### **Gestion Commandes** (`/admin/orders`)
**Rôle** : Traitement et suivi des ventes
**Utilité** :
- Liste complète des commandes
- Changer les statuts (confirmé → expédié → livré)
- Détails de chaque commande
- Impression étiquettes/factures
- Recherche par client/numéro
**Pourquoi** : Essentiel pour la logistique et la satisfaction client

### **Gestion Produits** (`/admin/products`)
**Rôle** : Catalogue et inventaire
**Utilité** :
- Ajouter/modifier/supprimer des produits
- Gestion des photos
- Mise à jour des prix
- Gestion du stock par taille/couleur
- Activation/désactivation produits
**Pourquoi** : Maintenir un catalogue à jour et gérer les stocks

### **Gestion Utilisateurs** (`/admin/users`)
**Rôle** : Base client et modération
**Utilité** :
- Liste de tous les clients inscrits
- Voir historique d'achats de chaque client
- Activer/désactiver des comptes
- Statistiques par utilisateur
**Pourquoi** : Connaître sa clientèle, identifier les VIP, gérer les problèmes

### **Gestion Vendeurs** (`/admin/vendors`)
**Rôle** : Équipe de vente (nouvellement corrigé !)
**Utilité** :
- Créer des comptes vendeurs
- Donner accès limité à l'admin
- Suivre performance des vendeurs
- Répartir les tâches
**Pourquoi** : Déléguer certaines tâches admin, faire grandir l'équipe

### **Analytics** (`/admin/analytics`)
**Rôle** : Business intelligence
**Utilité** :
- Analyses poussées des ventes
- Tendances produits/saisons
- Performance marketing
- Prévisions
**Pourquoi** : Optimiser les ventes, identifier les opportunités

### **Paramètres Admin** (`/admin/settings`)
**Rôle** : Configuration globale du site
**Utilité** :
- Paramètres généraux (frais de port, TVA)
- Configuration emails
- Thèmes et apparence
- Sauvegardes
**Pourquoi** : Personnaliser le fonctionnement selon vos besoins business

---

## 🔌 PAGES API (Invisibles)

### **Email Confirmation** (`/api/send-confirmation`)
**Rôle** : Envoi automatique d'emails
**Utilité** :
- Envoi email de confirmation après commande
- Template HTML professionnel
- Récapitulatif de la commande
**Pourquoi** : Rassurer le client et confirmer l'achat

### **Gestion Stock** (`/api/product-stock/[id]`)
**Rôle** : Mise à jour inventaire
**Utilité** :
- Vérifier disponibilité en temps réel
- Réserver stock pendant l'achat
- Éviter les surventes
**Pourquoi** : Éviter de vendre des produits en rupture

---

## 🎯 LOGIQUE MÉTIER

### **Parcours Client Type**
1. **Découverte** : Accueil → Sneakers (navigation)
2. **Sélection** : Fiche produit → Ajout panier
3. **Achat** : Panier → Checkout → Confirmation
4. **Suivi** : Mes commandes → Statut en temps réel
5. **Fidélisation** : Favoris → Rachats futurs

### **Workflow Admin**
1. **Matin** : Dashboard pour voir activité nuit
2. **Commandes** : Traiter nouvelles commandes
3. **Stock** : Mettre à jour inventaire
4. **Clients** : Répondre aux questions
5. **Analytics** : Analyser performance

### **Avantages Business**
- **Automatisation** : Moins de tâches manuelles
- **Transparence** : Client informé en temps réel
- **Évolutivité** : Peut gérer croissance du CA
- **Professionnalisme** : Image de marque renforcée
- **Data-driven** : Décisions basées sur les chiffres

Chaque page a été conçue pour optimiser soit **l'expérience client** (vente), soit **l'efficacité opérationnelle** (administration). L'objectif final : **maximiser les ventes tout en minimisant le temps de gestion**.