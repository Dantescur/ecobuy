<template>
  <div class="border-t border-b py-4">
    <div class="flex items-center space-x-4">
      <label for="quantity" class="text-sm font-medium text-gray-700">{{ $t('qty') }}</label>
      <div class="flex items-center border rounded-md">
        <button @click="updateQuantity(quantity - 1)" class="px-2 md:px-3 py-1 text-gray-600 hover:text-gray-800"
          :disabled="quantity <= 1">
          -
        </button>
        <input type="number" id="quantity" v-model="quantity" @input="handleInput" min="1" max="99"
          class="w-12 md:w-16 text-center border-x py-1 text-sm" />
        <button @click="updateQuantity(quantity + 1)" class="px-2 md:px-3 py-1 text-gray-600 hover:text-gray-800"
          :disabled="quantity >= 99">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quantity = defineModel<number>('quantity', { default: 1 })

const emit = defineEmits(['update:quantity'])

const updateQuantity = (newValue: number) => {
  const validatedValue = Math.max(1, Math.min(newValue, 99))
  quantity.value = validatedValue
  emit('update:quantity', validatedValue)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)
  updateQuantity(isNaN(value) ? 1 : value)
}
</script>
