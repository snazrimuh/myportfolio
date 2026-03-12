<script setup lang="ts">
import createGlobe from 'cobe'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  let phi = 1.8

  const globe = createGlobe(canvasRef.value, {
    devicePixelRatio: 2,
    width: 600,
    height: 600,
    phi,
    theta: 0.15,
    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.3, 0.3, 0.3],
    markerColor: [0.4, 0.7, 1],
    glowColor: [0.12, 0.12, 0.35],
    markers: [
      { location: [-6.178, 106.630], size: 0.07 },
    ],
    onRender(state) {
      phi += 0.003
      state.phi = phi
      // Pulse the marker by varying its size
      state.markers = [
        { location: [-6.178, 106.630], size: 0.05 + 0.025 * Math.abs(Math.sin(Date.now() / 500)) },
      ]
    },
  })

  onUnmounted(() => globe.destroy())
})
</script>

<template>
  <div class="minimal-card rounded-2xl p-4 flex flex-col items-center gap-3 h-full">
    <!-- Location label -->
    <div class="flex items-center gap-2 self-start">
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span class="text-sm font-medium text-foreground">Tangerang, Indonesia</span>
    </div>
    <!-- Globe: square, fills remaining space -->
    <div class="flex-1 flex items-center justify-center w-full min-h-0">
      <canvas
        ref="canvasRef"
        class="opacity-90 block"
        style="width: min(100%, 100%); aspect-ratio: 1"
        width="600"
        height="600"
      />
    </div>
  </div>
</template>
