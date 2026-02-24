<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const mousePos = ref({ x: 0, y: 0 })

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="chroma-grid relative grid gap-4"
    @mousemove="handleMouseMove"
  >
    <slot :mouse="mousePos" />
  </div>
</template>
