'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircleIcon, ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="h-12 w-12 text-red-500" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement annulé
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Votre paiement a été annulé. Aucune charge n'a été effectuée sur votre carte.
            Vos articles sont toujours dans votre panier.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700">
              <strong>💡 Besoin d'aide ?</strong><br/>
              Si vous avez rencontré un problème lors du paiement, n'hésitez pas à contacter notre service client.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => router.push('/checkout')}
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retourner au paiement
            </Button>
            <Link href="/sneakers" className="block">
              <Button size="lg" variant="secondary" className="w-full">
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Continuer mes achats
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Des questions ? Contactez notre{' '}
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
