'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAdminStore } from '@/stores/adminStore'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/Button'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  resource?: string
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAdminStore()
  const { canAccess } = usePermissions(user?.role || 'user')

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingBagIcon, resource: 'orders' },
    { name: 'Produits', href: '/admin/products', icon: CubeIcon, resource: 'products' },
    { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon, resource: 'users' },
    { name: 'Vendeurs', href: '/admin/vendors', icon: UserGroupIcon, resource: 'vendors' },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, resource: 'analytics' },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon }
  ]

  const filteredNavigation = navigation.filter(item => 
    !item.resource || canAccess(item.resource)
  )

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté en tant qu&apos;administrateur ou vendeur.</p>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 px-6 py-6 space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </Link>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-2">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Admin Panel</h1>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout