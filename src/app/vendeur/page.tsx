'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingBagIcon,
  CubeIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import VendorLayout from '@/components/vendor/VendorLayout'
import { supabase } from '@/lib/supabase'

interface StatCard {
  title: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVendorStats()
  }, [])

  const loadVendorStats = async () => {
    try {
      // Charger les statistiques spécifiques au vendeur
      const [ordersResult, productsResult] = await Promise.all([
        supabase.from('orders').select('id, total_amount'),
        supabase.from('products').select('id').eq('is_active', true)
      ])

      const ordersCount = ordersResult.data?.length || 0
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0
      const productsCount = productsResult.data?.length || 0

      const vendorStats: StatCard[] = [
        {
          title: 'Commandes aujourd\'hui',
          value: 0,
          change: '0%',
          trend: 'neutral',
          icon: ShoppingBagIcon,
          color: 'blue'
        },
        {
          title: 'Chiffre d\'affaires',
          value: '€0.00',
          change: '0%',
          trend: 'neutral',
          icon: CurrencyEuroIcon,
          color: 'green'
        },
        {
          title: 'Produits actifs',
          value: productsCount,
          change: '0',
          trend: 'neutral',
          icon: CubeIcon,
          color: 'orange'
        },
        {
          title: 'Taux de conversion',
          value: '0%',
          change: '0%',
          trend: 'neutral',
          icon: ArrowTrendingUpIcon,
          color: 'purple'
        }
      ]

      setStats(vendorStats)
    } catch (error) {
      console.error('Erreur lors du chargement des stats vendeur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    }
    return colorMap[color] || 'bg-gray-500'
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Vendeur</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos ventes et produits</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <span>{stat.change} vs hier</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/vendeur/commandes"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Gérer les commandes</h3>
                <p className="text-sm text-gray-500">Traiter les nouvelles commandes</p>
              </div>
            </Link>

            <Link
              href="/vendeur/stocks"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <CubeIcon className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Gérer les stocks</h3>
                <p className="text-sm text-gray-500">Gérer les stocks des produits</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-soft p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Bienvenue dans votre espace vendeur !</h2>
          <p className="text-orange-100">
            Vous avez accès aux outils essentiels pour gérer vos commandes et stocks.
          </p>
        </div>
      </div>
    </VendorLayout>
  )
}