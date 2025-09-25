'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FunnelIcon, XMarkIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { getProducts, ProductWithVariants } from '@/lib/products'
import { Product } from '@/types/database'

const genderOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'enfant', label: 'Enfant' },
  { value: 'unisexe', label: 'Unisexe' }
]

// Pointures par genre basées sur les données de la base
const sizesByGender = {
  all: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '28', '29', '30', '31', '32', '33', '34', '35'],
  homme: ['39', '40', '41', '42', '43', '44', '45', '46'], // Pointures masculines typiques
  femme: ['36', '37', '38', '39', '40', '41', '42', '43'], // Pointures féminines typiques
  enfant: ['28', '29', '30', '31', '32', '33', '34', '35'], // Pointures enfants
  unisexe: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'] // Pointures unisexes
}

export default function SneakersPage() {
  const [allProducts, setAllProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    gender: 'all',
    sizes: [] as string[],
    priceRange: [0, 500] as [number, number],
    sortBy: 'newest'
  })

  useEffect(() => {
    // Charger les produits depuis Supabase
    const loadProducts = async () => {
      try {
        console.log('🔄 Chargement des produits depuis Supabase...')
        const fetchedProducts = await getProducts()
        console.log('✅ Produits chargés:', fetchedProducts)
        setAllProducts(fetchedProducts)
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.variants.some(variant =>
          variant.color?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filter by gender
    if (filters.gender !== 'all') {
      filtered = filtered.filter(product => product.gender === filters.gender)
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseFloat(product.variants[0]?.price?.toString() || '0')
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return parseFloat(a.variants[0]?.price?.toString() || '0') - parseFloat(b.variants[0]?.price?.toString() || '0')
        case 'price-desc':
          return parseFloat(b.variants[0]?.price?.toString() || '0') - parseFloat(a.variants[0]?.price?.toString() || '0')
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [allProducts, filters, searchQuery])

  // Pointures disponibles selon le genre sélectionné
  const availableSizes = useMemo(() => {
    return sizesByGender[filters.gender as keyof typeof sizesByGender] || sizesByGender.all
  }, [filters.gender])

  // Effacer les pointures sélectionnées qui ne sont plus disponibles
  useEffect(() => {
    const validSizes = filters.sizes.filter(size => availableSizes.includes(size))
    if (validSizes.length !== filters.sizes.length) {
      setFilters(prev => ({ ...prev, sizes: validSizes }))
    }
  }, [availableSizes, filters.sizes])

  const handleGenderChange = (gender: string) => {
    setFilters(prev => ({ ...prev, gender }))
  }

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const clearFilters = () => {
    setFilters({
      gender: 'all',
      sizes: [],
      priceRange: [0, 500],
      sortBy: 'newest'
    })
    setSearchQuery('')
  }

  const activeFiltersCount =
    (filters.gender !== 'all' ? 1 : 0) +
    filters.sizes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Toutes nos <span className="text-yellow-300">Sneakers</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez notre collection complète de sneakers Adidas pour tous les styles et toutes les occasions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              <ChevronDownIcon className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filters Sidebar */}
          <motion.aside
            className={`lg:w-80 bg-white rounded-2xl p-6 shadow-soft h-fit ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recherche</h3>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Genre</h3>
              <div className="space-y-2">
                {genderOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={filters.gender === option.value}
                      onChange={(e) => handleGenderChange(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter - Dynamic selon le genre */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pointures {filters.gender !== 'all' && `(${genderOptions.find(g => g.value === filters.gender)?.label})`}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      filters.sizes.includes(size)
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {filters.sizes.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  {filters.sizes.length} pointure{filters.sizes.length > 1 ? 's' : ''} sélectionnée{filters.sizes.length > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prix</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {filters.priceRange[0]}€ - {filters.priceRange[1]}€
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trier par</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="newest">Plus récents</option>
                <option value="name">Nom A-Z</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Search and Results Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredProducts.length} sneaker{filteredProducts.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filters.gender !== 'all'
                      ? `Genre: ${genderOptions.find(g => g.value === filters.gender)?.label}`
                      : 'Collection complète'
                    }
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 h-80 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
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
                    <Button
                      onClick={clearFilters}
                      variant="secondary"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <ProductCard
                        product={product as Product}
                        variant={product.variants[0]}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}