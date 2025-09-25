'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeartIcon, EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Product, ProductVariant } from '@/types/database'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  variant: ProductVariant
  className?: string
  showQuickAdd?: boolean
}

const ProductCard = ({ product, variant, className = '', showQuickAdd = true }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris',
      { icon: isWishlisted ? '💔' : '❤️' }
    )
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Open quick view modal
    console.log('Quick view:', product.name)
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Open size selector or add to cart
    toast.success('Produit ajouté au panier !', { icon: '🛍️' })
  }

  // Create product URL slug
  const productSlug = `${product.name?.toLowerCase().replace(/\s+/g, '-')}-${variant.sku}`.toLowerCase()

  return (
    <motion.div
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/produit/${productSlug}`} className="block">
        <div className="card overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            
            {/* Product Status Badge */}
            {product.brand?.name && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                  {product.brand.name}
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
              )}
            </button>

            {/* Product Image */}
            {!imageError && variant.image_url ? (
              <>
                <Image
                  src={variant.image_url}
                  alt={product.name}
                  fill
                  className={`object-cover object-center transition-all duration-500 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Hover Image (if available) */}
                {variant.hover_image_url && (
                  <Image
                    src={variant.hover_image_url}
                    alt={`${product.name} - Vue alternative`}
                    fill
                    className={`object-cover object-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-2xl">👟</span>
                  </div>
                  <span className="text-gray-500 text-sm">Image non disponible</span>
                </div>
              </div>
            )}

            {/* Quick Action Overlay */}
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center space-x-2 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {showQuickAdd && (
                <>
                  <Button
                    size="sm"
                    onClick={handleQuickView}
                    className="bg-white/90 text-black hover:bg-white border-0"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleQuickAdd}
                    className="bg-orange-500/90 hover:bg-orange-600"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            {/* Category & Gender */}
            {product.category?.name && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {product.category.name}
                </span>
                <span className="text-xs text-orange-500 font-medium capitalize">
                  {product.gender}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>

            {/* Color Variant */}
            {variant.color && (
              <p className="text-sm text-gray-600">
                {variant.color}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(variant.price)}
                </span>
                {parseFloat(variant.price.toString()) !== parseFloat(product.base_price.toString()) && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.base_price)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      -{Math.round((1 - parseFloat(variant.price.toString()) / parseFloat(product.base_price.toString())) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="text-right">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">En stock</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard