'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// Mock data - replace with actual Supabase data later
const featuredProducts = [
  {
    id: 1,
    name: "Gazelle",
    brand: "Adidas",
    price: 110,
    originalPrice: null,
    image: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/1456cf05b2f54703bfc3a81700a2dcaa_9366/chaussure-gazelle.jpg",
    hoverImage: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/979b1355f7da4d3b8cfaa81700a2886b_9366/chaussure-gazelle.jpg",
    rating: 4.8,
    reviewCount: 324,
    isNew: false,
    colors: ["Gris", "Noir", "Bleu"],
    slug: "gazelle-gris"
  },
  {
    id: 2,
    name: "Handball Spezial",
    brand: "Adidas",
    price: 110,
    originalPrice: null,
    image: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08c7c0fc4ae84932864226ad74075e6e_9366/chaussure-handball-spezial.jpg",
    hoverImage: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/0f2b7da40d124c87b709fe392986cb53_9366/chaussure-handball-spezial.jpg",
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    colors: ["Noir/Blanc", "Orange", "Rouge"],
    slug: "handball-spezial-noir"
  },
  {
    id: 3,
    name: "Gazelle Manchester United",
    brand: "Adidas",
    price: 120,
    originalPrice: 140,
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/9ad041beaa454bffa2ff966ca8d44738_9366/Chaussures_Gazelle_Manchester_United_Noir_JR1410_HM1.jpg",
    hoverImage: null,
    rating: 4.7,
    reviewCount: 89,
    isNew: false,
    colors: ["Noir"],
    slug: "gazelle-manchester-united"
  },
  {
    id: 4,
    name: "Gazelle Beige",
    brand: "Adidas",
    price: 110,
    originalPrice: null,
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/1a178c51e7ed417ab7cc0e2ea83a35fe_9366/Chaussure_Gazelle_Beige_JR6292_00_plp_standard.jpg",
    hoverImage: null,
    rating: 4.6,
    reviewCount: 203,
    isNew: false,
    colors: ["Beige", "Bleu", "Bordeaux"],
    slug: "gazelle-beige"
  }
]

const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-secondary mb-4"
            >
              Produits <span className="text-primary">Phares</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-accent text-lg"
            >
              Découvrez notre sélection de sneakers les plus populaires
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/catalogue">
              <Button variant="outline" className="group">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProductCardProps {
  product: typeof featuredProducts[0]
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImage, setCurrentImage] = React.useState(product.image)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  return (
    <div className="product-card group">
      {/* Product Image */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
            Nouveau
          </div>
        )}

        {/* Sale Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -14%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>

        <Link href={`/produit/${product.slug}`}>
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onMouseEnter={() => {
              if (product.hoverImage) {
                setCurrentImage(product.hoverImage)
              }
            }}
            onMouseLeave={() => setCurrentImage(product.image)}
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
            {product.brand} {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-accent">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-accent">Couleurs:</span>
          <span className="text-xs text-secondary">
            {product.colors.length} disponible{product.colors.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            {product.price} €
          </span>
          {product.originalPrice && (
            <span className="text-sm text-accent line-through">
              {product.originalPrice} €
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts