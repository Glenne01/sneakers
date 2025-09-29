import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/admin'

interface AdminStore {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// Mock user data - à remplacer par de vraies données Supabase
const MOCK_ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@sneakhouse.fr',
  firstName: 'Admin',
  lastName: 'SneakHouse',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const MOCK_VENDOR_USER: User = {
  id: 'vendor-1',
  email: 'vendor@sneakhouse.fr',
  firstName: 'Vendeur',
  lastName: 'Test',
  role: 'vendor',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login'
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      }
    }),
    {
      name: 'sneakhouse-admin',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)

// Helper functions pour le développement
export const loginAsAdmin = () => {
  const { login } = useAdminStore.getState()
  login(MOCK_ADMIN_USER)
}

export const loginAsVendor = () => {
  const { login } = useAdminStore.getState()
  login(MOCK_VENDOR_USER)
}