'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'vendor' | 'customer' | null

export interface User {
  email: string
  role: UserRole
}

export function useAuth(requiredRole?: UserRole) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Attendre que le composant soit monté côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      try {
        // Attendre un peu pour s'assurer que le localStorage est disponible
        await new Promise(resolve => setTimeout(resolve, 50))

        // Vérifier si l'utilisateur est connecté
        const userRole = localStorage.getItem('userRole') as UserRole
        const userEmail = localStorage.getItem('userEmail')

        console.log('useAuth - checking:', { userRole, userEmail, requiredRole })

        if (userRole && userEmail) {
          // Vérifier si l'utilisateur a le bon rôle
          if (requiredRole && userRole !== requiredRole) {
            console.log('useAuth - wrong role, redirecting to unauthorized')
            router.push('/unauthorized')
            return
          }

          setUser({ email: userEmail, role: userRole })
          setLoading(false)
        } else if (requiredRole) {
          // Rediriger vers la page de connexion si non connecté
          console.log('useAuth - not authenticated, redirecting to login')
          const loginPath = requiredRole === 'admin' ? '/admin/login' :
                           requiredRole === 'vendor' ? '/vendeur/login' : '/login'
          router.push(loginPath)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
        if (requiredRole) {
          const loginPath = requiredRole === 'admin' ? '/admin/login' :
                           requiredRole === 'vendor' ? '/vendeur/login' : '/login'
          router.push(loginPath)
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole, router, mounted])

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
    }
    setUser(null)
    router.push('/')
  }

  if (!mounted) {
    return {
      user: null,
      loading: true,
      logout,
      isAdmin: false,
      isVendor: false,
      isCustomer: false
    }
  }

  return {
    user,
    loading,
    logout,
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
    isCustomer: user?.role === 'customer'
  }
}