<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { type HTMLAttributes, computed } from 'vue'
import { buttonVariants, type ButtonVariants } from '.'
import { cn } from '~/lib/utils'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  as?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <Primitive
    :as="as"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
