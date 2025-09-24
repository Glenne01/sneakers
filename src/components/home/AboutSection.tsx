'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Truck, Shield, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: Award,
    title: "Qualité Premium",
    description: "Seulement les meilleurs produits Adidas, sélectionnés avec soin pour leur qualité exceptionnelle."
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Expédition sous 24h et livraison gratuite dès 100€ d'achat partout en France."
  },
  {
    icon: Shield,
    title: "Authentique Garanti",
    description: "100% des produits authentiques directement des stocks officiels Adidas."
  },
  {
    icon: Heart,
    title: "Service Client",
    description: "Une équipe passionnée à votre écoute pour vous accompagner dans vos choix."
  }
]

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-primary font-semibold text-lg tracking-wide uppercase mb-4"
              >
                À propos de SneakHouse
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight mb-6"
              >
                La passion des <span className="text-brand">sneakers</span> depuis 2020
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-accent leading-relaxed mb-8"
              >
                SneakHouse est né de la passion pour les sneakers authentiques et le design intemporel d&apos;Adidas.
                Nous croyons que chaque paire raconte une histoire et que le style n&apos;a pas d&apos;âge.
                Notre mission est de vous offrir les meilleures sneakers avec une expérience d&apos;achat exceptionnelle.
              </motion.p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">{feature.title}</h4>
                    <p className="text-accent text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/about">
                <Button variant="primary">En savoir plus</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Nous contacter</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src="https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/1456cf05b2f54703bfc3a81700a2dcaa_9366/chaussure-gazelle.jpg"
                  alt="Collection Adidas"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>

              {/* Secondary Images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg"
              >
                <Image
                  src="https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08c7c0fc4ae84932864226ad74075e6e_9366/chaussure-handball-spezial.jpg"
                  alt="Handball Spezial"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg"
              >
                <Image
                  src="https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/9ad041beaa454bffa2ff966ca8d44738_9366/Chaussures_Gazelle_Manchester_United_Noir_JR1410_HM1.jpg"
                  alt="Gazelle Manchester United"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>

            {/* Floating Adidas Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-xl"
            >
              <Image
                src="https://i0.wp.com/anecsport.com/wp-content/uploads/2022/12/Logo_Adidas.png?fit=769%2C512&ssl=1"
                alt="Adidas Partner"
                width={60}
                height={40}
                className="h-8 w-auto"
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -left-8 w-16 h-16 border-2 border-primary/20 border-dashed rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/10 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection