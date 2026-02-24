<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const cardRef = ref<HTMLElement | null>(null)
const glowRef = ref<HTMLElement | null>(null)
let bounds: DOMRect | null = null

function rotateCard(e: MouseEvent) {
  if (!cardRef.value || !bounds) return
  const mouseX = e.clientX
  const mouseY = e.clientY
  const leftX = mouseX - bounds.x
  const topY = mouseY - bounds.y
  const center = { x: leftX - bounds.width / 2, y: topY - bounds.height / 2 }
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2)

  cardRef.value.style.transform = `
    scale3d(1.03, 1.03, 1.03)
    rotate3d(${center.y / 100}, ${-center.x / 100}, 0, ${Math.log(distance) * 2}deg)
  `

  if (glowRef.value) {
    glowRef.value.style.backgroundImage = `
      radial-gradient(
        circle at ${center.x * 2 + bounds.width / 2}px ${center.y * 2 + bounds.height / 2}px,
        rgba(255,255,255,0.15),
        transparent 50%
      )
    `
  }
}

function resetCard() {
  if (!cardRef.value) return
  cardRef.value.style.transform = ''
  if (glowRef.value) {
    glowRef.value.style.backgroundImage = ''
  }
}

function updateBounds() {
  if (cardRef.value) {
    bounds = cardRef.value.getBoundingClientRect()
  }
}

onMounted(() => {
  updateBounds()
  window.addEventListener('resize', updateBounds)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBounds)
})
</script>

<template>
  <div
    ref="cardRef"
    :class="props.class"
    class="profile-card relative overflow-hidden rounded-2xl border bg-card shadow-lg transition-transform duration-200 ease-out"
    style="perspective: 1000px; transform-style: preserve-3d"
    @mousemove="rotateCard"
    @mouseleave="resetCard"
    @mouseenter="updateBounds"
  >
    <div ref="glowRef" class="pointer-events-none absolute inset-0 z-10" />
    <slot />
  </div>
</template>

<style scoped>
.profile-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
