'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { ORDER_STATUSES } from '@/types/admin'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  items: {
    name: string
    quantity: number
    price: number
  }[]
  total: number
  status: string
  createdAt: string
  shippingAddress: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Charger les commandes depuis la base de données
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users!orders_user_id_fkey (
            first_name,
            last_name,
            email
          ),
          order_items (
            *,
            product_variants (
              product_name: products!product_variants_product_id_fkey (name)
            ),
            sizes (size_display)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Mapper les données de la base vers le format Order
      const mappedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        orderNumber: order.order_number || '',
        customer: {
          name: `${order.users?.first_name || ''} ${order.users?.last_name || ''}`.trim() || 'Anonyme',
          email: order.users?.email || ''
        },
        items: (order.order_items || []).map((item: any) => ({
          name: item.product_variants?.product_name?.[0]?.name || item.product_name || '',
          quantity: item.quantity || 1,
          price: parseFloat(item.unit_price) || 0
        })),
        total: parseFloat(order.total_amount) || 0,
        status: order.status || 'pending',
        createdAt: order.created_at || new Date().toISOString(),
        shippingAddress: typeof order.shipping_address === 'object' && order.shipping_address
          ? `${order.shipping_address.address || ''}, ${order.shipping_address.city || ''} ${order.shipping_address.postal_code || ''}`
          : 'Adresse non disponible'
      }))

      setOrders(mappedOrders)
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusConfig = (status: string) => {
    const config = ORDER_STATUSES.find(s => s.id === status) || ORDER_STATUSES[0]
    const colorClasses: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    }
    return { ...config, className: colorClasses[config.color] }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      toast.success('Statut de commande mis à jour avec succès')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      try {
        // Supprimer d'abord les articles de la commande
        const { error: itemsError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId)

        if (itemsError) throw itemsError

        // Supprimer les paiements
        const { error: paymentsError } = await supabase
          .from('payments')
          .delete()
          .eq('order_id', orderId)

        if (paymentsError) throw paymentsError

        // Supprimer la commande
        const { error: orderError } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId)

        if (orderError) throw orderError

        setOrders(prev => prev.filter(order => order.id !== orderId))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null)
        }
        toast.success('Commande supprimée avec succès')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression de la commande')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
            <p className="text-gray-600 mt-1">{filteredOrders.length} commandes trouvées</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro, nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tous les statuts</option>
                {ORDER_STATUSES.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                      <p className="text-gray-500 mt-2">Chargement des commandes...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">📦</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Essayez de modifier vos filtres de recherche.'
                          : 'Les nouvelles commandes apparaîtront ici automatiquement.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status)
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            €{order.total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.className}`}>
                            {statusConfig.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-orange-600 hover:text-orange-900 inline-flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Voir
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Modifier
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Supprimer
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedOrder(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Détails de la commande {selectedOrder.orderNumber}
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informations client</h3>
                    <div className="text-sm text-gray-600">
                      <p>{selectedOrder.customer.name}</p>
                      <p>{selectedOrder.customer.email}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Adresse de livraison</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Articles commandés</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>€{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Changer le statut</h3>
                    <div className="flex flex-wrap gap-2">
                      {ORDER_STATUSES.map(status => (
                        <button
                          key={status.id}
                          onClick={() => {
                            updateOrderStatus(selectedOrder.id, status.id)
                            setSelectedOrder({ ...selectedOrder, status: status.id })
                          }}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            selectedOrder.status === status.id
                              ? getStatusConfig(status.id).className
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <Button onClick={() => setSelectedOrder(null)} variant="secondary">
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}