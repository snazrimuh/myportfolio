<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  text: string
  delay?: number
  duration?: number
  class?: string
  animateOnView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 1000,
  animateOnView: true,
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(!props.animateOnView)

const words = computed(() => props.text.split(' '))

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
  <span ref="containerRef" :class="props.class" class="inline-flex flex-wrap">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="blur-text-word inline-block mr-[0.25em]"
      :class="{ 'blur-text-visible': isVisible }"
      :style="{
        transitionDelay: `${delay + (i * duration) / words.length}ms`,
        transitionDuration: `${duration / words.length}ms`,
      }"
    >
      {{ word }}
    </span>
  </span>
</template>

<style scoped>
.blur-text-word {
  filter: blur(10px);
  opacity: 0;
  transition-property: filter, opacity;
  transition-timing-function: ease-out;
}

.blur-text-visible {
  filter: blur(0);
  opacity: 1;
}
</style>
