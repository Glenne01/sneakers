'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import VendorLayout from '@/components/vendor/VendorLayout'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface StockItem {
  id: string
  productName: string
  brand: string
  size: string
  color: string
  price: number
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  status: 'low' | 'normal' | 'high' | 'out'
  imageUrl: string
}

export default function VendorStockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [stockUpdate, setStockUpdate] = useState('')

  useEffect(() => {
    loadStock()
  }, [])

  const loadStock = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products (name, brands (name), base_price)
        `)
        .eq('is_active', true)
        .order('sku', { ascending: true })

      if (error) throw error

      const mappedStock: StockItem[] = (data || []).map(variant => {
        // Pour l'instant, on simule un stock car il n'y a pas de colonne stock_quantity
        const currentStock = Math.floor(Math.random() * 50) // Stock simulé entre 0 et 50
        const minStock = 10 // Seuil minimum par défaut
        const maxStock = 100 // Seuil maximum par défaut

        let status: 'low' | 'normal' | 'high' | 'out'
        if (currentStock === 0) status = 'out'
        else if (currentStock <= minStock) status = 'low'
        else if (currentStock >= maxStock) status = 'high'
        else status = 'normal'

        // Extraire la taille du SKU (ex: SAMBA-OG-F-36 -> 36)
        const sizeMatch = variant.sku?.match(/-(\d+)$/)
        const extractedSize = sizeMatch ? sizeMatch[1] : 'N/A'

        return {
          id: variant.id,
          productName: variant.products?.name || 'Produit inconnu',
          brand: variant.products?.brands?.name || 'Marque inconnue',
          size: extractedSize,
          color: variant.color || 'Couleur standard',
          price: parseFloat(variant.price) || parseFloat(variant.products?.base_price) || 0,
          sku: variant.sku || 'N/A',
          currentStock,
          minStock,
          maxStock,
          status,
          imageUrl: variant.image_url || '/placeholder-sneaker.jpg'
        }
      })

      setStockItems(mappedStock)
    } catch (error) {
      console.error('Erreur lors du chargement du stock:', error)
      toast.error('Erreur lors du chargement du stock')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = stockItems.filter(item => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStock = async (itemId: string, newQuantity: number) => {
    try {
      // Pour l'instant, on simule la mise à jour car il n'y a pas de colonne stock_quantity
      // Dans une vraie application, vous devrez ajouter une colonne stock_quantity à la table product_variants

      // Simulation: mettre à jour localement
      setStockItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, currentStock: Math.max(0, newQuantity) }
          : item
      ))

      toast.success('Stock mis à jour avec succès (simulation)')
      setSelectedItem(null)
      setStockUpdate('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error)
      toast.error('Erreur lors de la mise à jour du stock')
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      out: { label: 'Rupture', className: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
      low: { label: 'Stock faible', className: 'bg-orange-100 text-orange-800', icon: ExclamationTriangleIcon },
      normal: { label: 'Normal', className: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      high: { label: 'Stock élevé', className: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon }
    }
    return configs[status as keyof typeof configs] || configs.normal
  }

  const getStockStats = () => {
    const outOfStock = stockItems.filter(item => item.status === 'out').length
    const lowStock = stockItems.filter(item => item.status === 'low').length
    const totalValue = stockItems.reduce((sum, item) => sum + (item.currentStock * 100), 0) // Estimation à 100€ par article

    return { outOfStock, lowStock, totalValue }
  }

  const stats = getStockStats()

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des stocks</h1>
            <p className="text-gray-600 mt-1">{filteredItems.length} références en stock</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ruptures de stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur totale</p>
                <p className="text-2xl font-bold text-green-600">€{stats.totalValue.toLocaleString()}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par produit, marque, taille..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="out">Rupture de stock</option>
                <option value="low">Stock faible</option>
                <option value="normal">Stock normal</option>
                <option value="high">Stock élevé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                      <p className="text-gray-500 mt-2">Chargement du stock...</p>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                      <p className="text-gray-500">Modifiez vos filtres de recherche.</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const statusConfig = getStatusConfig(item.status)
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-sneaker.jpg'
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.productName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.brand} • {item.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Taille {item.size}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.color}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            €{item.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.currentStock} unités
                          </div>
                          <div className="text-xs text-gray-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <statusConfig.icon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateStock(item.id, item.currentStock + 1)}
                              className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              title="Ajouter 1"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 1))}
                              className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              title="Retirer 1"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-orange-600 hover:text-orange-900 text-xs"
                            >
                              Modifier
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Update Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedItem(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-md w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Modifier le stock
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedItem.productName} - {selectedItem.size} - {selectedItem.color}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock actuel: {selectedItem.currentStock} unités
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Nouvelle quantité"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateStock(selectedItem.id, selectedItem.currentStock + 10)}
                      className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      +10
                    </button>
                    <button
                      onClick={() => updateStock(selectedItem.id, Math.max(0, selectedItem.currentStock - 10))}
                      className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      <MinusIcon className="h-4 w-4 mr-1" />
                      -10
                    </button>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-between">
                  <Button onClick={() => setSelectedItem(null)} variant="secondary">
                    Annuler
                  </Button>
                  <Button
                    onClick={() => updateStock(selectedItem.id, parseInt(stockUpdate) || selectedItem.currentStock)}
                    disabled={!stockUpdate}
                  >
                    Mettre à jour
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  )
}