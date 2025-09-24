'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </ToastProvider>
  )
}

export default Layout