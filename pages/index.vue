<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6">
      <!-- Header Section -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">EcoBuy Store</h1>
        <p class="text-gray-600">Discover eco-friendly products for a sustainable lifestyle</p>
      </header>

      <!-- Search and Filter Section -->
      <div class="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search products..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <select
          v-model="selectedCategory"
          class="block w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategory(category) }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse bg-white rounded-lg shadow-sm p-4">
          <div class="bg-gray-200 h-48 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              Failed to load products. Please try again later.
            </p>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <TransitionGroup
        v-else
        name="products"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
        >
          <div class="relative aspect-square overflow-hidden">
            <NuxtImg
              :src="product.image"
              :alt="product.title"
              class="object-contain w-full h-full p-4 transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
          
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-900 line-clamp-2 mb-2" :title="product.title">
              {{ product.title }}
            </h2>
            
            <div class="flex items-center justify-between mb-4">
              <p class="text-xl font-bold text-green-600">
                {{ formatPrice(product.price) }}
              </p>
              <div class="text-sm text-gray-500">
                {{ product.category }}
              </div>
            </div>

            <NuxtLink
              :to="`/products/${product.id}`"
              class="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              View Details
            </NuxtLink>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="!pending && !error && filteredProducts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

export interface Product {
  id: number
  title: string
  price: number
  image: string
  category: string
}

const searchQuery = ref('')
const selectedCategory = ref('')

const { data: products, pending, error } = await useFetch<Product[]>('https://fakestoreapi.com/products', {
  transform: (products) => {
    return products.map(product => ({
      ...product,
      image: product.image || '/placeholder-image.png'
    }))
  }
})

const categories = computed(() => {
  if (!products.value) return []
  return [...new Set(products.value.map(product => product.category))].sort()
})

const filteredProducts = computed(() => {
  if (!products.value) return []
  
  return products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price)
}

const formatCategory = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleImageError = (event: Event | string) => {
  if (typeof event !== 'string') {
    const img = event.target as HTMLImageElement
    img.src = '/placeholder-image.png'
  }
}
</script>

<style scoped>
.products-enter-active,
.products-leave-active {
  transition: all 0.5s ease;
}

.products-enter-from,
.products-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>