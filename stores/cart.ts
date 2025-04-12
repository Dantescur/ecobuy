import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string,
  title: string,
  category: string,
  price: number,
  oldPrice?: number,
  description: string
  image: string,
  rating: {
    rate: number,
    count: number
  }
}

export interface CartProduct extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartProduct[]>([])

  const addItem = (product: CartProduct, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, 99)
    } else {
      items.value.push({ ...product, quantity: Math.min(quantity, 99) })
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  )

  const itemCount = computed(() => items.value.reduce((count, item) => count + item.quantity, 0))

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    totalPrice,
    itemCount
  }
})
