'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import ProductCard from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import { Product, ProductVariant } from '@/types/database'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

interface FavoriteWithProduct {
  id: string
  product_id: string
  created_at: string
  products: Product & {
    variants: ProductVariant[]
    brand: { name: string } | null
    category: { name: string } | null
  }
}

export default function FavorisPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.push('/compte')
        return
      }

      // Charger le profil utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (userError) {
        console.error('Erreur profil utilisateur:', userError)
        router.push('/compte')
        return
      }

      setUserProfile(userData)
      await loadFavorites(userData.id)

    } catch (error) {
      console.error('Erreur d\'authentification:', error)
      router.push('/compte')
    }
  }

  const loadFavorites = async (userId: string) => {
    try {
      setLoading(true)

      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (
            *,
            brand:brands(name),
            category:categories(name),
            variants:product_variants (
              *
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des favoris:', error)
        toast.error('Erreur lors du chargement des favoris')
        return
      }

      setFavorites(favoritesData || [])

    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error)
      toast.error('Erreur lors du chargement des favoris')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) {
        console.error('Erreur suppression favori:', error)
        toast.error('Erreur lors de la suppression')
        return
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
      toast.success('Retiré des favoris', { icon: '💔' })

    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être connecté pour voir vos favoris.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h1>
          <p className="text-gray-600">
            {favorites.length} produit{favorites.length > 1 ? 's' : ''} dans vos favoris
          </p>
        </motion.div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 gap-8">
          {favorites.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="relative"
                >
                  <ProductCard
                    product={favorite.products as Product}
                    variant={favorite.products.variants[0]}
                    showQuickAdd={true}
                  />

                  {/* Remove from favorites button */}
                  <button
                    onClick={() => removeFavorite(favorite.id, favorite.product_id)}
                    className="absolute top-2 left-2 z-20 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200"
                    title="Retirer des favoris"
                  >
                    <HeartIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-16 bg-white rounded-xl shadow-soft"
            >
              <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun favori
              </h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore ajouté de produits à vos favoris
              </p>
              <Button onClick={() => router.push('/sneakers')}>
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                Découvrir nos produits
              </Button>
            </motion.div>
          )}
        </div>

        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Button onClick={() => router.push('/sneakers')} variant="secondary">
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}