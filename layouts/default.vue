<script setup lang="ts">
import type { CartModal } from '#components';
import AppHeader from '~/components/layout/AppHeader.vue';

const cartModal = ref<InstanceType<typeof CartModal> | null>(null)
</script>

<template>
  <div>
    <AppHeader @open-cart="cartModal?.openModal()" />
    <main>
      <NuxtPage />
    </main>
    <CartModal ref="cartModal" />
  </div>
</template>