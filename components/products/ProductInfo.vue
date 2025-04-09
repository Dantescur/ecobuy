<script setup lang="ts">
import { ref } from 'vue'
import ProductExtras from './ProductExtras.vue'
import QuantitySelector from './QuantitySelector.vue'
import AddToCartButton from './AddToCartButton.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const props = defineProps<{
  product: CartProduct
}>()

const quantity = ref(1)
const isAdding = ref(false)
const showAdded = ref(false)

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)

  const addToCart = async () => {
  isAdding.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    cartStore.addItem({ ...props.product, quantity: quantity.value })
    showAdded.value = true
    setTimeout(() => (showAdded.value = false), 3000)
  } catch (err) {
    console.error('Failed to add to cart:', err)
  } finally {
    isAdding.value = false
  }
}

</script>

<template>
  <div class="space-y-4 md:space-y-6">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">{{ product.title }}</h1>
      <p class="text-xs md:text-sm text-gray-500 uppercase tracking-wide">{{ product.category }}</p>
    </div>
    <div class="flex items-center space-x-4 flex-wrap gap-y-2">
      <p class="text-2xl md:text-3xl font-bold text-green-600">{{ formatPrice(product.price) }}</p>
      <span
        v-if="product.rating"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
      >
        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        {{ product.rating.rate }} ({{ product.rating.count }} reviews)
      </span>
    </div>
    <p class="text-gray-600 leading-relaxed text-sm md:text-base">{{ product.description }}</p>
    <QuantitySelector v-model="quantity" />
    <AddToCartButton 
    :is-adding="isAdding"
    :show-added="showAdded" 
    :price="product.price" 
    :quantity="quantity" 
    @click="(qty) => cartStore.addItem(product, qty)"
     />
    <ProductExtras />
  </div>
</template>
