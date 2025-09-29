'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  productGrowth: number
  orderGrowth: number
  userGrowth: number
  revenueGrowth: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'admin') {
        setIsAuthenticated(true)
      } else {
        window.location.href = '/admin/login'
        return
      }
    }
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setStats({
          totalProducts: 100,
          totalOrders: 245,
          totalUsers: 1340,
          totalRevenue: 45230,
          productGrowth: 12,
          orderGrowth: -5,
          userGrowth: 18,
          revenueGrowth: 8
        })
        setLoading(false)
      }, 1000)
    }
  }, [isAuthenticated])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    prefix = '',
    suffix = ''
  }: {
    title: string
    value: number | string
    icon: React.ComponentType<{ className?: string }>
    growth: number
    prefix?: string
    suffix?: string
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-orange-500" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
              </div>
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growth >= 0 ? (
                  <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                )}
                <span className="ml-1">
                  {Math.abs(growth)}%
                </span>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <AdminLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="mt-2 text-sm text-gray-600">
            Vue d'ensemble de votre plateforme e-commerce
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Produits"
            value={stats?.totalProducts || 0}
            icon={CubeIcon}
            growth={stats?.productGrowth || 0}
          />
          <StatCard
            title="Commandes"
            value={stats?.totalOrders || 0}
            icon={ShoppingBagIcon}
            growth={stats?.orderGrowth || 0}
          />
          <StatCard
            title="Utilisateurs"
            value={stats?.totalUsers || 0}
            icon={UsersIcon}
            growth={stats?.userGrowth || 0}
          />
          <StatCard
            title="Chiffre d'Affaires"
            value={stats?.totalRevenue || 0}
            icon={BanknotesIcon}
            growth={stats?.revenueGrowth || 0}
            suffix="€"
          />
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Actions Rapides
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                Ajouter un produit
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Voir les commandes
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Gérer les stocks
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Voir les rapports
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Activité Récente
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { action: 'Nouvelle commande #1245', time: 'Il y a 2 minutes', type: 'order' },
                  { action: 'Produit ajouté par Vendeur A', time: 'Il y a 15 minutes', type: 'product' },
                  { action: 'Utilisateur créé', time: 'Il y a 1 heure', type: 'user' },
                  { action: 'Stock faible: Air Jordan 1', time: 'Il y a 2 heures', type: 'alert' }
                ].map((item, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index < 3 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                          <div className="h-2 w-2 rounded-full bg-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm text-gray-900">{item.action}</p>
                          <p className="text-sm text-gray-500">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}