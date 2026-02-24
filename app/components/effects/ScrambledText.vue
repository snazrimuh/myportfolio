<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  text: string
  speed?: number
  class?: string
  animateOnView?: boolean
  characters?: string
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  animateOnView: true,
  characters: '01アイウエオカキクケコ█▓░▒■□▲△▼▽◆◇○●$#@!?><{}[]|/\\=+-_~`^',
})

const displayText = ref(props.text.replace(/./g, ' '))
const containerRef = ref<HTMLElement | null>(null)

function scramble() {
  const original = props.text
  let iteration = 0

  const interval = setInterval(() => {
    displayText.value = original
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index < iteration) return original[index]
        return props.characters[Math.floor(Math.random() * props.characters.length)]
      })
      .join('')

    iteration += 1 / 3

    if (iteration >= original.length) {
      displayText.value = original
      clearInterval(interval)
    }
  }, props.speed)
}

onMounted(() => {
  if (!props.animateOnView) {
    scramble()
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        scramble()
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
  <span ref="containerRef" :class="props.class" class="font-mono">
    {{ displayText }}
  </span>
</template>
