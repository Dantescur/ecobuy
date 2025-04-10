<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6">
      
      <SearchFilter v-model:search="searchQuery" v-model:category="selectedCategory" :categories="categories" />
      <ProductGrid
        :products="filteredProducts"
        :pending="pending"
        :error="error"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SearchFilter from '~/components/products/SearchFilter.vue'
import ProductGrid from '~/components/products/ProductGrid.vue'

const searchQuery = ref('')
const selectedCategory = ref('')

const { data: products, pending, error } = await useFetch('https://fakestoreapi.com/products', {
  transform: (products) => products.map(product => ({
    ...product,
    image: product.image || '/placeholder-image.png',
  })),
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
</script>