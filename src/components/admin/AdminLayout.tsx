'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface AdminLayoutProps {
  children: ReactNode
  userRole: 'admin' | 'vendor'
}

export default function AdminLayout({ children, userRole }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} />

      <div className="flex-1 lg:pl-0 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}