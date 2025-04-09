<template>
  <div>
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl">EcoBuy</h1>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-white hover:underline">Home</NuxtLink>
        <button
          @click="cartModal?.openModal()"
          class="relative flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          aria-label="Open cart"
        >
          <Icon name="mdi:cart" size="24" />
          <span v-if="itemCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ itemCount }}
          </span>
        </button>
      </div>
    </header>
    <main>
      <NuxtPage />
    </main>
    <CartModal ref="cartModal" />
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)
const cartModal = ref(null)
</script>