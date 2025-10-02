'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRightIcon, ChevronLeftIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { getProducts, ProductWithVariants } from '@/lib/products'
import { Product } from '@/types/database'



const benefits = [
  {
    icon: TruckIcon,
    title: 'Livraison Gratuite',
    description: 'Dès 100€ d\'achat partout en France',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Retours 30 jours',
    description: 'Échanges et remboursements gratuits',
  },
  {
    icon: StarIcon,
    title: 'Qualité Premium',
    description: 'Partenaire officiel Adidas',
  },
  {
    icon: HeartIcon,
    title: 'Service Client',
    description: 'Support 24h/7j par chat en ligne',
  }
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsVisible(true)

    // Charger seulement les produits populaires via l'API
    const loadProducts = async () => {
      try {
        console.log('🔄 Chargement des produits populaires depuis l\'API...')

        const response = await fetch('/api/products?gender=all', {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('✅ Produits populaires chargés:', result.count, 'produits')
        setProducts(result.data || [])
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Minimal & Professional */}
      <section className="relative min-h-[85vh] bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-12">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full uppercase tracking-wider">
                Collection Exclusive Adidas
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                L'élégance du
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                  Sport
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Découvrez notre sélection premium de sneakers Adidas.
                Performance, style et authenticité réunis.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sneakers">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 px-8 py-4 text-base font-medium transition-all hover:shadow-lg hover:shadow-orange-200"
                  >
                    Explorer la collection
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/sneakers?gender=homme">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-orange-600 border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 px-8 py-4 text-base font-medium"
                  >
                    Nouveautés
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">24+</div>
                  <div className="text-sm text-gray-500">Modèles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Authentique</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">48h</div>
                  <div className="text-sm text-gray-500">Livraison</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Shoe Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg mx-auto">
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-gray-200 rounded-full opacity-30"></div>
                </div>

                {/* Featured Shoe */}
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [-2, 2, -2]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <Image
                      src="/images/sneakers/femmes/Adizero_EVO_SL.avif"
                      alt="Adidas Adizero EVO SL"
                      width={600}
                      height={600}
                      className="w-full h-auto drop-shadow-2xl"
                      priority
                    />
                  </motion.div>

                  {/* Product Info Card */}
                  <Link href="/produit/f260f6b2-7308-4fbd-807a-b1140a8a1fd9">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="absolute bottom-0 left-0 bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="text-xs text-gray-500 mb-1">Nouveauté</div>
                      <div className="font-semibold text-gray-900">Adidas Adizero EVO SL</div>
                      <div className="text-lg font-bold text-gray-900">€150.00</div>
                    </motion.div>
                  </Link>

                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gray-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-200 rounded-full opacity-20"></div>
      </section>

      {/* Benefits Section - Orange Brand Colors */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                SneakHouse
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600"
            >
              Des avantages exclusifs pour une expérience d'achat exceptionnelle
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const colors = [
                { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', hover: 'group-hover:from-orange-600 group-hover:to-orange-700' },
                { bg: 'bg-gradient-to-br from-red-500 to-red-600', hover: 'group-hover:from-red-600 group-hover:to-red-700' },
                { bg: 'bg-gradient-to-br from-orange-600 to-red-500', hover: 'group-hover:from-orange-700 group-hover:to-red-600' },
                { bg: 'bg-gradient-to-br from-red-600 to-orange-500', hover: 'group-hover:from-red-700 group-hover:to-orange-600' }
              ]
              const color = colors[index % colors.length]

              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200">
                    <div className={`w-16 h-16 ${color.bg} ${color.hover} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-lg group-hover:shadow-orange-200`}>
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center group-hover:text-orange-600 transition-colors">
                      {benefit.title}
                    </h3>

                    <p className="text-gray-600 text-center leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Decorative element */}
                    <div className="mt-4 flex justify-center">
                      <div className={`w-12 h-1 ${color.bg} rounded-full opacity-30 group-hover:opacity-60 transition-opacity`}></div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg border border-orange-100">
              <div className="flex items-center space-x-2">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">4.9/5</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="text-gray-700 font-medium">+1000 clients satisfaits</div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="text-gray-700 font-medium">Partenaire officiel Adidas</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Découvrez par{' '}
              <span className="text-gradient-orange">Catégorie</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Trouvez les sneakers parfaites pour chaque style et occasion
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Homme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href="/sneakers?gender=homme">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-70" />
                  <div className="absolute inset-0 bg-black/10" />
                  
                  <Image
                    src="/images/homme.jpg"
                    alt="Sneakers Homme"
                    fill
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        Homme
                      </h3>
                      <p className="text-white/90 mb-4">
                        Sneakers masculines tendance
                      </p>
                      <div className="flex items-center text-sm font-medium">
                        Explorer
                        <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Femme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href="/sneakers?gender=femme">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 opacity-70" />
                  <div className="absolute inset-0 bg-black/10" />
                  
                  <Image
                    src="/images/imgfemme.jpg"
                    alt="Sneakers Femme"
                    fill
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        Femme
                      </h3>
                      <p className="text-white/90 mb-4">
                        Sneakers féminines stylées
                      </p>
                      <div className="flex items-center text-sm font-medium">
                        Explorer
                        <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Enfants */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href="/sneakers?gender=enfant">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-70" />
                  <div className="absolute inset-0 bg-black/10" />
                  
                  <Image
                    src="https://asset.snipes.com/f_auto,q_auto:best,d_fallback-sni.png/g_auto,c_fill,w_223,h_223/dpr_1.0/02490783_1"
                    alt="Sneakers Enfants"
                    fill
                    className="object-cover object-center"
                  />

                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        Enfants
                      </h3>
                      <p className="text-white/90 mb-4">
                        Sneakers pour les plus jeunes
                      </p>
                      <div className="flex items-center text-sm font-medium">
                        Explorer
                        <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Produits{' '}
              <span className="text-gradient-orange">Populaires</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Les sneakers les plus appréciées par notre communauté
            </motion.p>
          </div>

          <div className="relative">
            {/* Boutons de navigation */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={scrollLeft}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={scrollRight}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {loading ? (
              <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 h-80 w-64 rounded-2xl animate-pulse flex-shrink-0" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
              </div>
            ) : (
              <motion.div
                ref={scrollRef}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.slice(0, 10).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-64 snap-center"
                  >
                    <ProductCard
                      product={product as Product}
                      variant={product.variants[0]}
                    />
                  </motion.div>
                ))}

                {/* Bouton "Voir plus" à la fin du scroll */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: products.length * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-64 snap-center"
                >
                  <Link href="/sneakers">
                    <div className="h-80 w-full bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex flex-col items-center justify-center text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 cursor-pointer group">
                      <div className="text-center">
                        <ChevronRightIcon className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-2">Voir plus</h3>
                        <p className="text-white/90 text-sm">Découvrez tous nos produits</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

        </div>
      </section>


    </div>
  )
}