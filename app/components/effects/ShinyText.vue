<script setup lang="ts">
interface Props {
  text: string
  speed?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  speed: 2,
})
</script>

<template>
  <span
    :class="props.class"
    class="shiny-text"
    :style="{ '--shiny-speed': `${speed}s` }"
  >
    {{ text }}
  </span>
</template>

<style scoped>
.shiny-text {
  color: var(--color-primary);
  background-image: linear-gradient(
    120deg,
    transparent 40%,
    hsl(120 100% 85% / 0.9) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shiny var(--shiny-speed, 2s) ease-in-out infinite;
}

@keyframes shiny {
  0% {
    background-position: 100% center;
  }
  100% {
    background-position: -100% center;
  }
}
</style>
