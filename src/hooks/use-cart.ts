import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { Product } from '@/payload-types'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  // eslint-disable-next-line no-unused-vars
  addItem: (product: Product) => void
  // eslint-disable-next-line no-unused-vars
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => ({ items: [...state.items, { product }] })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: '@digital-hippo:cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
