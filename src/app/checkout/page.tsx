'use client'

import { useState } from 'react'
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

  const total = getTotal()
  const shipping = total > 100 ? 0 : 9.99
  const finalTotal = total + shipping

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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (shippingAddress.address && shippingAddress.city && shippingAddress.postalCode) {
      handleNextStep()
    }
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `SH-${timestamp}-${random}`
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
      return
    }

    setLoading(true)

    try {
      const newOrderNumber = generateOrderNumber()

      // 1. Créer l'utilisateur s'il n'existe pas
      let userId: string | null = null

      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerInfo.email)
        .single()

      if (existingUser) {
        userId = existingUser.id
      } else {
        // Créer un nouvel utilisateur
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: customerInfo.email,
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            phone: customerInfo.phone,
            role: 'customer',
            is_active: true
          })
          .select('id')
          .single()

        if (userError) throw userError
        userId = newUser.id
      }

      if (!userId) throw new Error('Impossible de créer ou récupérer l\'utilisateur')

      // 2. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: newOrderNumber,
          user_id: userId,
          status: 'confirmed',
          subtotal: total,
          shipping_cost: shipping,
          tax_amount: 0,
          total_amount: finalTotal,
          currency: 'EUR',
          shipping_address: {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: customerInfo.phone
          }
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      // 3. Créer les articles de la commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        variant_id: item.variant.id,
        size_id: item.size.id,
        product_name: item.variant.product?.name || '',
        variant_color: item.variant.color,
        variant_sku: item.variant.sku,
        size_value: item.size.size_value,
        unit_price: item.variant.price,
        quantity: item.quantity,
        line_total: item.variant.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 4. Créer le paiement
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          payment_method: 'stripe',
          status: 'completed',
          amount: finalTotal,
          currency: 'EUR',
          transaction_id: `stripe_${Date.now()}`,
          processed_at: new Date().toISOString()
        })

      if (paymentError) throw paymentError

      // Succès !
      setOrderNumber(newOrderNumber)
      handleNextStep()
      toast.success('Commande passée avec succès !')

    } catch (error: any) {
      console.error('Erreur lors du checkout:', error)
      toast.error(error.message || 'Erreur lors de la finalisation de la commande')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderComplete = () => {
    clearCart()
    router.push('/')
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: '👤' },
    { number: 2, title: 'Adresse de livraison', icon: '🏠' },
    { number: 3, title: 'Paiement', icon: '💳' },
    { number: 4, title: 'Confirmation', icon: '✅' }
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
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={handlePrevStep} className="flex-1">
                      Retour
                    </Button>
                    <Button type="submit" size="lg" className="flex-1">
                      Continuer
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-soft"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paiement</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du porteur *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d&apos;expiration *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={handlePrevStep} className="flex-1">
                      Retour
                    </Button>
                    <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                      {loading ? 'Traitement...' : 'Payer maintenant'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-soft text-center"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h2>
                <p className="text-gray-600 mb-8">
                  Votre commande a été traitée avec succès. Vous recevrez un email de confirmation avec les détails de votre commande.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Numéro de commande</p>
                  <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
                </div>
                <Button onClick={handleOrderComplete} size="lg" className="w-full">
                  Continuer mes achats
                </Button>
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