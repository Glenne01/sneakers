'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  BellIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  role: string
  created_at: string
}

interface Address {
  id: string
  label: string
  name: string
  address: string
  city: string
  postal_code: string
  country: string
  is_default: boolean
  user_id: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: string
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
      products: {
        name: string
        brand: string
        images: string[]
      }
    } | null
    sizes: {
      size: string
    } | null
  }>
}

interface FavoriteItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  color: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    // Vérifier les paramètres URL pour les onglets
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab && ['profile', 'addresses', 'orders', 'favorites', 'notifications', 'security'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])
  const [, setEditingAddress] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useState<User | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    first_name: string
    last_name: string
    email: string
    phone: string
    date_of_birth: string
  }>()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('🔐 Vérification de l\'authentification...')

      // Récupérer la session depuis localStorage directement
      const storedSession = localStorage.getItem('sb-pnkomglhvrwaddshwjff-auth-token')

      if (!storedSession) {
        console.log('❌ Pas de session dans localStorage')
        setLoading(false)
        router.push('/compte')
        return
      }

      try {
        const sessionData = JSON.parse(storedSession)
        const user = sessionData?.user || sessionData?.currentSession?.user

        if (!user || !user.id) {
          console.log('❌ Session invalide')
          setLoading(false)
          router.push('/compte')
          return
        }

        console.log('✅ Session trouvée dans localStorage')
        setAuthUser(user)
        await loadUserData(user.id)
      } catch (parseError) {
        console.error('❌ Erreur parsing session:', parseError)
        setLoading(false)
        router.push('/compte')
      }
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error)
      setLoading(false)
      router.push('/compte')
    }
  }

  const loadUserData = async (authUserId: string) => {
    try {
      setLoading(true)

      // Charger le profil utilisateur via API
      const profileResponse = await fetch(`/api/user/profile?authUserId=${authUserId}`, {
        cache: 'no-store'
      })

      if (!profileResponse.ok) {
        console.error('Erreur lors du chargement du profil')
        router.push('/compte')
        return
      }

      const profileResult = await profileResponse.json()
      if (!profileResult.success || !profileResult.data) {
        router.push('/compte')
        return
      }

      const userData = profileResult.data

      setUserProfile(userData)
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || ''
      })

      // Charger les commandes via API
      const ordersResponse = await fetch(`/api/orders?userId=${userData.id}`, {
        cache: 'no-store'
      })

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json()
        if (ordersResult.success) {
          setOrders(ordersResult.data || [])
        }
      }

      // Charger les adresses (appel Supabase direct car pas d'API)
      const { data: addressesData, error: addressesError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })

      if (!addressesError) {
        setAddresses(addressesData || [])
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'addresses', name: 'Adresses', icon: MapPinIcon },
    { id: 'orders', name: 'Commandes', icon: ShoppingBagIcon },
    { id: 'favorites', name: 'Favoris', icon: HeartIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon }
  ]

  const getOrderStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getOrderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'Livrée'
      case 'shipped': return 'Expédiée'
      case 'processing': return 'En préparation'
      case 'pending': return 'En attente'
      case 'cancelled': return 'Annulée'
      default: return 'Inconnue'
    }
  }

  const onProfileSubmit = async (data: {
    first_name: string
    last_name: string
    email: string
    phone: string
    date_of_birth: string
  }) => {
    try {
      if (!userProfile) return

      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          date_of_birth: data.date_of_birth
        })
        .eq('id', userProfile.id)

      if (error) {
        console.error('Erreur de mise à jour:', error)
        toast.error('Erreur lors de la mise à jour du profil')
        return
      }

      // Mettre à jour le profil local
      setUserProfile(prev => prev ? {
        ...prev,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        date_of_birth: data.date_of_birth
      } : null)

      toast.success('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erreur de suppression:', error)
        toast.error('Erreur lors de la suppression de l\'adresse')
        return
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id))
      toast.success('Adresse supprimée')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression de l\'adresse')
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      if (!userProfile) return

      // Désactiver toutes les autres adresses par défaut
      const { error: resetError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userProfile.id)

      if (resetError) {
        console.error('Erreur de reset:', resetError)
        toast.error('Erreur lors de la mise à jour')
        return
      }

      // Activer la nouvelle adresse par défaut
      const { error: setError } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)

      if (setError) {
        console.error('Erreur de mise à jour:', setError)
        toast.error('Erreur lors de la mise à jour')
        return
      }

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })))
      toast.success('Adresse par défaut mise à jour')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erreur de déconnexion:', error)
        toast.error('Erreur lors de la déconnexion')
        return
      }
      router.push('/')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la déconnexion')
    }
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
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du compte</h1>
              <p className="text-gray-600">Bonjour {userProfile.first_name} {userProfile.last_name}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-80"
          >
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{tab.name}</span>
                      <ChevronRightIcon className={`h-4 w-4 ml-auto transition-transform ${
                        activeTab === tab.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-soft"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

                    <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            {...register('first_name', { required: 'Le prénom est requis' })}
                            className="input-field"
                          />
                          {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            {...register('last_name', { required: 'Le nom est requis' })}
                            className="input-field"
                          />
                          {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          {...register('email', {
                            required: 'L\'email est requis',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Email invalide'
                            }
                          })}
                          className="input-field bg-gray-100"
                          disabled
                          title="L'email ne peut pas être modifié"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de naissance
                        </label>
                        <input
                          type="date"
                          {...register('date_of_birth')}
                          className="input-field"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="px-8">
                          Sauvegarder les modifications
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Adresses de livraison</h2>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter une adresse
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {addresses.length > 0 ? (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <h3 className="font-semibold text-gray-900">{address.label}</h3>
                                  {address.is_default && (
                                    <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                      Par défaut
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600">{address.name}</p>
                                <p className="text-gray-600">{address.address}</p>
                                <p className="text-gray-600">{address.postal_code} {address.city}</p>
                                <p className="text-gray-600">{address.country}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!address.is_default && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingAddress(address.id)}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">Aucune adresse</p>
                          <p className="text-gray-400 text-sm mt-1">Ajoutez une adresse de livraison</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des commandes</h2>

                    <div className="space-y-4">
                      {orders.length > 0 ? (
                        orders.map((order) => {
                          const itemCount = order.order_items?.length || 0
                          return (
                            <div
                              key={order.id}
                              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center space-x-4 mb-2">
                                    <h3 className="font-semibold text-gray-900">Commande {order.order_number}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}>
                                      {getOrderStatusText(order.status)}
                                    </span>
                                  </div>
                                  <p className="text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  <p className="text-gray-600">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">{formatPrice(parseFloat(order.total_amount))}</p>
                                  <Button variant="secondary" size="sm" className="mt-2">
                                    Voir détails
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-12">
                          <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">Aucune commande</p>
                          <p className="text-gray-400 text-sm mt-1">Vos commandes apparaîtront ici</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'favorites' && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes favoris</h2>

                    <div className="text-center py-12">
                      <HeartIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Aucun favori</p>
                      <p className="text-gray-400 text-sm mt-1">Les produits que vous aimez apparaîtront ici</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de notifications</h2>

                    <div className="space-y-6">
                      {[
                        { id: 'email_promo', label: 'Promotions et offres spéciales', description: 'Recevoir les dernières offres par email' },
                        { id: 'email_orders', label: 'Mises à jour de commandes', description: 'Notifications sur le statut de vos commandes' },
                        { id: 'email_newsletter', label: 'Newsletter', description: 'Actualités produits et tendances sneakers' },
                        { id: 'sms_delivery', label: 'SMS de livraison', description: 'Notifications SMS pour les livraisons' }
                      ].map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h3 className="font-medium text-gray-900">{pref.label}</h3>
                            <p className="text-sm text-gray-600">{pref.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité du compte</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Changer le mot de passe</h3>
                        <p className="text-gray-600 mb-4">Dernière modification il y a 3 mois</p>
                        <Button variant="secondary">
                          Modifier le mot de passe
                        </Button>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Authentification à deux facteurs</h3>
                        <p className="text-gray-600 mb-4">Ajoutez une couche de sécurité supplémentaire</p>
                        <Button variant="secondary">
                          Activer 2FA
                        </Button>
                      </div>

                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Sessions actives</h3>
                        <p className="text-gray-600 mb-4">Gérer les appareils connectés à votre compte</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">MacBook Pro - Chrome</p>
                              <p className="text-sm text-gray-600">Paris, France - Maintenant</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Actuelle
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}