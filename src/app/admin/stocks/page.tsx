'use client'

import React, { useState, useEffect } from 'react'
import { StockAlert, StockMovement } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Cog6ToothIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface StockOverviewItem {
  variant_id: string
  size_id: string
  size_display: string
  product_name: string
  brand_name: string | null
  sku: string
  color: string | null
  physical_stock: number
  reserved_quantity: number
  available_quantity: number
  active_alerts: number
  last_movement_date: string | null
  updated_at: string
}

interface StockData {
  overview: StockOverviewItem[]
  alerts: StockAlert[]
  recentMovements: StockMovement[]
}

export default function AdminStocksPage() {
  const [stockData, setStockData] = useState<StockData>({
    overview: [],
    alerts: [],
    recentMovements: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'alerts' | 'movements'>('overview')
  const [adjustmentModal, setAdjustmentModal] = useState<{
    open: boolean
    variantId?: string
    sizeId?: string
    currentStock?: number
  }>({
    open: false
  })

  useEffect(() => {
    loadStockData()
  }, [])

  const loadStockData = async () => {
    try {
      setLoading(true)

      // Charger vue d'ensemble directement depuis product_stock avec relations
      const { data: overview, error: overviewError } = await supabase
        .from('product_stock')
        .select(`
          *,
          product_variants!inner(
            sku,
            color,
            products!inner(name)
          ),
          sizes!inner(id, size_display)
        `)
        .order('updated_at', { ascending: false })

      if (overviewError) throw overviewError

      // Transformer les données pour correspondre à l'interface StockOverview
      const transformedOverview = overview?.map((item: any) => ({
        variant_id: item.variant_id,
        size_id: item.size_id,
        size_display: item.sizes?.size_display,
        product_name: item.product_variants?.products?.name,
        brand_name: null,
        sku: item.product_variants?.sku,
        color: item.product_variants?.color,
        physical_stock: item.quantity,
        reserved_quantity: 0,
        available_quantity: item.quantity,
        active_alerts: 0,
        last_movement_date: item.updated_at,
        updated_at: item.updated_at
      })) || []

      // Charger alertes actives
      const { data: alerts, error: alertsError } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          product_variants!inner(
            sku,
            color,
            products!inner(name, brands(name))
          ),
          sizes!inner(size_display)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (alertsError) throw alertsError

      // Charger mouvements récents
      const { data: movements, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product_variants!inner(
            sku,
            color,
            products!inner(name)
          ),
          sizes!inner(size_display),
          users(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (movementsError) throw movementsError

      setStockData({
        overview: transformedOverview,
        alerts: alerts || [],
        recentMovements: movements || []
      })
    } catch (error) {
      console.error('Erreur chargement données stock:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleStockAdjustment = async (variantId: string, sizeId: string, newQuantity: number, reason: string) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: variantId,
          size_id: sizeId,
          new_quantity: newQuantity,
          reason
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      toast.success('Stock mis à jour avec succès')
      setAdjustmentModal({ open: false })
      loadStockData()
    } catch (error) {
      console.error('Erreur ajustement stock:', error)
      toast.error('Erreur lors de l\'ajustement')
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/stock/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId })
      })

      if (!response.ok) throw new Error('Erreur résolution alerte')

      toast.success('Alerte résolue')
      loadStockData()
    } catch (error) {
      console.error('Erreur résolution alerte:', error)
      toast.error('Erreur lors de la résolution')
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'out_of_stock':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      case 'low_stock':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'overstocked':
        return <ArrowUpIcon className="w-5 h-5 text-blue-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />
      case 'out':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />
      case 'adjustment':
        return <Cog6ToothIcon className="w-4 h-4 text-blue-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
        <p className="text-gray-600">Monitoring et gestion avancée des stocks</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produits</p>
              <p className="text-2xl font-bold text-gray-900">{stockData.overview.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
              <p className="text-2xl font-bold text-gray-900">{stockData.alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock Faible</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockData.alerts.filter(a => a.alert_type === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ruptures</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockData.alerts.filter(a => a.alert_type === 'out_of_stock').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vue d\'ensemble', count: stockData.overview.length },
            { id: 'alerts', name: 'Alertes', count: stockData.alerts.length },
            { id: 'movements', name: 'Mouvements', count: stockData.recentMovements.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {selectedTab === 'overview' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Stock Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Physique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alertes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData.overview.map((item) => (
                  <tr key={`${item.variant_id}-${item.size_display}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                        <div className="text-sm text-gray-500">{item.sku} - {item.color}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.size_display}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.physical_stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.reserved_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        item.available_quantity <= 0 ? 'text-red-600' :
                        item.available_quantity <= 5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.available_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.active_alerts > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.active_alerts} alerte{item.active_alerts > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setAdjustmentModal({
                          open: true,
                          variantId: item.variant_id,
                          sizeId: item.size_id,
                          currentStock: item.physical_stock
                        })}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ajuster
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          {stockData.alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getAlertIcon(alert.alert_type)}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {alert.alert_type === 'out_of_stock' ? 'Rupture de stock' :
                       alert.alert_type === 'low_stock' ? 'Stock faible' : 'Surstock'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {alert.product_variants?.products?.name} - {alert.product_variants?.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      Taille: {alert.sizes?.size_display} | Stock actuel: {alert.current_stock} | Seuil: {alert.threshold_value}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Résoudre
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'movements' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mouvements Récents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Avant/Après
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raison
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData.recentMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMovementIcon(movement.movement_type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {movement.movement_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {movement.product_variants?.products?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {movement.product_variants?.sku} - Taille {movement.sizes?.size_display}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        movement.quantity_change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.quantity_change > 0 ? '+' : ''}{movement.quantity_change}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.quantity_before} → {movement.quantity_after}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.reason || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(movement.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'ajustement de stock */}
      {adjustmentModal.open && (
        <StockAdjustmentModal
          isOpen={adjustmentModal.open}
          onClose={() => setAdjustmentModal({ open: false })}
          variantId={adjustmentModal.variantId!}
          sizeId={adjustmentModal.sizeId!}
          currentStock={adjustmentModal.currentStock!}
          onAdjust={handleStockAdjustment}
        />
      )}
    </div>
  )
}

// Modal pour ajustement de stock
function StockAdjustmentModal({
  isOpen,
  onClose,
  variantId,
  sizeId,
  currentStock,
  onAdjust
}: {
  isOpen: boolean
  onClose: () => void
  variantId: string
  sizeId: string
  currentStock: number
  onAdjust: (variantId: string, sizeId: string, newQuantity: number, reason: string) => void
}) {
  const [newQuantity, setNewQuantity] = useState(currentStock)
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ajuster le Stock</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock actuel: {currentStock}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nouvelle quantité
            </label>
            <input
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Raison
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={() => onAdjust(variantId, sizeId, newQuantity, reason)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Ajuster
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}