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
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userRole = localStorage.getItem('userRole') as UserRole
    const userEmail = localStorage.getItem('userEmail')

    if (userRole && userEmail) {
      setUser({ email: userEmail, role: userRole })
    } else if (requiredRole) {
      // Rediriger vers la page de connexion si non connecté
      const loginPath = requiredRole === 'admin' ? '/admin/login' :
                       requiredRole === 'vendor' ? '/vendeur/login' : '/login'
      router.push(loginPath)
      return
    }

    // Vérifier si l'utilisateur a le bon rôle
    if (requiredRole && userRole !== requiredRole) {
      router.push('/unauthorized')
      return
    }

    setLoading(false)
  }, [requiredRole, router])

  const logout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    setUser(null)
    router.push('/')
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