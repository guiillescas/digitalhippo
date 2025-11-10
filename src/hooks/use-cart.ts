import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { Product } from '@/payload-types'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  addItem: (_product: Product) => void
  removeItem: (_productId: string) => void
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
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            } as any)
      ),
    }
  )
)
