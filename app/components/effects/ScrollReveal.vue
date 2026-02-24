<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  text: string
  class?: string
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 0.2,
})

const containerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const words = props.text.split(' ')

function handleScroll() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const viewH = window.innerHeight
  const start = viewH
  const end = -rect.height
  const raw = 1 - (rect.top - end) / (start - end)
  progress.value = Math.max(0, Math.min(1, raw))
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function wordOpacity(index: number) {
  const wordProgress = index / words.length
  const revealPoint = progress.value * 1.5
  if (wordProgress < revealPoint - 0.1) return 1
  if (wordProgress > revealPoint + 0.1) return 0.15
  return 0.15 + 0.85 * (1 - (wordProgress - revealPoint + 0.1) / 0.2)
}
</script>

<template>
  <span ref="containerRef" :class="props.class" class="inline-flex flex-wrap">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="inline-block mr-[0.25em] transition-opacity duration-200"
      :style="{ opacity: wordOpacity(i) }"
    >
      {{ word }}
    </span>
  </span>
</template>
