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
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [loadingVendors, setLoadingVendors] = useState(false)
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
    } else if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'orders') {
      loadOrders()
    } else if (activeTab === 'vendors') {
      loadVendors()
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
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')

      console.log('Orders data:', ordersData, 'Error:', ordersError)

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
        ordersCount: ordersData?.length || 0,
        usersCount: usersCount || 0,
        revenue: Math.round(revenue)
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur chargement utilisateurs:', error)
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadOrders = async () => {
    setLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('Orders loaded:', data, 'Error:', error)

      if (error) {
        console.error('Erreur chargement commandes:', error)
        setOrders([])
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error('Erreur:', error)
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const loadVendors = async () => {
    setLoadingVendors(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'vendor')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur chargement vendeurs:', error)
        return
      }

      setVendors(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoadingVendors(false)
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
              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div>
                  <p className="text-gray-500">Aucune commande visible</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Note : Les commandes peuvent être bloquées par les politiques de sécurité (RLS).
                    Vérifiez les permissions dans Supabase.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{order.shipping_address?.city}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'pending' ? 'En attente' :
                               order.status === 'confirmed' ? 'Confirmée' :
                               order.status === 'processing' ? 'En traitement' :
                               order.status === 'shipped' ? 'Expédiée' :
                               order.status === 'delivered' ? 'Livrée' :
                               'Annulée'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {parseFloat(order.total_amount).toFixed(2)}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h2>
            </div>
            <div className="p-6">
              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-500">Aucun utilisateur pour le moment</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'vendor' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' ? 'Administrateur' :
                               user.role === 'vendor' ? 'Vendeur' :
                               'Client'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
              {loadingVendors ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : vendors.length === 0 ? (
                <p className="text-gray-500">Aucun vendeur pour le moment</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vendors.map((vendor) => (
                        <tr key={vendor.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.first_name} {vendor.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vendor.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{vendor.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {vendor.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(vendor.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-3">Modifier</button>
                            <button className="text-red-600 hover:text-red-900">Désactiver</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}