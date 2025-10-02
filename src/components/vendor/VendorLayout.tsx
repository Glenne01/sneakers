'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface VendorLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const VendorLayout = ({ children }: VendorLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/vendeur', icon: HomeIcon },
    { name: 'Commandes', href: '/vendeur/commandes', icon: ShoppingBagIcon },
    { name: 'Stocks', href: '/vendeur/stocks', icon: CubeIcon }
  ]

  const handleLogout = () => {
    // Redirection vers l'accueil
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Espace Vendeur</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navigation.map((item) => (
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
          <Link href="/vendeur" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Espace Vendeur</h1>
          </Link>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-2">
          {navigation.map((item) => (
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
              <span className="text-gray-600 text-sm font-medium">V</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Vendeur</p>
              <p className="text-xs text-gray-500 capitalize">Mode vendeur</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              href="/admin/login"
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Passer en mode Admin
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </div>
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
          <h1 className="text-lg font-medium text-gray-900">Espace Vendeur</h1>
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

export default VendorLayout