<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadcrumbNav from '~/components/products/BreadcrumbNav.vue'
import ErrorState from '~/components/ui/ErrorState.vue'
import ProductImage from '~/components/products/ProductImage.vue'
import ProductInfo from '~/components/products/ProductInfo.vue'

const route = useRoute()

const { data: product, pending, error, refresh: refreshData } = await useFetch(
  `https://fakestoreapi.com/products/${route.params.id}`
)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <BreadcrumbNav :product-title="product?.title" />
      <div v-if="pending" class="max-w-6xl mx-auto">
        <div class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-200 rounded-lg aspect-square"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <ErrorState :message="$t('searcherror')" @retry="refreshData" />
      </div>
      <div v-else-if="product" class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImage :image="product.image" :title="product.title" />
        <ProductInfo :product="product" />
      </div>
    </div>
  </div>
</template>
