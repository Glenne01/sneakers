'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Favorite {
  id: string
  product_id: string
  created_at: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [userID, setUserID] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setLoading(false)
        return
      }

      // Récupérer l'ID utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single()

      if (userError) {
        console.error('Erreur utilisateur:', userError)
        setLoading(false)
        return
      }

      setUserID(userData.id)

      // Récupérer les favoris
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userData.id)

      if (error) {
        console.error('Erreur lors du chargement des favoris:', error)
      } else {
        setFavorites(data || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => fav.product_id === productId)
  }

  const toggleFavorite = async (productId: string): Promise<void> => {
    if (!userID) {
      // Essayer de charger l'utilisateur d'abord
      await loadFavorites()
      if (!userID) {
        toast.error('Vous devez être connecté pour ajouter des favoris')
        return
      }
    }

    const isCurrentlyFavorite = isFavorite(productId)

    try {
      if (isCurrentlyFavorite) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userID)
          .eq('product_id', productId)

        if (error) {
          console.error('Erreur suppression favori:', error)
          toast.error('Erreur lors de la suppression du favori')
          return
        }

        setFavorites(prev => prev.filter(fav => fav.product_id !== productId))
        toast.success('Retiré des favoris', { icon: '💔' })
      } else {
        // Ajouter aux favoris
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: userID,
            product_id: productId
          })
          .select()
          .single()

        if (error) {
          console.error('Erreur ajout favori:', error)
          toast.error('Erreur lors de l\'ajout aux favoris')
          return
        }

        const newFavorite: Favorite = {
          id: data.id,
          product_id: productId,
          created_at: data.created_at
        }

        setFavorites(prev => [...prev, newFavorite])
        toast.success('Ajouté aux favoris', { icon: '❤️' })
      }
    } catch (error) {
      console.error('Erreur toggle favori:', error)
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: loadFavorites
  }
}