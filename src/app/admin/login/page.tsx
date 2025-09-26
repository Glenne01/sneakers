'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAdminStore, loginAsAdmin, loginAsVendor } from '@/stores/adminStore'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAdminStore()

  const handleAdminLogin = async () => {
    setLoading(true)
    try {
      loginAsAdmin()
      router.push('/admin')
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVendorLogin = async () => {
    setLoading(true)
    try {
      loginAsVendor()
      router.push('/admin')
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    // La page se rechargera et montrera les options de connexion
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">SH</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>

          {isAuthenticated && user ? (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                Connecté en tant que : {user.firstName} {user.lastName}
              </p>
              <p className="text-green-600 text-sm">Rôle : {user.role}</p>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">Choisissez votre type de connexion</p>
          )}
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/admin')}
              className="w-full"
              size="lg"
            >
              Accéder au Panel Admin
            </Button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Se déconnecter et changer de rôle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Connexion...' : '👑 Se connecter comme Admin'}
            </Button>

            <Button
              onClick={handleVendorLogin}
              disabled={loading}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              {loading ? 'Connexion...' : '🛒 Se connecter comme Vendeur'}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 mb-2">Différences :</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Admin</strong> : Accès complet (gestion vendeurs, analytics)</p>
                <p><strong>Vendeur</strong> : Commandes et produits seulement</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}