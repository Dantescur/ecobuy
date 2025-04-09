<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb Navigation -->
      <nav class="mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700"
              >Home</NuxtLink
            >
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-900 font-medium">
            {{ product?.title || "Loading..." }}
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="pending" class="max-w-6xl mx-auto">
        <div class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-gray-200 rounded-lg aspect-square"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border-l-4 border-red-400 p-4" role="alert">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                Fallo al cargar detalles del producto. Por favor pruebe mas
                tarde.
              </p>
              <button
                @click="() => refreshData()"
                class="mt-2 text-sm text-red-700 hover:text-red-600 underline"
              >
                Pruebe de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Product Image Section -->
          <div class="relative">
            <div
              class="aspect-square bg-white rounded-lg overflow-hidden border shadow-sm"
              @mousemove="handleMouseMove"
              @mouseleave="isZoomed = false"
              ref="imageContainer"
            >
              <NuxtImg
                :src="product.image"
                :alt="product.title"
                class="w-full h-full object-contain p-8"
                :class="{ 'scale-150': isZoomed }"
                :style="zoomStyle"
                @error="handleImageError"
              />
            </div>
            <p class="text-sm text-gray-500 mt-2 text-center">Hover to zoom</p>
          </div>

          <!-- Product Info Section -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                {{ product.title }}
              </h1>
              <p class="text-sm text-gray-500 uppercase tracking-wide">
                {{ product.category }}
              </p>
            </div>

            <div class="flex items-center space-x-4">
              <p class="text-3xl font-bold text-green-600">
                {{ formatPrice(product.price) }}
              </p>
              <span
                v-if="product.rating"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                <svg
                  class="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                {{ product.rating.rate }} ({{ product.rating.count }} reviews)
              </span>
            </div>

            <p class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>

            <div class="border-t border-b py-4">
              <div class="flex items-center space-x-4">
                <label for="quantity" class="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div class="flex items-center border rounded-md">
                  <button
                    @click="quantity > 1 && quantity--"
                    class="px-3 py-1 text-gray-600 hover:text-gray-800"
                    :disabled="quantity <= 1"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    v-model="quantity"
                    min="1"
                    max="99"
                    class="w-16 text-center border-x py-1"
                  />
                  <button
                    @click="quantity < 99 && quantity++"
                    class="px-3 py-1 text-gray-600 hover:text-gray-800"
                    :disabled="quantity >= 99"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <button
                @click="addToCart(product)"
                class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                :disabled="isAddingToCart"
              >
                <span
                  v-if="isAddingToCart"
                  class="flex items-center justify-center"
                >
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Agregando al carro...
                </span>
                <span v-else>
                  Add to Cart - {{ formatPrice(product.price * quantity) }}
                </span>
              </button>

              <div
                v-if="showAddedToCart"
                class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                role="alert"
              >
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Agregado al carro satisfactoriamente!
                </div>
              </div>
            </div>

            <!-- Additional Product Info -->
            <div class="border-t pt-6 space-y-4">
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Envio gratis en ordenes por encima de $50
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Politica de devolucion de 30 días
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

const route = useRoute();
const quantity = ref(1);
const isAddingToCart = ref(false);
const showAddedToCart = ref(false);
const imageContainer = ref<HTMLElement | null>(null);
const isZoomed = ref(false);

const { elementX, elementY, isOutside } = useMouseInElement(imageContainer);

const zoomStyle = computed(() => {
  if (!isZoomed.value) return {};
  return {
    transformOrigin: `${elementX.value}px ${elementY.value}px`,
    transition: isOutside.value ? "transform 200ms ease" : "none",
  };
});

const handleMouseMove = () => {
  isZoomed.value = true;
};

const {
  data: product,
  pending,
  error,
  refresh: refreshData,
} = await useFetch<Product>(
  `https://fakestoreapi.com/products/${route.params.id}`,
);

const cartStore = useCartStore();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};

const handleImageError = (event: Event | string) => {
  if (typeof event !== "string") {
    const img = event.target as HTMLImageElement;
    img.src = "/placeholder-image.png";
  }
};

const addToCart = async (product: Product) => {
  isAddingToCart.value = true;
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    cartStore.addItem({ ...product, quantity: quantity.value });
    showAddedToCart.value = true;
    setTimeout(() => {
      showAddedToCart.value = false;
    }, 3000);
  } catch (error) {
    console.error("Failed to add to cart:", error);
  } finally {
    isAddingToCart.value = false;
  }
};
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

