'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  HeartIcon,
  ChevronLeftIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { getProductBySlug, ProductWithVariants } from '@/lib/products'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/types/database'

interface Size {
  id: string
  size_value: string
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { addItem } = useCartStore()
  
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string>('')
  const [sizes, setSizes] = useState<Size[]>([])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductBySlug(slug)
        console.log('🎯 Produit récupéré:', productData)
        setProduct(productData)

        if (productData) {
          console.log('✅ ProductData existe, ID:', productData.id)
          // Charger les tailles et le stock depuis Supabase
          console.log('🔄 Chargement du stock pour le produit ID:', productData.id)
          const response = await fetch('/api/product-stock/' + productData.id)
          console.log('📡 Réponse API stock:', response.status, response.statusText)

          if (response.ok) {
            const stockData = await response.json()
            console.log('✅ Données de stock reçues:', stockData)
            setSizes(stockData)
          } else {
            console.error('❌ Erreur API stock:', response.status, await response.text())
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
        setError('Produit non trouvé')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadProduct()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Veuillez sélectionner une taille')
      return
    }
    
    const selectedSizeData = sizes.find(s => s.id === selectedSize)
    if (!selectedSizeData || selectedSizeData.stock < quantity) {
      setError('Stock insuffisant pour cette taille')
      return
    }

    if (!product || !product.variants[0]) {
      setError('Erreur produit')
      return
    }

    // Ajouter au panier
    const cartItem = {
      variant: {
        id: product.variants[0].id,
        sku: product.variants[0].sku,
        color: product.variants[0].color,
        price: product.variants[0].price,
        image_url: product.variants[0].image_url,
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand
        }
      },
      size: {
        id: selectedSizeData.id,
        size_value: selectedSizeData.size_value
      },
      quantity
    }

    addItem(cartItem as unknown as CartItem)
    setError('')
    
    // Reset selection
    setSelectedSize('')
    setQuantity(1)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Redirection vers checkout
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link href="/sneakers">
            <Button>Retour aux sneakers</Button>
          </Link>
        </div>
      </div>
    )
  }

  const variant = product.variants[0]
  const price = variant?.price || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link href="/sneakers" className="text-gray-500 hover:text-gray-700">Sneakers</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-soft"
            >
              <Image
                src={variant?.image_url || '/placeholder-sneaker.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <HeartIcon className="h-5 w-5 text-gray-600" />
              </button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Back Button */}
              <Link 
                href="/sneakers" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Retour aux sneakers
              </Link>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm font-medium text-orange-500 mb-2">
                  {product.brand.name}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(127 avis)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {price}€
                </span>
                <span className="text-sm text-gray-500 ml-2">TTC</span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Taille</h3>
                  <Link href="/guide-tailles" className="text-sm text-orange-500 hover:text-orange-600">
                    Guide des tailles
                  </Link>
                </div>
                {console.log('🔍 État actuel des tailles:', sizes, 'Longueur:', sizes.length)}
                <div className="grid grid-cols-3 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      disabled={size.stock === 0}
                      className={`p-4 rounded-lg border transition-all duration-200 relative ${
                        selectedSize === size.id
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : size.stock === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{size.size_value}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {size.stock > 0 ? `${size.stock} en stock` : 'Rupture'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {sizes.length === 0 && (
                  <p className="text-sm text-gray-500">Chargement des tailles...</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleBuyNow}
                >
                  Acheter maintenant
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Livraison gratuite</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Retours 30 jours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Authentique</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}