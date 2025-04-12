<template>
  <div class="space-y-4">
    <button @click="$emit('click')"
      class="w-full bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 text-sm md:text-base"
      :disabled="isAdding">
      <span v-if="isAdding" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {{ $t('adding') }}
      </span>
      <span v-else>
        {{ $t('add') }} - {{ formatPrice(price * quantity) }}
      </span>
    </button>
    <div v-if="showAdded"
      class="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm"
      role="alert">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        {{ $t('added') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  price: number,
  quantity: number
  isAdding?: boolean
  showAdded?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()


const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}
</script>