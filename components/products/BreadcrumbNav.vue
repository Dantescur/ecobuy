<template>
  <nav class="mb-6 md:mb-8" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2 text-sm flex-wrap">
      <li>
        <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">{{ $t('home') }}</NuxtLink>
      </li>
      <li class="text-gray-400">/</li>
      <li class="text-gray-900 font-medium truncate max-w-xs">{{ productTitle || $t('loading') }}</li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  productTitle: { type: String, default: '' }
})
</script>