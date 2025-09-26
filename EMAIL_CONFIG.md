# Configuration Email pour SneakHouse

## Problème identifié
Les emails de confirmation de commande ne sont pas envoyés car les variables d'environnement email ne sont pas configurées correctement.

## Solution

### 1. Configuration Gmail (Recommandé)

1. **Créer un compte Gmail dédié** (ex: `sneakhouse.contact@gmail.com`)

2. **Activer l'authentification à 2 facteurs** :
   - Allez sur https://myaccount.google.com/security
   - Activez "Authentification en 2 étapes"

3. **Générer un mot de passe d'application** :
   - Dans la section "Authentification en 2 étapes"
   - Cliquez sur "Mots de passe des applications"
   - Sélectionnez "Application personnalisée"
   - Nommez-la "SneakHouse"
   - Notez le mot de passe généré (16 caractères)

4. **Mettre à jour le fichier `.env.local`** :
   ```env
   EMAIL_USER=sneakhouse.contact@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```
   (Remplacez par vos vraies données)

### 2. Alternative : Service SMTP professionnel

Pour un usage en production, considérez :
- **SendGrid** : Service d'emails transactionnels
- **Mailgun** : API d'emails robuste
- **Amazon SES** : Service d'emails AWS

### 3. Test de configuration

Après configuration, testez avec :
```bash
npm run dev
```

Puis effectuez une commande de test pour vérifier que l'email est bien envoyé.

## État actuel

✅ Code d'envoi d'email fonctionnel
✅ API `/api/send-confirmation` créée
✅ Intégration dans le processus de commande
❌ Variables d'environnement à configurer

## Notes importantes

- Les emails ne bloqueront pas le processus de commande s'ils échouent
- Les erreurs d'envoi sont loggées dans la console
- Le système utilise des templates HTML responsive