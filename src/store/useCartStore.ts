import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  variantId: string
  sizeId: string
  productName: string
  variantColor: string | null
  sizeValue: string
  price: number
  quantity: number
  imageUrl: string | null
  sku: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalAmount: number

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalAmount: 0,

      addItem: (newItem) => {
        const state = get()
        const existingItemIndex = state.items.findIndex(
          item => item.variantId === newItem.variantId && item.sizeId === newItem.sizeId
        )

        let updatedItems: CartItem[]

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          updatedItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        } else {
          // New item
          const newCartItem: CartItem = {
            id: `${newItem.variantId}-${newItem.sizeId}`,
            ...newItem
          }
          updatedItems = [...state.items, newCartItem]
        }

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({
          items: updatedItems,
          totalItems,
          totalAmount,
          isOpen: true // Auto-open cart when item is added
        })
      },

      removeItem: (id) => {
        const state = get()
        const updatedItems = state.items.filter(item => item.id !== id)
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({
          items: updatedItems,
          totalItems,
          totalAmount
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        const state = get()
        const updatedItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({
          items: updatedItems,
          totalItems,
          totalAmount
        })
      },

      clearCart: () => set({
        items: [],
        totalItems: 0,
        totalAmount: 0
      }),

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
      }),
    }
  )
)