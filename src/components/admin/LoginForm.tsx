'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface LoginFormProps {
  userType: 'admin' | 'vendor'
}

export default function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Connexion temporaire simplifiée
      if (userType === 'admin' && email === 'admin@sneakhouse.com' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', 'admin')
          localStorage.setItem('userEmail', email)
        }
        router.push('/admin')
      } else if (userType === 'vendor' && email === 'vendeur@sneakhouse.com' && password === 'vendeur123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', 'vendor')
          localStorage.setItem('userEmail', email)
        }
        router.push('/vendeur')
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion {userType === 'admin' ? 'Administrateur' : 'Vendeur'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre espace {userType === 'admin' ? 'administrateur' : 'vendeur'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder={userType === 'admin' ? 'admin@sneakhouse.com' : 'vendeur@sneakhouse.com'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10"
                placeholder={userType === 'admin' ? 'admin123' : 'vendeur123'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-600">
              <strong>Comptes de test :</strong><br/>
              Admin : admin@sneakhouse.com / admin123<br/>
              Vendeur : vendeur@sneakhouse.com / vendeur123
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  )
}