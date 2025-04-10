<template>
  <div class="relative">
    <button
      class="flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
      aria-label="Change language"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <Icon name="mdi:language" size="24" />
    </button>
    <Transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute right-0 mt-2 w-14 bg-white text-gray-800 rounded shadow-lg z-10"
      >
        <li v-for="locale in locales" :key="locale.code">
          <button
            @click="changeLocale(locale.code)"
            class="w-full text-left px-4 py-2 hover:bg-gray-600 focus:outline-none focus:bg-gray-300 rounded"
            :class="{ 'bg-gray-200': currentLocale === locale.code }"
          >
            {{ locale.code === 'en' ? '🇺🇸' : '🇪🇸' }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const currentLocale = computed(() => locale.value)
const isOpen = ref(false)

onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) isOpen.value = false
  })
})

const changeLocale = (code) => {
  setLocale(code)
  isOpen.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>