<template>
  <header ref="header" class="z-40 p-4 flex justify-between items-center transition-all duration-300 " :class="{
    'bg-white bg-opacity-90 text-gray-800 shadow-sm header-gradient': isScrolled,
    'bg-gray-800 text-white ': !isScrolled
  }">
    <!-- Gradient fade at bottom -->

    <h1 class="text-2xl">{{ $t('name') || 'My App' }}</h1>
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="hover:underline">{{ $t('home') || 'Home' }}</NuxtLink>
      <LocaleChanger />
      <CartButton @openCart="onOpenCart" :item-count="itemCount" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { CartButton } from '#components';
import LocaleChanger from './LocaleChanger.vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const itemCount = computed(() => cartStore.itemCount || 0);
const isScrolled = ref(false);

const mainElement = ref<HTMLElement | null>(null);

defineProps<{
  onOpenCart: () => void;
}>();

const handleScroll = () => {
  if (mainElement.value) {
    isScrolled.value = mainElement.value.scrollTop > 60;
  }
};

onMounted(() => {
  if (import.meta.client) {
    mainElement.value = document.querySelector('main.overflow-y-auto');
    if (mainElement.value) {
      handleScroll();
      mainElement.value.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      console.warn('Scrollable <main> element not found');
    }
  }
});

onBeforeUnmount(() => {
  if (import.meta.client && mainElement.value) {
    mainElement.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style>
.header-gradient::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 10px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  pointer-events: none;
  transition: opacity 0.3s ease;
}
</style>