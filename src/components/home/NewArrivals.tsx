'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const newArrivals = [
  {
    id: 1,
    name: "Handball Spezial Orange",
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/537a06e725b84b4fb5fb58f9e01f961a_9366/Chaussure_Handball_Spezial_Orange_JR3617_00_plp_standard.jpg",
    price: 110,
    releaseDate: "Aujourd'hui",
    slug: "handball-spezial-orange"
  },
  {
    id: 2,
    name: "Gazelle Bleu Clair",
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/3b6da90d6e7c41fa821ca60600991dd9_9366/Chaussure_Gazelle_Bleu_BB5478_00_plp_standard.jpg",
    price: 110,
    releaseDate: "Cette semaine",
    slug: "gazelle-bleu-clair"
  },
  {
    id: 3,
    name: "Handball Spezial Rouge",
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/154f6391602c476b87dde3adf24c8a36_9366/Chaussure_Handball_Spezial_Rouge_JR3607_00_plp_standard.jpg",
    price: 110,
    releaseDate: "Cette semaine",
    slug: "handball-spezial-rouge"
  }
]

const NewArrivals: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Nouvelles <span className="text-primary">Arrivées</span>
            </h2>
            <Sparkles className="w-8 h-8 text-primary ml-3" />
          </div>
          <p className="text-accent text-lg max-w-2xl mx-auto">
            Soyez les premiers à découvrir nos dernières collections fraîchement arrivées
          </p>
        </motion.div>

        {/* New Arrivals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/produit/${product.slug}`}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  {/* Release Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {product.releaseDate}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square mb-6 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-xl text-secondary mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {product.price} €
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/nouveautes">
            <Button size="lg" className="group">
              Voir toutes les nouveautés
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default NewArrivals