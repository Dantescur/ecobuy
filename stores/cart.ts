import { defineStore } from 'pinia'
import type { Product } from '~/pages/index.vue'

export interface CartProducts extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartProducts[],
  }),
  actions: {
    addItem(product: CartProducts) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item) item.quantity = quantity
    },
    removeItem(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
    },
  },
  getters: {
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    itemCount: (state) => state.items.length,
  },
})