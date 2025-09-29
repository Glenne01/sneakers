'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/stores/adminStore'
import { getProducts, ProductWithVariants } from '@/lib/products'
import { supabase } from '@/lib/supabase'

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'vendors'

export default function AdminDashboard() {
  const { user, logout } = useAdminStore()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({})
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    usersCount: 0,
    revenue: 0
  })

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'dashboard') {
      loadStats()
    }
  }, [activeTab])

  const loadProducts = async () => {
    setLoadingProducts(true)
    const data = await getProducts()
    setProducts(data)
    setLoadingProducts(false)
  }

  const loadStats = async () => {
    try {
      // Compter les produits
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Compter les commandes
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Compter les utilisateurs
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Calculer le CA
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered')

      const revenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0

      setStats({
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        usersCount: usersCount || 0,
        revenue: Math.round(revenue)
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const updateStock = async (stockId: string, variantId: string, sizeId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('product_stock')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', stockId)

      if (error) {
        console.error('Erreur mise à jour stock:', error)
        alert('Erreur lors de la mise à jour du stock')
        return
      }

      // Recharger les produits pour afficher la mise à jour
      await loadProducts()

      // Supprimer de l'état d'édition
      const key = `${variantId}-${sizeId}`
      setEditingStock((prev) => {
        const newState = { ...prev }
        delete newState[key]
        return newState
      })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour du stock')
    }
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tableau de bord', icon: '📊' },
    { id: 'products' as Tab, label: 'Produits', icon: '👟' },
    { id: 'orders' as Tab, label: 'Commandes', icon: '📦' },
    { id: 'users' as Tab, label: 'Utilisateurs', icon: '👥' },
    { id: 'vendors' as Tab, label: 'Vendeurs', icon: '🏪' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">Bienvenue, {user?.firstName}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Produits</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.productsCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.ordersCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Utilisateurs</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.usersCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.revenue}€</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
              <p className="text-gray-500">Aucune activité pour le moment</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gestion des produits</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Ajouter un produit
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : products.length === 0 ? (
                <p className="text-gray-500">Aucun produit pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Product Header */}
                      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          {product.variants[0]?.image_url && (
                            <img
                              src={product.variants[0].image_url}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover mr-4"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              {product.brand?.name} • {product.category?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <button className="text-orange-600 hover:text-orange-900 mr-3">Modifier</button>
                          <button className="text-red-600 hover:text-red-900">Supprimer</button>
                        </div>
                      </div>

                      {/* Variants Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Couleur</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {product.variants.map((variant: any) => {
                              const stocks = variant.product_stock || []

                              // Si pas de stock, afficher une ligne avec le variant sans taille
                              if (stocks.length === 0) {
                                return (
                                  <tr key={variant.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                      {variant.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {variant.color}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {variant.price}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      -
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        0 unité
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        variant.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {variant.is_active ? 'Actif' : 'Inactif'}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              }

                              // Afficher une ligne par taille
                              return stocks.map((stockItem: any, index: number) => {
                                const editKey = `${variant.id}-${stockItem.size?.id}`
                                const isEditing = editKey in editingStock
                                const currentStock = isEditing ? editingStock[editKey] : stockItem.quantity

                                return (
                                  <tr key={`${variant.id}-${stockItem.size?.id || index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                      {variant.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {variant.color}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {variant.price}€
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                      {stockItem.size?.size_value || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {isEditing ? (
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="number"
                                            min="0"
                                            value={currentStock}
                                            onChange={(e) => {
                                              const value = parseInt(e.target.value) || 0
                                              setEditingStock((prev) => ({
                                                ...prev,
                                                [editKey]: value
                                              }))
                                            }}
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                          />
                                          <button
                                            onClick={() => updateStock(stockItem.id, variant.id, stockItem.size?.id, currentStock)}
                                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                                          >
                                            ✓
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingStock((prev) => {
                                                const newState = { ...prev }
                                                delete newState[editKey]
                                                return newState
                                              })
                                            }}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            (stockItem.quantity || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                          }`}>
                                            {stockItem.quantity || 0} unité{(stockItem.quantity || 0) > 1 ? 's' : ''}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setEditingStock((prev) => ({
                                                ...prev,
                                                [editKey]: stockItem.quantity || 0
                                              }))
                                            }}
                                            className="text-orange-600 hover:text-orange-900 text-xs font-medium"
                                          >
                                            Modifier
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        variant.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {variant.is_active ? 'Actif' : 'Inactif'}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              })
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gestion des commandes</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Aucune commande pour le moment</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Aucun utilisateur pour le moment</p>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gestion des vendeurs</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  Ajouter un vendeur
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Aucun vendeur pour le moment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}