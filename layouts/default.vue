<template>
  <div>
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl">{{ $t('name') }}</h1>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-white hover:underline">{{ $t('home')}}</NuxtLink>
        <div class="relative">
          <button class="flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          aria-label="Change language"
          aria-haspopup="true"
          @click="isLocaleOpen = !isLocaleOpen"
          :aria-expanded="isLocaleOpen" >
          <Icon name="mdi:language" size="24" />
          </button>
          <Transition name="fade">
            <ul
              v-if="isLocaleOpen"
              class="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded shadow-lg z-10"
            >
              <li v-for="locale in locales" :key="locale.code">
                <button
                  @click="setLocale(locale.code)"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  :class="{ 'bg-gray-200': currentLocale === locale.code }"
                >
                  {{ locale.code }}
                </button>
              </li>
            </ul>
          </Transition>
        </div>
        <button
          @click="cartModal?.openModal()"
          class="relative flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          aria-label="Open cart"
        >
          <Icon name="mdi:cart" size="24" />
          <span v-if="itemCount" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ itemCount }}
          </span>
        </button>
      </div>
    </header>
    <main>
      <NuxtPage />
    </main>
    <CartModal ref="cartModal" />
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)
const cartModal = ref(null)

const { locale, locales, setLocale } = useI18n()
const currentLocale = computed(() => locale.value)
const isLocaleOpen = ref(false)

onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) isLocaleOpen.value = false
  })
})

const handleLocaleChange = (code) => {
  setLocale(code)
  isLocaleOpen.value = false
}

</script>

<style scoped>
/* Fade animation for locale dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>