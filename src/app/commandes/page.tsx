'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  updated_at: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: string
  shipping_address: string
  estimated_delivery?: string
  tracking_number?: string
  users: {
    first_name: string
    last_name: string
    email: string
  } | null
  order_items: Array<{
    id: string
    quantity: number
    price: string
    product_variants: {
      id: string
      price: string
      color: string
      image_url?: string
      products: {
        name: string
      }
    } | null
    sizes: {
      size: string
    } | null
  }>
}

export default function CommandesPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.push('/compte')
        return
      }

      // Charger le profil utilisateur via l'API
      const profileResponse = await fetch(`/api/user/profile?authUserId=${session.user.id}`, {
        cache: 'no-store'
      })

      if (!profileResponse.ok) {
        console.error('Erreur profil utilisateur')
        router.push('/compte')
        return
      }

      const profileResult = await profileResponse.json()

      if (!profileResult.success || !profileResult.data) {
        router.push('/compte')
        return
      }

      setUserProfile(profileResult.data)
      await loadOrders(profileResult.data.id)

    } catch (error) {
      console.error('Erreur d\'authentification:', error)
      router.push('/compte')
    }
  }

  const loadOrders = async (userId: string) => {
    try {
      setLoading(true)
      console.log('🔍 Chargement des commandes pour userId:', userId)

      // Charger les commandes via l'API
      const ordersResponse = await fetch(`/api/orders?userId=${userId}`, {
        cache: 'no-store'
      })

      if (!ordersResponse.ok) {
        throw new Error('Erreur lors du chargement des commandes')
      }

      const ordersResult = await ordersResponse.json()

      if (!ordersResult.success) {
        throw new Error(ordersResult.error || 'Erreur inconnue')
      }

      console.log('✅ Commandes chargées:', ordersResult.data.length)
      setOrders(ordersResult.data || [])

    } catch (error) {
      console.error('❌ Erreur lors du chargement des commandes:', error)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600 bg-orange-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'processing':
        return 'En préparation'
      case 'shipped':
        return 'Expédiée'
      case 'delivered':
        return 'Livrée'
      case 'cancelled':
        return 'Annulée'
      default:
        return 'Statut inconnu'
    }
  }

  const getProgressSteps = (status: Order['status']) => {
    const steps = [
      { key: 'pending', label: 'Commande passée', completed: true },
      { key: 'processing', label: 'En préparation', completed: false },
      { key: 'shipped', label: 'Expédiée', completed: false },
      { key: 'delivered', label: 'Livrée', completed: false }
    ]

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
    const currentIndex = statusOrder.indexOf(status)

    if (status === 'cancelled') {
      return [{ key: 'cancelled', label: 'Commande annulée', completed: true, cancelled: true }]
    }

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être connecté pour voir vos commandes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes commandes</h1>
          <p className="text-gray-600">
            Suivez l'état de vos commandes en temps réel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Orders List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const itemCount = order.order_items?.length || 0
                    const isSelected = selectedOrder?.id === order.id

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white rounded-xl p-6 shadow-soft cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Commande {order.order_number}
                                </h3>
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {new Date(order.created_at).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                {itemCount} article{itemCount > 1 ? 's' : ''}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-gray-900">
                                {formatPrice(parseFloat(order.total_amount))}
                              </span>
                              <div className="flex items-center text-orange-500 hover:text-orange-600">
                                <EyeIcon className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">Voir détails</span>
                                <ChevronRightIcon className="h-4 w-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-soft">
                  <TruckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune commande
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Vous n'avez pas encore passé de commande
                  </p>
                  <Button onClick={() => router.push('/boutique')}>
                    Découvrir nos produits
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-soft sticky top-8"
            >
              {selectedOrder ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Détails de la commande
                  </h2>

                  {/* Progress Steps */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivi</h3>
                    <div className="space-y-3">
                      {getProgressSteps(selectedOrder.status).map((step, index) => (
                        <div key={step.key} className="flex items-center">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? step.cancelled
                                ? 'bg-red-500 text-white'
                                : 'bg-green-500 text-white'
                              : step.current
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {step.completed ? (
                              step.cancelled ? (
                                <XCircleIcon className="h-4 w-4" />
                              ) : (
                                <CheckCircleIcon className="h-4 w-4" />
                              )
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <span className={`ml-3 text-sm ${
                            step.completed || step.current ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles</h3>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.product_variants?.image_url ? (
                              <img
                                src={item.product_variants.image_url}
                                alt={item.product_variants.products.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400 text-lg">👟</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product_variants?.products.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.product_variants?.color} • Taille {item.sizes?.size}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(parseFloat(item.price))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(parseFloat(selectedOrder.total_amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Livraison incluse</span>
                      <span>Gratuite</span>
                    </div>
                  </div>

                  {/* Tracking */}
                  {selectedOrder.tracking_number && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Numéro de suivi
                      </h4>
                      <p className="text-sm text-blue-700 font-mono">
                        {selectedOrder.tracking_number}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TruckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sélectionnez une commande pour voir les détails
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}