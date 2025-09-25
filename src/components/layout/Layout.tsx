'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import CookieBanner from './CookieBanner'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from 'react-hot-toast'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Cart Drawer - Global */}
      <CartDrawer />
      
      {/* Cookie Banner */}
      <CookieBanner />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#FE6601',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

export default Layout