'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/Button'
import { User } from '@/types/admin'

const mockVendors: User[] = []

export default function VendorsPage() {
  const [vendors, setVendors] = useState<User[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const filteredVendors = vendors.filter(vendor =>
    vendor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleVendorStatus = (vendorId: string) => {
    setVendors(prev => prev.map(vendor =>
      vendor.id === vendorId ? { ...vendor, isActive: !vendor.isActive } : vendor
    ))
  }

  const deleteVendor = (vendorId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vendeur ?')) {
      setVendors(prev => prev.filter(vendor => vendor.id !== vendorId))
    }
  }

  const createVendor = (data: Record<string, FormDataEntryValue | null>) => {
    const newVendor: User = {
      id: 'v' + Date.now(),
      email: (data.email as string) || '',
      firstName: (data.firstName as string) || '',
      lastName: (data.lastName as string) || '',
      phone: (data.phone as string) || undefined,
      role: 'vendor' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setVendors(prev => [...prev, newVendor])
    setShowCreateForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des vendeurs</h1>
            <p className="text-gray-600 mt-1">{filteredVendors.length} vendeurs trouvés</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="mt-4 sm:mt-0">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Nouveau vendeur
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <motion.tr
                    key={vendor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-medium text-sm">
                            {vendor.firstName[0]}{vendor.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vendor.firstName} {vendor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {vendor.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.email}</div>
                      {vendor.phone && (
                        <div className="text-sm text-gray-500">{vendor.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vendor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(vendor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-orange-600 hover:text-orange-900 inline-flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Voir
                      </button>
                      <button
                        onClick={() => toggleVendorStatus(vendor.id)}
                        className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        {vendor.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Detail Modal */}
        {selectedVendor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedVendor(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profil vendeur: {selectedVendor.firstName} {selectedVendor.lastName}
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVendor.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <p className="mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedVendor.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedVendor.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de création</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedVendor.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <Button onClick={() => setSelectedVendor(null)} variant="secondary">
                    Fermer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Create Vendor Form */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Créer un nouveau vendeur</h2>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  createVendor({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                  })
                }} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="email@sneakhouse.fr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" onClick={() => setShowCreateForm(false)} variant="secondary">
                      Annuler
                    </Button>
                    <Button type="submit">
                      Créer le vendeur
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}