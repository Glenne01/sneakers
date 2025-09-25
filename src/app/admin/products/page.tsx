'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { useAdminStore } from '@/stores/adminStore'
import { usePermissions } from '@/hooks/usePermissions'

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
  brand: string
  category: string
  isActive: boolean
  variants: {
    id: string
    sku: string
    color: string
    price: number
    imageUrl: string
    stock: number
  }[]
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handball Spezial Shoes',
    description: 'Chaussure de handball iconique revisitée pour la rue.',
    basePrice: 105,
    gender: 'homme',
    brand: 'Adidas',
    category: 'Sneakers',
    isActive: true,
    variants: [
      {
        id: 'v1',
        sku: 'HANDBALL-SPEZIAL-001',
        color: 'Bleu/Blanc',
        price: 105,
        imageUrl: 'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08c7c0fc4ae84932864226ad74075e6e_9366/handball-spezial-shoes.jpg',
        stock: 45
      }
    ],
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Samba OG Shoes',
    description: 'La légendaire Samba dans sa version originale.',
    basePrice: 115,
    gender: 'homme',
    brand: 'Adidas',
    category: 'Sneakers',
    isActive: true,
    variants: [
      {
        id: 'v2',
        sku: 'SAMBA-OG-001',
        color: 'Noir/Blanc',
        price: 115,
        imageUrl: 'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/49d73d8eaccb48ee89ee3feb82ce098c_9366/samba-og-shoes.jpg',
        stock: 32
      }
    ],
    createdAt: '2024-01-12T14:30:00Z'
  }
]

export default function ProductsPage() {
  const { user } = useAdminStore()
  const { hasPermission } = usePermissions(user?.role || 'user')
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const canCreate = hasPermission('products', 'create')
  const canUpdate = hasPermission('products', 'update')
  const canDelete = hasPermission('products', 'delete')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleProductStatus = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, isActive: !product.isActive } : product
    ))
  }

  const deleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
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
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
            <p className="text-gray-600 mt-1">{filteredProducts.length} produits trouvés</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowCreateForm(true)} className="mt-4 sm:mt-0">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouveau produit
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, marque ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.variants[0]?.imageUrl || '/placeholder-sneaker.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.category}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">€{product.basePrice}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Stock: {product.variants.reduce((sum, v) => sum + v.stock, 0)}</span>
                  <span className="capitalize">{product.gender}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  
                  {canUpdate && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleProductStatus(product.id)}
                      className="px-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedProduct(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={selectedProduct.variants[0]?.imageUrl || '/placeholder-sneaker.jpg'}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Informations générales</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Marque:</span> {selectedProduct.brand}</p>
                          <p><span className="font-medium">Catégorie:</span> {selectedProduct.category}</p>
                          <p><span className="font-medium">Genre:</span> {selectedProduct.gender}</p>
                          <p><span className="font-medium">Prix de base:</span> €{selectedProduct.basePrice}</p>
                          <p><span className="font-medium">Créé le:</span> {formatDate(selectedProduct.createdAt)}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Variantes</h3>
                        <div className="space-y-2">
                          {selectedProduct.variants.map(variant => (
                            <div key={variant.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-sm">{variant.sku}</p>
                                  <p className="text-sm text-gray-600">{variant.color}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">€{variant.price}</p>
                                  <p className="text-sm text-gray-600">Stock: {variant.stock}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <Button onClick={() => setSelectedProduct(null)} variant="secondary">
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Nouveau produit</h2>
                </div>

                <div className="p-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Nom du produit"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (€)</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Description du produit"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>Adidas</option>
                          <option>Nike</option>
                          <option>Puma</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>Sneakers</option>
                          <option>Running</option>
                          <option>Basketball</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                          <option value="enfant">Enfant</option>
                          <option value="unisexe">Unisexe</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                  <Button onClick={() => setShowCreateForm(false)} variant="secondary">
                    Annuler
                  </Button>
                  <Button>
                    Créer le produit
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