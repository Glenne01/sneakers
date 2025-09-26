'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminStore } from '@/stores/adminStore'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAdminStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Délai pour laisser le temps au store de se charger depuis localStorage
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Toujours rediriger vers login si pas authentifié OU si on essaie d'accéder directement à /admin
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      // Redirection automatique de /admin vers login pour forcer le choix
      else if (pathname === '/admin' && !user) {
        router.push('/admin/login')
      }
    }
  }, [isLoading, isAuthenticated, pathname, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <>{children}</>
}