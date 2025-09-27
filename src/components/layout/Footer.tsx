'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    try {
      // TODO: Implement newsletter subscription API
      console.log('Newsletter subscription:', email)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsNewsletterSubmitted(true)
      setTimeout(() => setIsNewsletterSubmitted(false), 3000)
    } catch (error) {
      console.error('Erreur inscription newsletter:', error)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Bloc À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              SneakHouse est votre destination de référence pour les sneakers tendances.
              Nous proposons une sélection soigneusement choisie des meilleures marques :
              Nike, Adidas, Jordan, New Balance, Converse, Puma et ASICS.
              Découvrez les dernières sorties et les modèles iconiques qui définissent la culture sneaker.
            </p>
          </div>

          {/* Bloc Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Restez informé des dernières nouveautés et offres exclusives.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                required
                disabled={isNewsletterSubmitted}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-white placeholder-gray-400 text-sm disabled:opacity-50"
              />
              <Button
                type="submit"
                className="w-full text-sm"
                disabled={isNewsletterSubmitted}
              >
                {isNewsletterSubmitted ? '✓ Inscrit!' : "S'inscrire"}
              </Button>
            </form>
          </div>

          {/* Bloc Informations légales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-generales-utilisation"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Conditions générales d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-generales-vente"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-cookies"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Politique de cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Bloc Suivez-nous */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <p className="text-gray-400 text-sm mb-4">
              Rejoignez notre communauté sur les réseaux sociaux.
            </p>

            <div className="flex space-x-4">
              <motion.a
                href="https://facebook.com/sneakhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </motion.a>

              <motion.a
                href="https://instagram.com/sneakhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne de séparation et copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} SneakHouse. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer