<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  /** CSS selector or 'window' to watch for scroll */
  class?: string
  /** Glitch duration in ms when triggered */
  duration?: number
  /** Cooldown between glitch triggers in ms */
  cooldown?: number
  /** Scroll threshold (pixels moved) to trigger glitch */
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 300,
  cooldown: 800,
  threshold: 50,
})

const containerRef = ref<HTMLElement | null>(null)
const isGlitching = ref(false)
let lastScrollY = 0
let cooldownTimer: ReturnType<typeof setTimeout> | null = null
let canGlitch = true

function triggerGlitch() {
  if (!canGlitch) return
  canGlitch = false
  isGlitching.value = true

  setTimeout(() => {
    isGlitching.value = false
  }, props.duration)

  cooldownTimer = setTimeout(() => {
    canGlitch = true
  }, props.cooldown)
}

function handleScroll() {
  const currentY = window.scrollY
  const delta = Math.abs(currentY - lastScrollY)

  if (delta > props.threshold) {
    triggerGlitch()
  }

  lastScrollY = currentY
}

onMounted(() => {
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (cooldownTimer) clearTimeout(cooldownTimer)
})
</script>

<template>
  <div
    ref="containerRef"
    :class="[props.class, 'scroll-glitch', { 'scroll-glitch-active': isGlitching }]"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-glitch {
  position: relative;
}

.scroll-glitch-active {
  animation: scroll-glitch-distort 0.3s linear;
}

.scroll-glitch-active::before,
.scroll-glitch-active::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.scroll-glitch-active::before {
  background: linear-gradient(
    transparent 0%,
    hsl(120 100% 65% / 0.03) 20%,
    transparent 21%,
    transparent 40%,
    hsl(180 100% 50% / 0.04) 41%,
    transparent 42%,
    transparent 65%,
    hsl(300 100% 60% / 0.03) 66%,
    transparent 67%,
    transparent 100%
  );
  animation: scroll-glitch-bars 0.3s linear;
}

.scroll-glitch-active::after {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    hsl(120 100% 65% / 0.015) 2px,
    hsl(120 100% 65% / 0.015) 4px
  );
  mix-blend-mode: overlay;
}

@keyframes scroll-glitch-distort {
  0%   { transform: translate(0, 0) skew(0deg); filter: none; }
  10%  { transform: translate(-2px, 0) skew(-0.5deg); filter: hue-rotate(10deg); }
  20%  { transform: translate(3px, 0) skew(0.8deg); filter: hue-rotate(-5deg) saturate(1.2); }
  30%  { transform: translate(-1px, 1px) skew(-0.3deg); filter: hue-rotate(15deg); }
  40%  { transform: translate(2px, -1px) skew(0.5deg); filter: none; }
  50%  { transform: translate(0, 0) skew(0deg); filter: saturate(1.5) brightness(1.1); }
  60%  { transform: translate(1px, 0) skew(-0.4deg); filter: hue-rotate(-10deg); }
  70%  { transform: translate(-3px, 0) skew(0.6deg); filter: none; }
  80%  { transform: translate(2px, 1px) skew(-0.2deg); filter: hue-rotate(5deg); }
  90%  { transform: translate(-1px, 0) skew(0.3deg); filter: saturate(1.3); }
  100% { transform: translate(0, 0) skew(0deg); filter: none; }
}

@keyframes scroll-glitch-bars {
  0%   { opacity: 0; transform: translateY(0); }
  20%  { opacity: 1; transform: translateY(-5%); }
  40%  { opacity: 0.5; transform: translateY(3%); }
  60%  { opacity: 1; transform: translateY(-2%); }
  80%  { opacity: 0.3; transform: translateY(1%); }
  100% { opacity: 0; transform: translateY(0); }
}
</style>
