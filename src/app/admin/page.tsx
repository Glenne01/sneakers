'use client'

import { useAdminStore } from '@/stores/adminStore'

export default function AdminDashboard() {
  const { user, logout } = useAdminStore()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Admin Dashboard - Connexion Réussie !
          </h1>
          <p className="text-gray-600 mb-6">
            Félicitations ! Vous êtes maintenant connecté au dashboard administrateur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-orange-900">Produits</h3>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900">Commandes</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900">Utilisateurs</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-900">CA</h3>
              <p className="text-2xl font-bold text-purple-600">0€</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Ajouter un produit
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Voir les commandes
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Gérer les stocks
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}