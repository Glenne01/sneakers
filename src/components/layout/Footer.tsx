'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Boutique',
      links: [
        { name: 'Homme', href: '/sneakers?gender=homme' },
        { name: 'Femme', href: '/sneakers?gender=femme' },
        { name: 'Enfant', href: '/sneakers?gender=enfant' },
        { name: 'Toutes les Sneakers', href: '/sneakers' },
      ]
    },
    {
      title: 'Service Client',
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Guide des tailles', href: '/guide-tailles' },
        { name: 'Livraison', href: '/livraison' },
        { name: 'Retours & Échanges', href: '/retours' },
      ]
    },
    {
      title: 'Mon Compte',
      links: [
        { name: 'Se connecter', href: '/connexion' },
        { name: 'Créer un compte', href: '/inscription' },
        { name: 'Mes commandes', href: '/compte/commandes' },
        { name: 'Mes favoris', href: '/favoris' },
        { name: 'Mon profil', href: '/compte/profil' },
      ]
    },
    {
      title: 'Informations',
      links: [
        { name: 'À propos', href: '/a-propos' },
        { name: 'Mentions légales', href: '/mentions-legales' },
        { name: 'CGV', href: '/cgv' },
        { name: 'Politique de confidentialité', href: '/confidentialite' },
        { name: 'Cookies', href: '/cookies' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/sneakhouse', icon: '📷' },
    { name: 'Facebook', href: 'https://facebook.com/sneakhouse', icon: '📘' },
    { name: 'Twitter', href: 'https://twitter.com/sneakhouse', icon: '🐦' },
    { name: 'TikTok', href: 'https://tiktok.com/@sneakhouse', icon: '🎵' },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email)
    
    // Show success message
    alert('Merci pour votre inscription à la newsletter !')
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Restez au courant des dernières
              <span className="text-gradient-orange"> tendances</span>
            </h3>
            <p className="text-gray-400 mb-8">
              Inscrivez-vous à notre newsletter et soyez les premiers informés des nouveautés, 
              des offres exclusives et des collections limitées.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Votre adresse email"
                required
                className="flex-1 px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-white placeholder-gray-400"
              />
              <Button type="submit" className="px-8">
                S'inscrire
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="https://i.imgur.com/tqc28SR.png"
                  alt="SneakHouse"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-intro-rust text-2xl font-bold text-gradient-orange">
                SneakHouse
              </span>
            </div>
            
            <p className="text-gray-400 mb-6">
              La destination premium pour les sneakers Adidas. 
              Découvrez les dernières collections et les modèles iconiques.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-orange-500" />
                <span>123 Rue de la Mode, 75001 Paris</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-orange-500" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-orange-500" />
                <span>contact@sneakhouse.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-orange-500" />
                <span>Chat en ligne 24h/7j</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="font-semibold text-lg mb-6 text-white">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} SneakHouse. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Boutique partenaire officiel Adidas
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Suivez-nous</span>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-sm">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Partner Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-xs">Partenaire officiel</span>
              <div className="relative w-16 h-8 opacity-70">
                <Image
                  src="https://i0.wp.com/anecsport.com/wp-content/uploads/2022/12/Logo_Adidas.png?fit=769%2C512&ssl=1"
                  alt="Adidas"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer