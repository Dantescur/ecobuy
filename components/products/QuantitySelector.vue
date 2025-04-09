<template>
  <div class="border-t border-b py-4">
    <div class="flex items-center space-x-4">
      <label for="quantity" class="text-sm font-medium text-gray-700">{{ $t('qty') }}</label>
      <div class="flex items-center border rounded-md">
        <button
          @click="updateQuantity(quantity - 1)"
          class="px-2 md:px-3 py-1 text-gray-600 hover:text-gray-800"
          :disabled="quantity <= 1"
        >
          -
        </button>
        <input
          type="number"
          id="quantity"
          :value="quantity"
          @input="handleInput"
          min="1"
          max="99"
          class="w-12 md:w-16 text-center border-x py-1 text-sm"
        />
        <button
          @click="updateQuantity(quantity + 1)"
          class="px-2 md:px-3 py-1 text-gray-600 hover:text-gray-800"
          :disabled="quantity >= 99"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quantity = defineModel<number>({ default: 1 })

const updateQuantity = (newValue: number) => {
  if (newValue >= 1 && newValue <= 99) {
    quantity.value = newValue
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateQuantity(Number(target.value))
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
