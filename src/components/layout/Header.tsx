'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
 
  UserIcon, 
  ShoppingBagIcon, 
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/Button'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { getItemsCount, openCart } = useCartStore()
  const cartItemsCount = getItemsCount()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    { name: 'Sneakers', href: '/sneakers', gradient: 'from-orange-500 to-red-500' }
  ]


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:scale-110">
                <Image
                  src="https://i.imgur.com/aMPFKNw.png"
                  alt="SneakHouse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-intro-rust text-lg md:text-2xl font-bold text-gradient-orange hidden sm:block">
                SneakHouse
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group px-3 py-2 rounded-lg transition-all duration-300"
              >
                <span className="text-gray-700 group-hover:text-white transition-colors duration-300 relative z-10">
                  {item.name}
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 transform scale-95 group-hover:scale-100`} />
              </Link>
            ))}
          </nav>


          {/* Action Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 group"
              >
                <UserIcon className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              </button>
              
              <AnimatePresence>
                {isAccountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link
                      href="/compte"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Se connecter
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Paramètres
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Se déconnecter
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 group"
            >
              <ShoppingBagIcon className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
              {mounted && cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="bg-white h-full w-80 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src="https://i.imgur.com/tqc28SR.png"
                        alt="SneakHouse"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-intro-rust text-xl font-bold text-gradient-orange">
                      SneakHouse
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Partenaire officiel</span>
                    <div className="relative w-16 h-8">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header