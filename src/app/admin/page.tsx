'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CubeIcon, 
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore, loginAsAdmin, loginAsVendor } from '@/stores/adminStore'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

interface StatCard {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAdminStore()
  const { canAccess } = usePermissions(user?.role || 'user')
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealStats()
  }, [])

  const loadRealStats = async () => {
    try {
      // Charger les vraies statistiques depuis la base de données
      const [ordersResult, usersResult, productsResult] = await Promise.all([
        supabase.from('orders').select('id, total_amount'),
        supabase.from('users').select('id').eq('role', 'customer'),
        supabase.from('products').select('id')
      ])

      const ordersCount = ordersResult.data?.length || 0
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0
      const usersCount = usersResult.data?.length || 0
      const productsCount = productsResult.data?.length || 0

      const realStats: StatCard[] = [
        {
          title: 'Commandes totales',
          value: ordersCount,
          change: '0%',
          trend: 'neutral',
          icon: ShoppingBagIcon,
          color: 'bg-blue-500'
        },
        {
          title: 'Revenus',
          value: `€${totalRevenue.toFixed(2)}`,
          change: '0%',
          trend: 'neutral',
          icon: CurrencyEuroIcon,
          color: 'bg-green-500'
        },
        {
          title: 'Utilisateurs',
          value: usersCount,
          change: '0%',
          trend: 'neutral',
          icon: UsersIcon,
          color: 'bg-purple-500'
        },
      {
        title: 'Produits',
        value: productsCount,
        change: '0%',
        trend: 'neutral',
        icon: CubeIcon,
        color: 'bg-orange-500'
      }
    ]

      // Filtrer les stats selon les permissions
      const filteredStats = realStats.filter(stat => {
        if (stat.title.includes('Commandes') && !canAccess('orders')) return false
        if (stat.title.includes('Utilisateurs') && !canAccess('users')) return false
        if (stat.title.includes('Produits') && !canAccess('products')) return false
        return true
      })

      setStats(filteredStats)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
      // Fallback avec des valeurs par défaut
      const fallbackStats = [
        { title: 'Commandes totales', value: 0, change: '0%', trend: 'neutral', icon: ShoppingBagIcon, color: 'bg-blue-500' },
        { title: 'Revenus', value: '€0', change: '0%', trend: 'neutral', icon: CurrencyEuroIcon, color: 'bg-green-500' },
        { title: 'Utilisateurs', value: 0, change: '0%', trend: 'neutral', icon: UsersIcon, color: 'bg-purple-500' },
        { title: 'Produits', value: 0, change: '0%', trend: 'neutral', icon: CubeIcon, color: 'bg-orange-500' }
      ]
      setStats(fallbackStats)
    } finally {
      setLoading(false)
    }
  }

  // Écran de connexion pour développement
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-soft max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Connectez-vous pour accéder au panel admin</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={loginAsAdmin}
              className="w-full"
            >
              Se connecter comme Admin
            </Button>
            <Button 
              onClick={loginAsVendor}
              variant="secondary"
              className="w-full"
            >
              Se connecter comme Vendeur
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Connexion temporaire pour développement
            </p>
          </div>
        </div>
      </div>
    )
  }

  const recentOrders: any[] = []

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Bonjour {user.firstName}, voici un aperçu de votre {user.role === 'admin' ? 'boutique' : 'activité'}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: il y a 5 minutes
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          {canAccess('orders') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {order.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">Aucune commande récente</p>
                      <p className="text-gray-400 text-xs mt-1">Les nouvelles commandes apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {canAccess('products') && (
                  <Link href="/admin/products">
                    <Button className="w-full justify-start" variant="secondary">
                      <CubeIcon className="h-4 w-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </Link>
                )}
                {canAccess('orders') && (
                  <Link href="/admin/orders">
                    <Button className="w-full justify-start" variant="secondary">
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Voir les commandes
                    </Button>
                  </Link>
                )}
                {canAccess('users') && (
                  <Link href="/admin/users">
                    <Button className="w-full justify-start" variant="secondary">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Gérer les utilisateurs
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}