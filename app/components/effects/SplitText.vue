<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  text: string
  class?: string
  animateOnView?: boolean
  staggerDelay?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  animateOnView: true,
  staggerDelay: 30,
  duration: 600,
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(!props.animateOnView)

const characters = computed(() =>
  props.text.split('').map((char, i) => ({
    char: char === ' ' ? '\u00A0' : char,
    index: i,
  }))
)

onMounted(() => {
  if (!props.animateOnView) {
    isVisible.value = true
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})
</script>

<template>
  <span ref="containerRef" :class="props.class" class="split-text-container inline-flex flex-wrap">
    <span
      v-for="{ char, index } in characters"
      :key="index"
      class="split-char inline-block"
      :class="{ 'split-char-visible': isVisible }"
      :style="{
        transitionDelay: `${index * staggerDelay}ms`,
        transitionDuration: `${duration}ms`,
      }"
    >
      {{ char }}
    </span>
  </span>
</template>

<style scoped>
.split-text-container {
  /* Inherit gradient text styles from parent if any */
  -webkit-background-clip: inherit;
  background-clip: inherit;
}

.split-char {
  opacity: 0;
  transform: translateY(100%);
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  color: inherit;
}

.split-char-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
