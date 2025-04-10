<template>
  <div class="relative">
    <div class="aspect-square bg-white rounded-lg overflow-hidden border shadow-sm" @mousemove="handleMouseMove"
      @mouseleave="isZoomed = false" ref="imageContainer">
      <NuxtImg placeholder :src="image" :alt="title" class="w-full h-full object-contain p-4 md:p-8"
        :class="{ 'scale-150': isZoomed }" :style="zoomStyle" densities="x1 x2" @error="handleImageError" />
    </div>
    <p class="text-sm text-gray-500 mt-2 text-center hidden md:block">{{ $t('image') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true }
})

const imageContainer = ref(null)
const isZoomed = ref(false)
const { elementX, elementY, isOutside } = useMouseInElement(imageContainer)

const zoomStyle = computed(() => {
  if (!isZoomed.value) return {}
  return {
    transformOrigin: `${elementX.value}px ${elementY.value}px`,
    transition: isOutside.value ? 'transform 200ms ease' : 'none',
  }
})

const handleMouseMove = () => {
  isZoomed.value = true
}

const handleImageError = (event: Event | string) => {
  if (typeof event !== "string") {
    const img = event.target as HTMLImageElement;
    img.src = "/placeholder-image.png";
  }
};
</script>