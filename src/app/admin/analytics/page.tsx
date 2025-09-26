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
    value: '€0',
    change: '0%',
    trend: 'neutral',
    icon: CurrencyEuroIcon
  },
  {
    name: 'Commandes',
    value: 0,
    change: '0%',
    trend: 'neutral',
    icon: ShoppingBagIcon
  },
  {
    name: 'Visiteurs uniques',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: UsersIcon
  },
  {
    name: 'Taux de conversion',
    value: '0%',
    change: '0%',
    trend: 'neutral',
    icon: ChartBarIcon
  }
]

const mockChartData: ChartData[] = [
  { month: 'Jan', sales: 0, orders: 0, visitors: 0 },
  { month: 'Fév', sales: 0, orders: 0, visitors: 0 },
  { month: 'Mar', sales: 0, orders: 0, visitors: 0 },
  { month: 'Avr', sales: 0, orders: 0, visitors: 0 },
  { month: 'Mai', sales: 0, orders: 0, visitors: 0 },
  { month: 'Jun', sales: 0, orders: 0, visitors: 0 }
]

const topProducts: {name: string, sales: number, revenue: number}[] = []

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
                    ) : stat.trend === 'down' ? (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-400 rounded-full mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
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
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">📊</span>
                    </div>
                    <p className="text-gray-500 text-sm">Aucune donnée de vente disponible</p>
                    <p className="text-gray-400 text-xs mt-1">Les statistiques apparaîtront ici lorsque vous aurez des ventes</p>
                  </div>
                )}
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
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">⏱️</span>
                  </div>
                  <p className="text-gray-500 text-sm">Aucune activité récente</p>
                  <p className="text-gray-400 text-xs mt-1">L'activité de votre boutique apparaîtra ici</p>
                </div>
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
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Panier moyen</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">€0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taux de retour</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction client</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">0/5</span>
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