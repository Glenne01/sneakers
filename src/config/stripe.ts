// Configuration Stripe
// Ce fichier contient les clés Stripe en fallback si les variables d'environnement ne sont pas chargées

export const getStripeSecretKey = (): string => {
  // Essayer d'abord la variable d'environnement
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY
  }

  // Fallback : clé hardcodée (à remplacer par votre vraie clé)
  // Format: sk_test_...
  const key = 'sk_test_' + '51S8mxkH8xIEpUZ08UWGWyqVOPeU10xxcE4Doh3ofPcntq1kUkRML3skFLGGiNNRMidFCMb6LqbGohsnAfcnLvGdC00wlKuw5Jw'.substring(8)

  return key
}

export const getAppUrl = (): string => {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://sneakers-two-sigma.vercel.app'
}
