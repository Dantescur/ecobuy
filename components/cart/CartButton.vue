<template>
  <button
    @click="handleClick"
    class="relative flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
    :aria-label="$t('cart')"
  >
    <Icon name="mdi:cart" size="24" />
    <span
      v-if="itemCount"
      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
    >
      {{ itemCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  itemCount: { type: Number, default: 0 }
})

const emit = defineEmits<{
  (e: 'openCart'): void
}>()

function handleClick() {
  emit('openCart')
}

</script>