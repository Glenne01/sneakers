'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyEuroIcon,
  ShoppingBagIcon,
  UsersIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import VendorLayout from '@/components/vendor/VendorLayout'
import { supabase } from '@/lib/supabase'

interface Metric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export default function VendorAnalyticsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // Charger les métriques d'analytics
      const [ordersResult, productsResult, usersResult] = await Promise.all([
        supabase.from('orders').select('id, total_amount, created_at'),
        supabase.from('products').select('id, name').eq('is_active', true),
        supabase.from('users').select('id').eq('role', 'customer')
      ])

      const orders = ordersResult.data || []
      const products = productsResult.data || []
      const users = usersResult.data || []

      // Calculer les métriques
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.toDateString() === today.toDateString()
      })

      const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

      const analyticsMetrics: Metric[] = [
        {
          title: 'Revenus totaux',
          value: '€0.00',
          change: '0%',
          trend: 'neutral',
          icon: CurrencyEuroIcon
        },
        {
          title: 'Commandes',
          value: '0',
          change: '0%',
          trend: 'neutral',
          icon: ShoppingBagIcon
        },
        {
          title: 'Clients actifs',
          value: '0',
          change: '0%',
          trend: 'neutral',
          icon: UsersIcon
        },
        {
          title: 'Panier moyen',
          value: '€0.00',
          change: '0%',
          trend: 'neutral',
          icon: ArrowTrendingUpIcon
        },
        {
          title: 'Taux de conversion',
          value: '0%',
          change: '0%',
          trend: 'neutral',
          icon: ArrowTrendingUpIcon
        },
        {
          title: 'Produits vus',
          value: '0',
          change: '0%',
          trend: 'neutral',
          icon: EyeIcon
        }
      ]

      // Top produits (vide pour commencer)
      const mockTopProducts: TopProduct[] = []

      setMetrics(analyticsMetrics)
      setTopProducts(mockTopProducts)
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </VendorLayout>
    )
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos performances de vente</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
                    {metric.trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                    <span>{metric.change} vs période précédente</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <metric.icon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du chiffre d'affaires</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ArrowTrendingUpIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Graphique des revenus</p>
                <p className="text-sm">À implémenter avec Chart.js</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top produits</h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€{product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des performances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">94%</p>
              <p className="text-sm text-gray-600">Satisfaction client</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">2.3j</p>
              <p className="text-sm text-gray-600">Délai moyen traitement</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">87%</p>
              <p className="text-sm text-gray-600">Commandes livrées à temps</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">1.2%</p>
              <p className="text-sm text-gray-600">Taux de retour</p>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  )
}