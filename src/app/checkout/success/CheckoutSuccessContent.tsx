'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/stores/cartStore'
import toast from 'react-hot-toast'

export default function CheckoutSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCartStore()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    if (session_id) {
      setSessionId(session_id)
      // Envoyer l'email de confirmation
      sendConfirmationEmail(session_id)
      // Vider le panier après un paiement réussi
      clearCart()
    } else {
      // Si pas de session_id, rediriger vers l'accueil
      router.push('/')
    }
  }, [searchParams, clearCart, router])

  const sendConfirmationEmail = async (session_id: string) => {
    try {
      setSendingEmail(true)

      // Créer la commande dans Supabase
      console.log('📝 Création de la commande...')
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: session_id })
      })

      const result = await response.json()

      if (!result.success) {
        console.error('❌ Erreur création commande:', result.error)
        toast.error('Erreur lors de la création de la commande')
        return
      }

      console.log('✅ Commande créée:', result.orderNumber)

      // Marquer l'email comme envoyé
      setEmailSent(true)
      toast.success('Commande confirmée !', {
        icon: '✅',
        duration: 4000,
      })

    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      toast.error('Erreur lors de la création de la commande')
    } finally {
      setSendingEmail(false)
    }
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-4">
            Votre commande a été confirmée avec succès.
          </p>

          {/* Email Status */}
          {sendingEmail ? (
            <div className="flex items-center justify-center text-sm text-gray-500 mb-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
              Création de votre commande...
            </div>
          ) : emailSent ? (
            <div className="flex items-center justify-center text-sm text-green-600 mb-8">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Commande enregistrée !
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-8">
              Traitement en cours...
            </p>
          )}

          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500 mb-1">Référence de paiement</p>
            <p className="text-xs font-mono text-gray-700 break-all">{sessionId}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/commandes" className="block">
              <Button size="lg" className="w-full">
                Voir mes commandes
              </Button>
            </Link>
            <Link href="/sneakers" className="block">
              <Button size="lg" variant="secondary" className="w-full">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Continuer mes achats
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? Contactez notre{' '}
              <Link href="/contact" className="text-orange-500 hover:text-orange-600 font-medium">
                service client
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
