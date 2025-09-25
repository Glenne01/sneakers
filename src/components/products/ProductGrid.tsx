'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, ProductVariant } from '@/types/database'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

interface ProductGridProps {
  products: (Product & { variants: ProductVariant[] })[]
  loading?: boolean
  className?: string
  showFilters?: boolean
}

const ProductGrid = ({ products, loading = false, className = '', showFilters = true }: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState('name')
  const [filterGender, setFilterGender] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  // Update filtered products when products change
  useEffect(() => {
    let filtered = [...products]

    // Filter by gender
    if (filterGender !== 'all') {
      filtered = filtered.filter(product => product.gender === filterGender)
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const minPrice = Math.min(...product.variants.map(v => v.price))
      const maxPrice = Math.max(...product.variants.map(v => v.price))
      return minPrice >= priceRange[0] && maxPrice <= priceRange[1]
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))
        case 'price-desc':
          return Math.max(...b.variants.map(v => v.price)) - Math.max(...a.variants.map(v => v.price))
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, filterGender, priceRange, sortBy])

  // Create product-variant combinations for display
  const productVariantPairs = filteredProducts.flatMap(product =>
    product.variants
      .filter(variant => variant.is_active)
      .map(variant => ({ product, variant }))
  )

  if (loading) {
    return (
      <div className={`${className}`}>
        {showFilters && (
          <div className="mb-8 bg-white p-4 rounded-lg shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        )}
        
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white p-4 rounded-lg shadow-soft"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              
              {/* Gender Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Genre:
                </label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="enfant">Enfant</option>
                  <option value="unisexe">Unisexe</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Prix:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {priceRange[0]}€ - {priceRange[1]}€
                  </span>
                </div>
              </div>
            </div>

            {/* Sort & Results Count */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-sm text-gray-600">
                {productVariantPairs.length} produit{productVariantPairs.length !== 1 ? 's' : ''}
              </span>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Trier par:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="name">Nom</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      {productVariantPairs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500 mb-6">
              Essayez d'ajuster vos filtres pour voir plus de résultats.
            </p>
            <button
              onClick={() => {
                setFilterGender('all')
                setPriceRange([0, 500])
              }}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="product-grid"
        >
          <AnimatePresence mode="popLayout">
            {productVariantPairs.map(({ product, variant }, index) => (
              <motion.div
                key={`${product.id}-${variant.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    delay: index * 0.05,
                    duration: 0.3 
                  }
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="hover-lift"
              >
                <ProductCard
                  product={product}
                  variant={variant}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More Button (if needed) */}
      {productVariantPairs.length > 0 && productVariantPairs.length >= 20 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <button className="btn-secondary px-8 py-4">
            Voir plus de produits
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default ProductGrid