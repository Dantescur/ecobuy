<template>
  <Teleport to="body">
    <!-- Backdrop with fade animation -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[1000] backdrop-blur-sm" @click="closeModal"
        aria-hidden="true"></div>
    </Transition>

    <!-- Modal with slide animation -->
    <Transition name="slide-left">
      <div v-if="isOpen" class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-[1001]" role="dialog"
        aria-labelledby="cart-title" aria-modal="true" ref="modal" @keydown.esc="closeModal" tabindex="0">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b">
            <h2 id="cart-title" class="text-2xl font-bold">
              <span>
                {{ $t('cart') }}
              </span>
              <span v-show="itemCount > 0">
                ({{ itemCount }})
              </span>
            </h2>
            <button @click="closeModal"
              class="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart">
              <Icon name="mdi:close" size="24" />
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <Icon name="mdi:alert-circle" size="48" class="text-red-500 mx-auto mb-4" />
              <p class="text-red-500 text-lg mb-4">{{ error }}</p>
              <button @click="retryOperation"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Retry
              </button>
            </div>
          </div>

          <!-- Cart Content -->
          <div v-else class="flex-1 flex flex-col">
            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto px-6">
              <TransitionGroup name="list" tag="ul" v-if="cartItems.length" class="space-y-4 py-4">
                <li v-for="item in cartItems" :key="item.id"
                  class="flex gap-4 p-4 bg-white rounded-lg border shadow-sm">
                  <!-- Item Image -->
                  <div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <NuxtImg :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                  </div>

                  <!-- Item Details -->
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <h3 @click="closeModal" class="text-lg font-medium line-clamp-2">
                        <NuxtLink :to="`/products/${item.id}`">
                          {{ item.title }}
                        </NuxtLink>
                      </h3>
                      <button @click="removeFromCart(item.id)"
                        class="text-gray-400 hover:text-red-500 transition-colors" :aria-label="'Remove ' + item.title">
                        <Icon name="mdi:delete" size="20" />
                      </button>
                    </div>
                    <p class="text-gray-600 mt-1">{{ formatPrice(item.price) }} {{ $t('each') }}</p>

                    <!-- Quantity Selector -->
                    <div class="flex items-center mt-2 space-x-2">
                      <div class="flex items-center border rounded">
                        <button @click="updateQuantity(item.id, item.quantity - 1)"
                          class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          :disabled="item.quantity <= 1 || isUpdating"
                          :aria-label="'Decrease quantity of ' + item.title">
                          <Icon name="mdi:minus" size="16" />
                        </button>
                        <input type="number" v-model.number="item.quantity" @change="validateAndUpdateQuantity(item)"
                          min="1" max="99" class="w-12 text-center border-x" :disabled="isUpdating" />
                        <button @click="updateQuantity(item.id, item.quantity + 1)"
                          class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          :disabled="item.quantity >= 99 || isUpdating"
                          :aria-label="'Increase quantity of ' + item.title">
                          <Icon name="mdi:plus" size="16" />
                        </button>
                      </div>
                      <p class="font-semibold ml-auto">
                        {{ formatPrice(item.price * item.quantity) }}
                      </p>
                    </div>
                  </div>
                </li>
              </TransitionGroup>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center h-full py-12">
                <div class="bg-gray-100 rounded-full p-6 mb-4">
                  <Icon name="mdi:cart-off" size="48" class="text-gray-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('empty') }}</h3>
                <p class="text-gray-600 mb-6 text-center">
                  {{ $t('emptymsg') }}
                </p>
                <NuxtLink to="/" @click="closeModal"
                  class="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                  {{ $t('shop') }}
                </NuxtLink>
              </div>
            </div>

            <!-- Cart Summary -->
            <div v-if="cartItems.length" class="border-t bg-gray-50 p-6">
              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tax ({{ TAX_RATE * 100 }}%)</span>
                  <span>{{ formatPrice(taxAmount) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{{ formatPrice(shippingCost) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>{{ $t('total') }}</span>
                  <span>{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>
              <button
                class="w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="checkout" :disabled="isCheckingOut">
                <span v-if="isCheckingOut">
                  <Icon name="mdi:loading" class="animate-spin" /> {{ $t('load') }}
                </span>
                <span v-else>{{ $t('checkout') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

// State
const isOpen = ref(false)
const modal = ref(null)
const isLoading = ref(false)
const isUpdating = ref(false)
const isCheckingOut = ref(false)
const error = ref(null)
const isSmallScreen = ref(false)

// Constants
const TAX_RATE = 0.1
const SHIPPING_COST = 5.99
const SM_BREAKPOINT = 640

// Store
const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const itemCount = computed(() => cartStore.itemCount)

// Computed
const subtotal = computed(() =>
  cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
)
const taxAmount = computed(() => subtotal.value * TAX_RATE)
const shippingCost = computed(() => cartItems.value.length ? SHIPPING_COST : 0)
const totalPrice = computed(() => subtotal.value + taxAmount.value + shippingCost.value)

// Methods
const openModal = () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden'

  if (isSmallScreen.value && import.meta.client) {
    window.history.pushState({ modal: 'cart' }, '', window.location.href)
  }
}

const closeModal = () => {
  isOpen.value = false
  document.body.style.overflow = ''

  if (isSmallScreen.value && import.meta.client && window.history.state.modal === 'cart') {
    window.history.back()
  }
}

const handlePopstate = () => {
  if (isOpen.value && isSmallScreen.value) {
    closeModal()
  }
}

const removeFromCart = async (id) => {
  try {
    isUpdating.value = true
    error.value = null
    await cartStore.removeItem(id)
  } catch (err) {
    error.value = 'Failed to remove item from cart'
  } finally {
    isUpdating.value = false
  }
}

const updateQuantity = async (id, quantity) => {
  if (quantity < 1 || quantity > 99) return

  try {
    isUpdating.value = true
    error.value = null
    await cartStore.updateQuantity(id, quantity)
  } catch (err) {
    error.value = 'Failed to update quantity'
  } finally {
    isUpdating.value = false
  }
}

const validateAndUpdateQuantity = (item) => {
  const quantity = Math.min(Math.max(1, item.quantity), 99)
  updateQuantity(item.id, quantity)
}

const checkout = async () => {
  try {
    isCheckingOut.value = true
    error.value = null
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Checkout successful!')
    closeModal()
  } catch (err) {
    error.value = 'Checkout failed. Please try again.'
  } finally {
    isCheckingOut.value = false
  }
}

const retryOperation = () => {
  error.value = null
  // Implement retry logic based on the failed operation
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth < SM_BREAKPOINT
}

onMounted(() => {
  if (import.meta.client) {
    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen.value) closeModal()
  })

  window.addEventListener('popstate', handlePopstate)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  if (import.meta.client) {
    window.removeEventListener('resize', checkScreenSize)
    window.removeEventListener('popstate', handlePopstate)
    window.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen.value) closeModal()
    })
  }
})

watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => modal.value?.focus())
  }
})

defineExpose({ openModal })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

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