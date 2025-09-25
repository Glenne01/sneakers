'use client'

import { useState } from 'react'
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
  CheckIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}

interface Address {
  id: string
  label: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface Order {
  id: string
  date: string
  status: 'delivered' | 'in_transit' | 'processing' | 'cancelled'
  total: number
  items: number
}

interface FavoriteItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
  color: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-09-20',
    status: 'delivered',
    total: 105,
    items: 1
  },
  {
    id: 'ORD-002', 
    date: '2024-09-18',
    status: 'in_transit',
    total: 230,
    items: 2
  }
]

const mockFavorites: FavoriteItem[] = [
  {
    id: '1',
    name: 'Handball Spezial Shoes',
    brand: 'Adidas',
    price: 105,
    image: 'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08c7c0fc4ae849328c0546ad74075e6e_9366/chaussure-handball-spezial.jpg',
    color: 'Noir/Blanc'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [editingAddress] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Domicile',
      name: 'Jean Dupont',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      isDefault: true
    }
  ])

  const { register, handleSubmit, formState: { errors } } = useForm<UserProfile>({
    defaultValues: {
      firstName: 'Jean',
      lastName: 'Dupont', 
      email: 'jean.dupont@example.com',
      phone: '06 12 34 56 78',
      dateOfBirth: '1990-01-01'
    }
  })

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
      case 'in_transit': return 'text-blue-600 bg-blue-100'  
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getOrderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'Livrée'
      case 'in_transit': return 'En transit'
      case 'processing': return 'En préparation'
      case 'cancelled': return 'Annulée'
      default: return 'Inconnue'
    }
  }

  const onProfileSubmit = async (data: UserProfile) => {
    try {
      console.log('Profile update:', data)
      toast.success('Profil mis à jour avec succès !')
    } catch {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id))
    toast.success('Adresse supprimée')
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    toast.success('Adresse par défaut mise à jour')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du compte</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
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
                            {...register('firstName', { required: 'Le prénom est requis' })}
                            className="input-field"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            {...register('lastName', { required: 'Le nom est requis' })}
                            className="input-field"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
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
                          className="input-field"
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
                          {...register('dateOfBirth')}
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
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold text-gray-900">{address.label}</h3>
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                    Par défaut
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600">{address.name}</p>
                              <p className="text-gray-600">{address.address}</p>
                              <p className="text-gray-600">{address.postalCode} {address.city}</p>
                              <p className="text-gray-600">{address.country}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!address.isDefault && (
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
                      ))}
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
                      {mockOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-4 mb-2">
                                <h3 className="font-semibold text-gray-900">Commande {order.id}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}>
                                  {getOrderStatusText(order.status)}
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {new Date(order.date).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long', 
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="text-gray-600">{order.items} article{order.items > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">{order.total}€</p>
                              <Button variant="secondary" size="sm" className="mt-2">
                                Voir détails
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockFavorites.map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-gray-600">{item.brand}</p>
                              <p className="text-sm text-gray-500">{item.color}</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{item.price}€</p>
                            </div>
                            <Button variant="secondary" size="sm">
                              Ajouter au panier
                            </Button>
                          </div>
                        </div>
                      ))}
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