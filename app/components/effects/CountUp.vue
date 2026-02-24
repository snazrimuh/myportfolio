<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

interface Props {
  target: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  class?: string
  animateOnView?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  decimals: 0,
  prefix: '',
  suffix: '',
  animateOnView: true,
})

const current = ref(0)
const containerRef = ref<HTMLElement | null>(null)
let startTimestamp: number | null = null
let animationId: number | null = null

const displayValue = computed(() => {
  return props.prefix + current.value.toFixed(props.decimals) + props.suffix
})

function animate(timestamp: number) {
  if (!startTimestamp) startTimestamp = timestamp
  const elapsed = timestamp - startTimestamp
  const progress = Math.min(elapsed / props.duration, 1)

  // Ease out cubic
  const eased = 1 - Math.pow(1 - progress, 3)
  current.value = eased * props.target

  if (progress < 1) {
    animationId = requestAnimationFrame(animate)
  }
}

function startAnimation() {
  startTimestamp = null
  current.value = 0
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!props.animateOnView) {
    startAnimation()
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startAnimation()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})
</script>

<template>
  <span ref="containerRef" :class="props.class">
    {{ displayValue }}
  </span>
</template>
