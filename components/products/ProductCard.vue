<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="relative aspect-square overflow-hidden">
      <NuxtImg :src="product.image" :alt="product.title"
        class="object-contain w-full h-full p-4 transform group-hover:scale-105 transition-transform duration-300"
        loading="lazy" placeholder @error="handleImageError" />
    </div>
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-900 line-clamp-2 mb-2" :title="product.title">
        {{ product.title }}
      </h2>
      <div class="flex items-center justify-between mb-4">
        <p class="text-xl font-bold text-green-600">{{ formatPrice(product.price) }}</p>
        <div class="text-sm text-gray-500">{{ product.category }}</div>
      </div>
      <NuxtLink prefetch-on="interaction" :to="`/products/${product.id}`"
        class="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-300">
        {{ $t('details') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.png'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>