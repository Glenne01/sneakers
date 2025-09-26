'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { User } from '@/types/admin'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Charger les utilisateurs depuis la base de données
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Mapper les données de la base vers le format User
      const mappedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone,
        role: user.role || 'customer',
        isActive: user.is_active ?? true,
        createdAt: user.created_at || new Date().toISOString(),
        updatedAt: user.updated_at || new Date().toISOString()
      }))

      setUsers(mappedUsers)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive)
    return matchesSearch && matchesStatus
  })

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const newStatus = !user.isActive

      const { error } = await supabase
        .from('users')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        throw error
      }

      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, isActive: newStatus } : user
      ))

      toast.success(`Utilisateur ${newStatus ? 'activé' : 'désactivé'} avec succès`)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const deleteUser = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId)

        if (error) {
          throw error
        }

        setUsers(prev => prev.filter(user => user.id !== userId))
        toast.success('Utilisateur supprimé avec succès')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Erreur lors de la suppression de l\'utilisateur')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOrdersCount = (userId: string) => {
    // Mock - à remplacer par de vraies données
    const counts: Record<string, number> = {
      u1: 5,
      u2: 12,
      u3: 2
    }
    return counts[userId] || 0
  }

  const getTotalSpent = (userId: string) => {
    // Mock - à remplacer par de vraies données
    const totals: Record<string, number> = {
      u1: 450.50,
      u2: 1285.99,
      u3: 199.99
    }
    return totals[userId] || 0
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="text-gray-600 mt-1">{filteredUsers.length} utilisateurs trouvés</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{users.filter(u => u.isActive).length} actifs</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{users.filter(u => !u.isActive).length} inactifs</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs seulement</option>
                <option value="inactive">Inactifs seulement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-semibold text-gray-900">{users.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commandes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total dépensé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                      <p className="text-gray-500 mt-2">Chargement des utilisateurs...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">👥</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                      <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Essayez de modifier vos filtres de recherche.'
                          : 'Les nouveaux utilisateurs apparaîtront ici automatiquement.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getOrdersCount(user.id)} commandes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        €{getTotalSpent(user.id).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-orange-600 hover:text-orange-900 inline-flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Voir
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        {user.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedUser(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profil utilisateur: {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Informations personnelles</h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                          <p className="text-sm text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                          <p className="text-sm text-gray-900">{selectedUser.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Statut</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedUser.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedUser.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Statistiques</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Commandes totales</p>
                          <p className="text-2xl font-bold text-gray-900">{getOrdersCount(selectedUser.id)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Total dépensé</p>
                          <p className="text-2xl font-bold text-gray-900">€{getTotalSpent(selectedUser.id).toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Membre depuis</p>
                          <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Dernière activité</p>
                          <p className="text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <Button onClick={() => setSelectedUser(null)} variant="secondary">
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}