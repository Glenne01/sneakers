'use client'

import { useAdminStore, loginAsAdmin, loginAsVendor } from '@/stores/adminStore'
import { Button } from '@/components/ui/Button'

export default function AdminDebugPage() {
  const { user, isAuthenticated } = useAdminStore()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Admin</h1>

        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">État d'authentification:</h3>
            <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Utilisateur:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>

          <div className="flex space-x-4">
            <Button onClick={loginAsAdmin}>
              Login comme Admin
            </Button>
            <Button onClick={loginAsVendor} variant="secondary">
              Login comme Vendeur
            </Button>
            <Button onClick={() => window.localStorage.clear()} variant="outline">
              Clear localStorage
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}