<template>
    <div>
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
            <p class="text-sm text-red-700">{{ $t('searcherror') }}</p>
          </div>
        </div>
      </div>
  
      <!-- Products Grid -->
      <TransitionGroup v-else name="products" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </TransitionGroup>
  
      <!-- Empty State -->
      <div v-if="!pending && !error && products.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('nofound') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ $t('suggest') }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import ProductCard from '~/components/products/ProductCard.vue'
  
  defineProps({
    products: { type: Array, default: () => [] },
    pending: Boolean,
    error: Object
  })
  </script>
  
  <style scoped>
  .products-enter-active, .products-leave-active {
    transition: all 0.5s ease;
  }
  .products-enter-from, .products-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  </style>