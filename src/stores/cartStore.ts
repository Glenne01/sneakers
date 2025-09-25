import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/database'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string, sizeId: string) => void
  updateQuantity: (variantId: string, sizeId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemsCount: () => number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.variant.id === newItem.variant.id &&
              item.size.id === newItem.size.id
          )

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            // New item, add to cart
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (variantId: string, sizeId: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.variant.id === variantId && item.size.id === sizeId)
          ),
        }))
      },

      updateQuantity: (variantId: string, sizeId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId, sizeId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId && item.size.id === sizeId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        )
      },

      getItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sneakhouse-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)