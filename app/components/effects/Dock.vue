<script setup lang="ts">
import { ref, computed, type Component } from 'vue'

interface DockItem {
  icon: Component
  label: string
  href?: string
  onClick?: () => void
}

interface Props {
  items: DockItem[]
  magnification?: number
  distance?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  magnification: 60,
  distance: 140,
})

const mouseX = ref<number | null>(null)
const dockRef = ref<HTMLElement | null>(null)

function handleMouseMove(e: MouseEvent) {
  if (!dockRef.value) return
  const rect = dockRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
}

function handleMouseLeave() {
  mouseX.value = null
}

function getScale(index: number, itemCount: number) {
  if (mouseX.value === null || !dockRef.value) return 1

  const totalWidth = dockRef.value.clientWidth
  const itemCenter = (index + 0.5) * (totalWidth / itemCount)
  const dist = Math.abs(mouseX.value - itemCenter)
  const scale = Math.max(1, (props.magnification / 40) * Math.max(0, 1 - dist / props.distance) + 1)
  return scale
}
</script>

<template>
  <div
    ref="dockRef"
    :class="props.class"
    class="dock-container flex items-end gap-2 rounded-2xl border bg-background/80 px-4 pb-3 pt-3 backdrop-blur-md"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      v-for="(item, index) in items"
      :key="item.label"
      class="dock-item group relative flex flex-col items-center"
    >
      <!-- Tooltip -->
      <span
        class="absolute -top-8 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap"
      >
        {{ item.label }}
      </span>

      <component
        :is="item.href ? 'a' : 'button'"
        :href="item.href"
        :target="item.href ? '_blank' : undefined"
        class="flex items-center justify-center rounded-xl bg-muted/50 p-2 transition-all duration-200 hover:bg-muted"
        :style="{
          width: `${40 * getScale(index, items.length)}px`,
          height: `${40 * getScale(index, items.length)}px`,
        }"
        @click="item.onClick"
      >
        <component
          :is="item.icon"
          :size="20 * getScale(index, items.length)"
          class="text-foreground transition-all duration-200"
        />
      </component>
    </div>
  </div>
</template>
