'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronLeftIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { getStripe } from '@/lib/stripe'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 Vérification de l\'authentification...')

        // Timeout très court de 2 secondes
        const timeoutId = setTimeout(() => {
          console.log('⏱️ Timeout - redirection vers /compte')
          setCheckingAuth(false)
          toast.error('Vous devez être connecté pour commander')
          router.push('/compte')
        }, 2000)

        const { data: { session } } = await supabase.auth.getSession()

        // Annuler le timeout si on a une réponse
        clearTimeout(timeoutId)

        if (!session) {
          console.log('❌ Non connecté - redirection vers /compte')
          toast.error('Vous devez être connecté pour passer commande')
          router.push('/compte')
          return
        }

        console.log('✅ Utilisateur connecté')
        setIsAuthenticated(true)
        setCheckingAuth(false)
      } catch (error) {
        console.error('❌ Erreur vérification auth:', error)
        setCheckingAuth(false)
        toast.error('Erreur d\'authentification')
        router.push('/compte')
      }
    }

    checkAuth()
  }, [router])

  const total = getTotal()
  const shipping = total > 100 ? 0 : 9.99
  const finalTotal = total + shipping

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre connexion...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
          <Link href="/sneakers">
            <Button>Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerInfo.firstName && customerInfo.lastName && customerInfo.email && customerInfo.phone) {
      handleNextStep()
    }
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 Formulaire soumis')
    console.log('Adresse:', shippingAddress)

    if (shippingAddress.address && shippingAddress.city && shippingAddress.postalCode) {
      console.log('✅ Validation OK, appel de handleStripeCheckout')
      // Au lieu de passer à l'étape 3, on redirige vers Stripe
      await handleStripeCheckout()
    } else {
      console.log('❌ Validation échouée')
      console.log('Adresse:', shippingAddress.address)
      console.log('Ville:', shippingAddress.city)
      console.log('Code postal:', shippingAddress.postalCode)
    }
  }

  const handleStripeCheckout = async () => {
    setLoading(true)
    console.log('🚀 Début du processus de paiement')
    console.log('Items:', items)
    console.log('Customer Info:', customerInfo)
    console.log('Shipping Address:', shippingAddress)

    try {
      console.log('📡 Envoi de la requête à /api/checkout...')

      // Créer une session de paiement Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          customerInfo,
          shippingAddress
        })
      })

      console.log('📥 Réponse reçue, status:', response.status)

      const data = await response.json()
      console.log('📦 Données reçues:', data)

      if (!response.ok) {
        console.error('❌ Erreur API:', data)
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement')
      }

      console.log('✅ Session Stripe créée:', data.sessionId)
      console.log('✅ URL Stripe:', data.url)

      // Rediriger directement vers l'URL de checkout fournie par Stripe
      if (data.url) {
        console.log('🔄 Redirection vers Stripe Checkout...')
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout manquante')
      }

    } catch (error: any) {
      console.error('❌ Erreur checkout Stripe:', error)
      toast.error(error.message || 'Erreur lors du paiement')
      setLoading(false)
    }
  }

  const handleOrderComplete = () => {
    clearCart()
    router.push('/')
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: '👤' },
    { number: 2, title: 'Adresse & Paiement', icon: '🏠' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sneakers" className="flex items-center text-gray-500 hover:text-gray-700">
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Retour aux achats
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Commande</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Steps Progress */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                      currentStep >= step.number 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.number ? '✓' : step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${
                        currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {steps.map(step => (
                  <span key={step.number} className="text-xs text-gray-500 max-w-16 text-center">
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 1: Customer Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-soft"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Continuer
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Shipping Address */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-soft"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Adresse de livraison</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-700">
                      <strong>💳 Paiement sécurisé</strong><br/>
                      Vous serez redirigé vers notre page de paiement sécurisée Stripe pour finaliser votre commande.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={handlePrevStep} className="flex-1">
                      Retour
                    </Button>
                    <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                      {loading ? 'Redirection...' : 'Procéder au paiement'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-soft h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Résumé de la commande</h3>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.variant.id}-${item.size.id}`} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.variant.image_url || '/placeholder-sneaker.jpg'}
                      alt={item.variant.product?.name || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.variant.product?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Taille {item.size.size_display} • Qté {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.variant.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="text-gray-900">
                  {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center">
                <TruckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-green-700">Livraison gratuite !</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}