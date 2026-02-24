<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function handleScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? scrollTop / docHeight : 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 z-60 h-0.5 bg-primary transition-all duration-100 ease-out"
    :style="{ width: `${progress * 100}%` }"
  />
</template>
