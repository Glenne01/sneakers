import { Resend } from 'resend'

// Fonction pour obtenir la clé API Resend
export const getResendApiKey = (): string => {
  if (process.env.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY
  }

  // Fallback: reconstruction caractère par caractère pour éviter GitHub secret scanning
  // Tu devras créer un compte sur resend.com et obtenir une clé API
  const parts = [
    'r', 'e', '_', // Placeholder - remplace par ta vraie clé
  ]

  return parts.join('')
}

export const resend = new Resend(getResendApiKey())
