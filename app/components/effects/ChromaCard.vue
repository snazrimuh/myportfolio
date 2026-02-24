<script setup lang="ts">
interface Props {
  spotlightX?: number
  spotlightY?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  spotlightX: 0,
  spotlightY: 0,
})

const cardRef = ref<HTMLElement | null>(null)

const spotlightStyle = computed(() => {
  if (!cardRef.value) return {}
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect) return {}
  const x = props.spotlightX - rect.left
  const y = props.spotlightY - rect.top
  return {
    background: `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`,
  }
})
</script>

<template>
  <div
    ref="cardRef"
    :class="props.class"
    class="chroma-card group relative overflow-hidden rounded-xl border border-white/10 bg-card transition-all duration-300 hover:border-white/20"
  >
    <div
      class="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
      :style="spotlightStyle"
    />
    <slot />
  </div>
</template>
