'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const heroSlides = [
  {
    id: 1,
    title: "Nouvelle Collection",
    subtitle: "Adidas Gazelle",
    description: "Découvrez l'icône intemporelle du streetwear, maintenant disponible en édition limitée",
    image: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/1456cf05b2f54703bfc3a81700a2dcaa_9366/chaussure-gazelle.jpg",
    cta: "Découvrir",
    link: "/catalogue?product=gazelle"
  },
  {
    id: 2,
    title: "Performance & Style",
    subtitle: "Handball Spezial",
    description: "L'esprit vintage rencontre la technologie moderne pour un confort exceptionnel",
    image: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08c7c0fc4ae84932864226ad74075e6e_9366/chaussure-handball-spezial.jpg",
    cta: "Shop Now",
    link: "/catalogue?product=handball-spezial"
  },
  {
    id: 3,
    title: "Édition Limitée",
    subtitle: "Collection Premium",
    description: "Des designs exclusifs pour les passionnés de sneakers authentiques",
    image: "https://assets.adidas.com/images/w_85,h_85,f_auto,q_auto,fl_lossy,c_fill,g_auto/9ad041beaa454bffa2ff966ca8d44738_9366/Chaussures_Gazelle_Manchester_United_Noir_JR1410_HM1.jpg",
    cta: "Explorer",
    link: "/nouveautes"
  }
]

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="container-custom h-full">
                <div className="grid lg:grid-cols-2 gap-12 h-full items-center">
                  {/* Content */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="space-y-8 text-center lg:text-left"
                  >
                    <div className="space-y-4">
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-primary font-semibold text-lg tracking-wide uppercase"
                      >
                        {slide.title}
                      </motion.p>

                      <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary leading-tight"
                      >
                        <span className="text-brand">{slide.subtitle}</span>
                      </motion.h1>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-xl text-accent max-w-md mx-auto lg:mx-0 leading-relaxed"
                      >
                        {slide.description}
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                      <Link href={slide.link}>
                        <Button size="lg" className="group">
                          {slide.cta}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      <Link href="/catalogue">
                        <Button variant="outline" size="lg">
                          Voir tout
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Image */}
                  <motion.div
                    initial={{ x: 50, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-lg">
                      {/* Background decoration */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full transform rotate-6 scale-110 blur-3xl" />

                      {/* Product image */}
                      <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                        <Image
                          src={slide.image}
                          alt={slide.subtitle}
                          width={400}
                          height={400}
                          className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
                          priority
                        />
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"
                      />
                      <motion.div
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-lg"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-secondary" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-secondary" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-primary scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 right-8 text-accent text-sm"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2"
        >
          <span>Scroll</span>
          <div className="w-px h-8 bg-accent/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection