'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import VendorLayout from '@/components/vendor/VendorLayout'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  gender: string
  isActive: boolean
  createdAt: string
  imageUrl?: string
  brand?: {
    name: string
  }
  category?: {
    name: string
  }
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brands (name),
          categories (name),
          product_variants!inner (image_url)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      const mappedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        basePrice: parseFloat(product.base_price) || 0,
        gender: product.gender || '',
        isActive: product.is_active ?? true,
        createdAt: product.created_at || new Date().toISOString(),
        imageUrl: product.product_variants?.[0]?.image_url || '/placeholder-sneaker.jpg',
        brand: product.brands ? { name: product.brands.name } : undefined,
        category: product.categories ? { name: product.categories.name } : undefined
      }))

      setProducts(mappedProducts)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleProductStatus = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return

      const newStatus = !product.isActive

      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', productId)

      if (error) throw error

      setProducts(prev => prev.map(product =>
        product.id === productId ? { ...product, isActive: newStatus } : product
      ))

      toast.success(`Produit ${newStatus ? 'activé' : 'désactivé'} avec succès`)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const createProduct = async (formData: FormData) => {
    try {
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const basePrice = parseFloat(formData.get('basePrice') as string)
      const gender = formData.get('gender') as string

      if (!name || !description || !basePrice || !gender) {
        toast.error('Veuillez remplir tous les champs obligatoires')
        return
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          description,
          base_price: basePrice,
          gender,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Produit créé avec succès')
      setShowCreateForm(false)
      loadProducts()
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error)
      toast.error('Erreur lors de la création du produit')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
            <p className="text-gray-600 mt-1">{filteredProducts.length} produits trouvés</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="mt-4 sm:mt-0">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau produit
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-soft p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Essayez de modifier votre recherche.'
                  : 'Cliquez sur "Nouveau produit" pour ajouter le premier produit.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-sneaker.jpg'
                    }}
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">€{product.basePrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 capitalize">{product.gender}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <span>{product.brand?.name || 'Aucune marque'}</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs text-orange-600 hover:text-orange-900 transition-colors">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      Voir
                    </button>
                    <button className="flex-1 flex items-center justify-center px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className="flex-1 flex items-center justify-center px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {product.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Create Product Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateForm(false)} />
              <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Nouveau produit
                  </h2>
                </div>

                <form
                  action={createProduct}
                  className="p-6 space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Ex: Nike Air Max 270"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Description détaillée du produit..."
                    />
                  </div>

                  <div>
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix de base (€) *
                    </label>
                    <input
                      type="number"
                      id="basePrice"
                      name="basePrice"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="149.99"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Genre *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Sélectionner un genre</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                      <option value="enfant">Enfant</option>
                      <option value="unisexe">Unisexe</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      variant="secondary"
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      Créer le produit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </VendorLayout>
  )
}