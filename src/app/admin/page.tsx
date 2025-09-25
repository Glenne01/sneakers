'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

  useEffect(() => {
    // Mock stats - à remplacer par de vraies données
    const mockStats: StatCard[] = [
      {
        title: 'Commandes totales',
        value: 1247,
        change: '+12.5%',
        trend: 'up',
        icon: ShoppingBagIcon,
        color: 'bg-blue-500'
      },
      {
        title: 'Revenus',
        value: '€24,567',
        change: '+8.2%',
        trend: 'up',
        icon: CurrencyEuroIcon,
        color: 'bg-green-500'
      },
      {
        title: 'Utilisateurs',
        value: 892,
        change: '+3.1%',
        trend: 'up',
        icon: UsersIcon,
        color: 'bg-purple-500'
      },
      {
        title: 'Produits',
        value: 156,
        change: '+5.7%',
        trend: 'up',
        icon: CubeIcon,
        color: 'bg-orange-500'
      }
    ]

    // Filtrer les stats selon les permissions
    const filteredStats = mockStats.filter(stat => {
      if (stat.title.includes('Commandes') && !canAccess('orders')) return false
      if (stat.title.includes('Utilisateurs') && !canAccess('users')) return false
      if (stat.title.includes('Produits') && !canAccess('products')) return false
      return true
    })

    setStats(filteredStats)
  }, [canAccess])

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

  const recentOrders = [
    { id: '#1234', customer: 'Jean Dupont', amount: '€129.99', status: 'delivered', time: '2h' },
    { id: '#1235', customer: 'Marie Martin', amount: '€89.99', status: 'processing', time: '5h' },
    { id: '#1236', customer: 'Pierre Durand', amount: '€199.99', status: 'shipped', time: '1d' }
  ]

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
                  {recentOrders.map((order) => (
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
                  ))}
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
                  <Button className="w-full justify-start" variant="secondary">
                    <CubeIcon className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                )}
                {canAccess('orders') && (
                  <Button className="w-full justify-start" variant="secondary">
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    Voir les commandes
                  </Button>
                )}
                {canAccess('users') && (
                  <Button className="w-full justify-start" variant="secondary">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Gérer les utilisateurs
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}