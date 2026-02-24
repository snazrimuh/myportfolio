<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}>(), {
  orientation: 'horizontal',
  decorative: true,
})

const classes = computed(() =>
  cn(
    'shrink-0 bg-border',
    props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    props.class,
  ),
)
</script>

<template>
  <div
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="!decorative ? orientation : undefined"
    :class="classes"
  />
</template>
