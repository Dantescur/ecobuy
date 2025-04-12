<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
    <!-- Image Container with Action Buttons -->
    <div class="relative aspect-square overflow-hidden">
      <NuxtErrorBoundary @error="handleBoundError">
        <NuxtImg :src="product.image" :alt="product.title"
          class="object-contain w-full h-full p-6 transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy" placeholder />
        <template #error="{ error }">
          <p>Image failed to load. Please reload your page.</p>
          <p>{{ error }}</p>

        </template>
      </NuxtErrorBoundary>
      <!-- Action Buttons -->
      <div class="absolute top-2 right-2 flex flex-col gap-2">
        <button @click="toggleWishlist"
          class="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors duration-200"
          :class="{ 'text-red-500': isInWishlist, 'text-gray-600': !isInWishlist }">
          <Icon :name="isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'" class="w-5 h-5" />
        </button>
        <button @click="addToCart"
          class="p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors duration-200">
          <Icon name="mdi:cart-plus" class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <!-- Sale Badge -->
      <!-- <div v-if="product.onSale"
        class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
        Sale
      </div> -->
    </div>

    <!-- Product Information -->
    <div class="p-4 space-y-3">
      <!-- Category -->
      <div class="text-sm text-gray-500 uppercase tracking-wide">
        {{ product.category }}
      </div>

      <!-- Title -->
      <h2 class="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors duration-200"
        :title="product.title">
        {{ product.title }}
      </h2>

      <!-- Price Section -->
      <div class="flex items-center justify-between">
        <div class="space-x-2">
          <span class="text-xl font-bold text-green-600">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="product.oldPrice" class="text-sm text-gray-400 line-through">
            {{ formatPrice(product.oldPrice) }}
          </span>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-1">
          <Icon name="mdi:star" class="w-5 h-5 text-yellow-400" />
          <span class="text-sm text-gray-600">
            {{ product.rating.rate }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <NuxtLink prefetch-on="interaction" :to="`/products/${product.id}`"
          class="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium">
          {{ $t('details') }}
        </NuxtLink>
        <button @click="addToCart"
          class="flex-1 text-center bg-gray-800 text-white py-2.5 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-300 text-sm font-medium flex items-center justify-center gap-2">
          <Icon name="mdi:cart" class="w-5 h-5" />
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  product: CartProduct
}>()

const isInWishlist = ref(false)

const handleBoundError = (_error: unknown) => {
  const error = _error instanceof Error ? _error : new Error(String(_error))
  console.error("Error happened: ", error)
  showError(error)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  // Emit event for parent component
  emit('toggle-wishlist', {
    productId: props.product.id,
    isInWishlist: isInWishlist.value
  })
}

const cartStore = useCartStore()

const addToCart = () => {
  // Emit event for parent component
  cartStore.addItem(props.product)
}

const emit = defineEmits(['toggle-wishlist', 'add-to-cart'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .aspect-square {
    aspect-ratio: 4/3;
  }
}
</style>