'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  TagIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  userRole: 'admin' | 'vendor'
}

const adminMenuItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Produits', href: '/admin/products', icon: CubeIcon },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'Stocks', href: '/admin/stock', icon: TagIcon },
  { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
  { name: 'Vendeurs', href: '/admin/vendors', icon: TruckIcon },
  { name: 'Finances', href: '/admin/finances', icon: BanknotesIcon },
  { name: 'Analytiques', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Modération', href: '/admin/moderation', icon: ExclamationTriangleIcon },
  { name: 'Configuration', href: '/admin/settings', icon: CogIcon }
]

const vendorMenuItems = [
  { name: 'Dashboard', href: '/vendeur', icon: HomeIcon },
  { name: 'Mes Produits', href: '/vendeur/produits', icon: CubeIcon },
  { name: 'Mes Commandes', href: '/vendeur/commandes', icon: ShoppingBagIcon },
  { name: 'Mon Stock', href: '/vendeur/stock', icon: TagIcon },
  { name: 'Mes Finances', href: '/vendeur/finances', icon: BanknotesIcon },
  { name: 'Mes Statistiques', href: '/vendeur/stats', icon: ChartBarIcon },
  { name: 'Mes Promotions', href: '/vendeur/promotions', icon: TagIcon }
]

export default function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = userRole === 'admin' ? adminMenuItems : vendorMenuItems

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <h2 className="text-xl font-bold text-white">
            {userRole === 'admin' ? 'Admin Panel' : 'Vendeur Panel'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-white lg:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-6 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-6 py-3 text-sm font-medium transition-colors duration-150
                  ${isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 w-full p-4 bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userRole === 'admin' ? 'A' : 'V'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {userRole === 'admin' ? 'Administrateur' : 'Vendeur'}
              </p>
              <Link
                href="/logout"
                className="text-xs text-gray-400 hover:text-white"
              >
                Déconnexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}