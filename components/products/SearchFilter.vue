<template>
  <div class="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
    <div class="relative flex-1 max-w-md">
      <input
        v-model="search"
        type="search"
        :placeholder="$t('search')"
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <span class="absolute left-3 top-2.5 text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
    </div>
    <select
      v-model="category"
      class="block w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="">Categorias</option>
      <option v-for="cat in categories" :key="cat" :value="cat">
        {{ formatCategory(cat) }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] }
})
const search = defineModel('search', { type: String, default: '' })
const category = defineModel('category', { type: String, default: '' })

const formatCategory = (category) => {
  return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
</script>