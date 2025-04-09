<template>
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 class="text-2xl">{{ $t('name') }}</h1>
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="text-white hover:underline">{{ $t('home') }}</NuxtLink>
      <LocaleChanger />
      <CartButton @openCart="onOpenCart" :item-count="itemCount" />
    </div>
  </header>
</template>

<script setup lang="ts">
import LocaleChanger from './LocaleChanger.vue';
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)

defineProps<{
  onOpenCart: () => void
}>()

</script>