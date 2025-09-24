import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const Footer: React.FC = () => {
  const footerLinks = {
    'À propos': [
      { label: 'Notre histoire', href: '/about' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Presse', href: '/press' },
      { label: 'Durabilité', href: '/sustainability' },
    ],
    'Service client': [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Guide des tailles', href: '/size-guide' },
      { label: 'Retours & échanges', href: '/returns' },
    ],
    'Livraison': [
      { label: 'Options de livraison', href: '/shipping' },
      { label: 'Livraison internationale', href: '/international-shipping' },
      { label: 'Suivi de commande', href: '/track-order' },
      { label: 'Livraison express', href: '/express-delivery' },
    ],
    'Légal': [
      { label: 'Mentions légales', href: '/legal' },
      { label: 'CGV', href: '/terms' },
      { label: 'Politique de confidentialité', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/sneakhouse', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/sneakhouse', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/sneakhouse', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/sneakhouse', label: 'YouTube' },
  ]

  return (
    <footer className="bg-secondary text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Restez informé des dernières <span className="text-primary">nouveautés</span>
            </h3>
            <p className="text-gray-300 mb-8">
              Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première commande
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 bg-white text-secondary"
              />
              <Button variant="primary" icon={Mail}>
                S&apos;inscrire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="https://i.imgur.com/tqc28SR.png"
                alt="SneakHouse"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              SneakHouse, votre boutique premium spécialisée dans les sneakers Adidas.
              Découvrez les dernières collections et éditions limitées.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Section */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-gray-300 text-sm mb-4 sm:mb-0">
              Partenaire officiel
            </div>
            <div className="flex items-center space-x-6">
              <Image
                src="https://i0.wp.com/anecsport.com/wp-content/uploads/2022/12/Logo_Adidas.png?fit=769%2C512&ssl=1"
                alt="Adidas"
                width={80}
                height={32}
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 sm:mb-0">
              © {new Date().getFullYear()} SneakHouse. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-6">
              <span>Paiement sécurisé</span>
              <span>•</span>
              <span>Livraison rapide</span>
              <span>•</span>
              <span>Retours gratuits</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer