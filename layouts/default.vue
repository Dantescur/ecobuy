<script setup lang="ts">
import type { CartModal } from '#components';
import AppHeader from '~/components/layout/AppHeader.vue';

const cartModal = ref<InstanceType<typeof CartModal> | null>(null)
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader @open-cart="cartModal?.openModal()" />
    <main class="flex-1 overflow-y-auto">
      <NuxtPage />
    </main>

    <CartModal ref="cartModal" />
  </div>
</template>