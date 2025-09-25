'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { getProducts, ProductWithVariants } from '@/lib/products'



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
  
  useEffect(() => {
    setIsVisible(true)
    
    // Charger les produits depuis Supabase
    const loadProducts = async () => {
      try {
        console.log('🔄 Chargement des produits depuis Supabase...')
        const fetchedProducts = await getProducts()
        console.log('✅ Produits chargés:', fetchedProducts)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="font-intro-rust text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                SneakHouse
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Votre destination premium pour les sneakers Adidas. 
              Découvrez les dernières collections et les modèles iconiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sneakers">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Découvrir la collection
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link 
                href="/sneakers" 
                className="text-white hover:text-yellow-300 font-medium text-lg transition-colors underline underline-offset-4"
              >
                Voir toutes les sneakers
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
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
                    src="https://asset.snipes.com/f_auto,q_auto:best,d_fallback-sni.png/g_auto,c_fill,w_223,h_223/dpr_1.0/02494093_2"
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
                    src="https://asset.snipes.com/f_auto,q_auto:best,d_fallback-sni.png/g_auto,c_fill,w_223,h_223/dpr_1.0/02480699_2"
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

          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 h-80 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard
                      product={product}
                      variant={product.variants[0]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/sneakers">
              <Button variant="secondary" size="lg" className="px-8">
                Voir tous les produits
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>


    </div>
  )
}