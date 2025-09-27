'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

const Header = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const { getItemsCount, openCart, clearCart } = useCartStore()
  const cartItemsCount = getItemsCount()

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Erreur auth:', error)
    } finally {
      setLoading(false)
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }

  const loadUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single()

      if (error) {
        console.error('Erreur profil:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
  }

  const handleLogout = async () => {
    try {
      setIsAccountMenuOpen(false)
      setLoading(true)

      // Déconnecter de Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Erreur Supabase signOut:', error)
        toast.error('Erreur lors de la déconnexion')
        setLoading(false)
        return
      }

      // Réinitialiser l'état local immédiatement
      setUser(null)
      setUserProfile(null)

      // Vider le panier à la déconnexion
      clearCart()

      // Notifier le succès et rediriger
      toast.success('Déconnexion réussie')
      router.push('/')

    } catch (error) {
      console.error('Erreur déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    } finally {
      setLoading(false)
    }
  }

  const navigationItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Hommes', href: '/sneakers?gender=homme' },
    { name: 'Femmes', href: '/sneakers?gender=femme' },
    { name: 'Enfants', href: '/sneakers?gender=enfant' }
  ]

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/sneakers?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Gauche */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                <Image
                  src="https://i.imgur.com/aMPFKNw.png"
                  alt="SneakHouse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hidden sm:block">
                SneakHouse
              </span>
            </Link>
          </div>

          {/* Navigation - Centre */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions - Droite */}
          <div className="flex items-center space-x-1">

            {/* Recherche */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 200 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="absolute right-0 top-full mt-2"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login/Account */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
              >
                <UserIcon className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {isAccountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {userProfile ? (
                      <>
                        {/* Utilisateur connecté */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile.first_name} {userProfile.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{userProfile.email}</p>
                        </div>

                        <Link
                          href="/settings"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-3" />
                          Mon compte
                        </Link>

                        <Link
                          href="/commandes"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-3" />
                          Mes commandes
                        </Link>

                        <Link
                          href="/favoris"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <HeartIcon className="h-4 w-4 mr-3" />
                          Mes favoris
                        </Link>

                        <Link
                          href="/sneakers"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ShoppingBagIcon className="h-4 w-4 mr-3" />
                          Catalogue
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Se déconnecter
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Utilisateur non connecté */}
                        <Link
                          href="/compte"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Se connecter
                        </Link>

                        <Link
                          href="/compte?mode=signup"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Créer un compte
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panier */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
            >
              <ShoppingBagIcon className="h-5 w-5" />
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

            {/* Menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
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

                {/* User Info (Mobile) */}
                {userProfile && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {userProfile.first_name} {userProfile.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{userProfile.email}</p>
                  </div>
                )}

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

                  {/* Auth Links (Mobile) */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {userProfile ? (
                      <>
                        <Link
                          href="/settings"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
                        >
                          Mon compte
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Se déconnecter
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/compte"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
                        >
                          Se connecter
                        </Link>
                        <Link
                          href="/compte?mode=signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200"
                        >
                          Créer un compte
                        </Link>
                      </>
                    )}
                  </div>
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