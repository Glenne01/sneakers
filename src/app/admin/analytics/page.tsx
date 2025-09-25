'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  CurrencyEuroIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore } from '@/stores/adminStore'

interface Stat {
  name: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
}

interface ChartData {
  month: string
  sales: number
  orders: number
  visitors: number
}

const mockStats: Stat[] = [
  {
    name: 'Chiffre d\'affaires',
    value: '€45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: CurrencyEuroIcon
  },
  {
    name: 'Commandes',
    value: 1247,
    change: '+15.3%',
    trend: 'up',
    icon: ShoppingBagIcon
  },
  {
    name: 'Visiteurs uniques',
    value: '12,234',
    change: '-2.4%',
    trend: 'down',
    icon: UsersIcon
  },
  {
    name: 'Taux de conversion',
    value: '3.24%',
    change: '+1.2%',
    trend: 'up',
    icon: ChartBarIcon
  }
]

const mockChartData: ChartData[] = [
  { month: 'Jan', sales: 12000, orders: 120, visitors: 4500 },
  { month: 'Fév', sales: 15000, orders: 150, visitors: 5200 },
  { month: 'Mar', sales: 18000, orders: 180, visitors: 5800 },
  { month: 'Avr', sales: 22000, orders: 220, visitors: 6100 },
  { month: 'Mai', sales: 25000, orders: 250, visitors: 6500 },
  { month: 'Jun', sales: 28000, orders: 280, visitors: 7200 }
]

const topProducts = [
  { name: 'Handball Spezial Shoes', sales: 145, revenue: 15225 },
  { name: 'Samba OG Shoes', sales: 132, revenue: 15180 },
  { name: 'Stan Smith', sales: 98, revenue: 9800 },
  { name: 'Gazelle', sales: 87, revenue: 8700 },
  { name: 'Forum Low', sales: 76, revenue: 8360 }
]

export default function AnalyticsPage() {
  const { user } = useAdminStore()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  const isAdmin = user?.role === 'admin'

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Aperçu des performances {isAdmin ? 'globales' : 'de vos ventes'}
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">12 derniers mois</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <stat.icon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Évolution des ventes</h3>
            </div>
            <div className="p-6">
              <div className="h-80 flex items-end justify-between space-x-2">
                {mockChartData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-orange-500 rounded-t-md transition-all duration-300 hover:bg-orange-600"
                      style={{ 
                        height: `${(data.sales / 30000) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <div className="mt-2 text-sm text-gray-600">{data.month}</div>
                    <div className="text-xs text-gray-500">€{(data.sales / 1000).toFixed(0)}k</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produits les plus vendus</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">€{product.revenue.toLocaleString()}</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(product.sales / 150) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { type: 'order', message: 'Nouvelle commande #SNK-003', time: '5 min', color: 'green' },
                  { type: 'user', message: 'Nouvel utilisateur inscrit', time: '12 min', color: 'blue' },
                  { type: 'product', message: 'Stock faible: Samba OG', time: '1h', color: 'orange' },
                  { type: 'order', message: 'Commande #SNK-002 expédiée', time: '2h', color: 'purple' },
                  { type: 'review', message: 'Nouvel avis 5 étoiles', time: '3h', color: 'yellow' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Métriques de performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux de conversion</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">3.24%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Panier moyen</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">€156.80</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux de retour</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">2.1%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction client</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">4.5/5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-soft p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Export des données</h3>
              <p className="text-sm text-gray-600">Téléchargez vos rapports d&apos;analyse</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Rapport PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}