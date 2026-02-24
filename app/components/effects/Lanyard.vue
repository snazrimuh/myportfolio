<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  badgeImage?: string
  title?: string
  subtitle?: string
  strapColor?: string
  badgeBg?: string
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  badgeImage: '',
  title: 'Full Stack',
  subtitle: 'Web Development',
  strapColor: '#00ff41',
  badgeBg: '#0a1a0f',
  accentColor: '#00ff41',
})

// Canvas and DOM refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const badgeRef = ref<HTMLDivElement | null>(null)

// Rope simulation
const SEGMENTS = 15
const SEGMENT_LENGTH = 22
const GRAVITY = 0.45
const DAMPING = 0.99
const ITERATIONS = 12

interface Point {
  x: number
  y: number
  oldX: number
  oldY: number
  pinned: boolean
}

let points: Point[] = []
let dragging = false
let dragIndex = -1
let mouseX = 0
let mouseY = 0
let animationId = 0
let canvasWidth = 0
let canvasHeight = 0

// Badge position for the HTML badge overlay
const badgeX = ref(0)
const badgeY = ref(0)
const badgeAngle = ref(0)

function initRope() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height

  const startX = canvasWidth / 2
  const startY = 0

  points = []
  for (let i = 0; i <= SEGMENTS; i++) {
    points.push({
      x: startX,
      y: startY + i * SEGMENT_LENGTH,
      oldX: startX,
      oldY: startY + i * SEGMENT_LENGTH,
      pinned: i === 0,
    })
  }
}

function simulate() {
  // Apply verlet integration
  for (const p of points) {
    if (p.pinned) continue
    const vx = (p.x - p.oldX) * DAMPING
    const vy = (p.y - p.oldY) * DAMPING
    p.oldX = p.x
    p.oldY = p.y
    p.x += vx
    p.y += vy + GRAVITY
  }

  // If dragging, move the dragged point
  if (dragging && dragIndex >= 0) {
    points[dragIndex]!.x = mouseX
    points[dragIndex]!.y = mouseY
  }

  // Solve constraints
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = points[i]!
      const b = points[i + 1]!
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist === 0) continue
      const diff = (SEGMENT_LENGTH - dist) / dist / 2
      const offsetX = dx * diff
      const offsetY = dy * diff
      if (!a.pinned) {
        a.x -= offsetX
        a.y -= offsetY
      }
      if (!b.pinned) {
        b.x += offsetX
        b.y += offsetY
      }
    }
    // Pin first point
    points[0]!.x = canvasWidth / 2
    points[0]!.y = 0
  }

  // Keep within horizontal bounds
  for (const p of points) {
    if (p.pinned) continue
    if (p.x < 10) p.x = 10
    if (p.x > canvasWidth - 10) p.x = canvasWidth - 10
    if (p.y < 0) p.y = 0
  }
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Draw strap/lanyard
  if (points.length < 2) return

  // Outer glow pass
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(points[0]!.x, points[0]!.y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y)
  }
  ctx.shadowColor = 'rgba(0, 255, 65, 0.7)'
  ctx.shadowBlur = 18
  ctx.strokeStyle = 'rgba(0, 255, 65, 0.35)'
  ctx.lineWidth = 20
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()
  ctx.restore()

  // Strap shadow
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 3

  // Draw strap as a thick path with texture lines
  ctx.beginPath()
  ctx.moveTo(points[0]!.x, points[0]!.y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y)
  }
  ctx.strokeStyle = props.strapColor
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()
  ctx.restore()

  // Strap inner highlight
  ctx.beginPath()
  ctx.moveTo(points[0]!.x, points[0]!.y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y)
  }
  ctx.strokeStyle = 'rgba(180, 255, 200, 0.35)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke()

  // Strap text pattern
  for (let i = 2; i < points.length - 1; i += 3) {
    const p = points[i]!
    const prev = points[i - 1]!
    const angle = Math.atan2(p.y - prev.y, p.x - prev.x)
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(angle)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.font = 'bold 6px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FSP', 0, 0)
    ctx.restore()
  }

  // Draw clip/connector at the end
  const last = points[points.length - 1]!
  const secondLast = points[points.length - 2]!
  const clipAngle = Math.atan2(last.y - secondLast.y, last.x - secondLast.x)

  ctx.save()
  ctx.translate(last.x, last.y)
  ctx.rotate(clipAngle)

  // Metal clip
  ctx.beginPath()
  ctx.arc(0, 0, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#00cc33'
  ctx.fill()
  ctx.strokeStyle = '#00ff41'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0,255,65,0.8)'
  ctx.shadowBlur = 10
  ctx.stroke()

  // Inner hole
  ctx.beginPath()
  ctx.arc(0, 0, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#050a05'
  ctx.fill()
  ctx.restore()

  // Update badge position
  badgeX.value = last.x
  badgeY.value = last.y
  badgeAngle.value = clipAngle * (180 / Math.PI) - 90
}

function loop() {
  simulate()
  render()
  animationId = requestAnimationFrame(loop)
}

// Mouse/touch interaction
function getCanvasPos(e: MouseEvent | Touch): { x: number; y: number } {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function findClosestPoint(x: number, y: number): number {
  let minDist = Infinity
  let idx = -1
  for (let i = 0; i < points.length; i++) {
    const dx = points[i]!.x - x
    const dy = points[i]!.y - y
    const dist = dx * dx + dy * dy
    if (dist < minDist) {
      minDist = dist
      idx = i
    }
  }
  // Only grab if close enough (within 40px)
  return minDist < 40 * 40 ? idx : -1
}

function onPointerDown(e: MouseEvent) {
  const pos = getCanvasPos(e)
  mouseX = pos.x
  mouseY = pos.y

  // Check if click is within the visible badge card bounds
  if (badgeRef.value) {
    const badgeRect = badgeRef.value.getBoundingClientRect()
    if (
      e.clientX >= badgeRect.left && e.clientX <= badgeRect.right &&
      e.clientY >= badgeRect.top  && e.clientY <= badgeRect.bottom
    ) {
      dragIndex = points.length - 1
      dragging = true
      return
    }
  }

  const idx = findClosestPoint(pos.x, pos.y)
  if (idx >= 0 && !points[idx]!.pinned) {
    dragIndex = idx
    dragging = true
  }
}

function onPointerMove(e: MouseEvent) {
  if (!dragging) return
  const pos = getCanvasPos(e)
  mouseX = pos.x
  mouseY = pos.y
}

function onPointerUp() {
  dragging = false
  dragIndex = -1
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 0) return
  const touch = e.touches[0]!
  const pos = getCanvasPos(touch)
  mouseX = pos.x
  mouseY = pos.y

  // Check if touch is within the visible badge card bounds
  if (badgeRef.value) {
    const badgeRect = badgeRef.value.getBoundingClientRect()
    if (
      touch.clientX >= badgeRect.left && touch.clientX <= badgeRect.right &&
      touch.clientY >= badgeRect.top  && touch.clientY <= badgeRect.bottom
    ) {
      dragIndex = points.length - 1
      dragging = true
      e.preventDefault()
      return
    }
  }

  const idx = findClosestPoint(pos.x, pos.y)
  if (idx >= 0 && !points[idx]!.pinned) {
    dragIndex = idx
    dragging = true
    e.preventDefault()
  }
}

function onTouchMove(e: TouchEvent) {
  if (!dragging || e.touches.length === 0) return
  e.preventDefault()
  const pos = getCanvasPos(e.touches[0]!)
  mouseX = pos.x
  mouseY = pos.y
}

function onTouchEnd() {
  dragging = false
  dragIndex = -1
}

function handleResize() {
  if (!containerRef.value || !canvasRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height
  canvasRef.value.width = canvasWidth
  canvasRef.value.height = canvasHeight
  // Re-pin the anchor
  if (points.length > 0) {
    points[0]!.x = canvasWidth / 2
    points[0]!.oldX = canvasWidth / 2
  }
}

const badgeStyle = computed(() => ({
  transform: `translate(-50%, 0) rotate(${badgeAngle.value}deg)`,
  left: `${badgeX.value}px`,
  top: `${badgeY.value + 8}px`,
}))

onMounted(() => {
  if (!containerRef.value || !canvasRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  canvasWidth = rect.width
  canvasHeight = rect.height
  canvasRef.value.width = canvasWidth
  canvasRef.value.height = canvasHeight

  initRope()
  loop()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    ref="containerRef"
    class="lanyard-container"
    @mousedown="onPointerDown"
    @mousemove="onPointerMove"
    @mouseup="onPointerUp"
    @mouseleave="onPointerUp"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <canvas ref="canvasRef" class="lanyard-canvas" />

    <!-- Badge card overlay -->
    <div
      ref="badgeRef"
      class="lanyard-badge"
      :style="badgeStyle"
    >
      <div class="badge-inner">
        <!-- Photo area -->
        <div class="badge-photo">
          <img
            v-if="props.badgeImage"
            :src="props.badgeImage"
            alt="Profile"
            class="badge-photo-img"
          />
          <div v-else class="badge-photo-placeholder">
            <svg viewBox="0 0 80 80" fill="none" class="w-full h-full">
              <circle cx="40" cy="30" r="14" fill="rgba(255,255,255,0.6)" />
              <ellipse cx="40" cy="62" rx="22" ry="16" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
        </div>

        <!-- Text area -->
        <div class="badge-text">
          <span class="badge-title">{{ props.title }}</span>
          <span class="badge-subtitle">{{ props.subtitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lanyard-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.lanyard-container:active {
  cursor: grabbing;
}

.lanyard-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lanyard-badge {
  position: absolute;
  pointer-events: none;
  transform-origin: top center;
  z-index: 2;
  filter:
    drop-shadow(0 0 12px rgba(0, 255, 65, 0.6))
    drop-shadow(0 0 28px rgba(0, 255, 65, 0.3))
    drop-shadow(0 16px 40px rgba(0, 0, 0, 0.7));
}

.badge-inner {
  width: 280px;
  background: v-bind('props.badgeBg');
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1.5px solid rgba(0, 255, 65, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 22px 24px;
  gap: 16px;
  box-shadow:
    0 0 0 1px rgba(0, 255, 65, 0.08),
    0 0 30px rgba(0, 255, 65, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(0, 255, 65, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.badge-photo {
  width: 200px;
  height: 230px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid rgba(0, 255, 65, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.6) brightness(1.1);
}

.badge-photo-placeholder {
  width: 100px;
  height: 100px;
  opacity: 0.7;
}

.badge-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.badge-title {
  font-size: 15px;
  font-weight: 700;
  color: #050a05;
  background: v-bind('props.accentColor');
  padding: 7px 22px;
  border-radius: 8px;
  letter-spacing: 0.08em;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(0,0,0,0.4);
  box-shadow: 0 0 16px rgba(0, 255, 65, 0.4);
}

.badge-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.01em;
  margin-top: 2px;
  text-align: center;
  white-space: nowrap;
}

/* Responsive badge size */
@media (min-width: 640px) {
  .badge-inner {
    width: 320px;
    padding: 32px 26px 28px;
    gap: 18px;
  }

  .badge-photo {
    width: 240px;
    height: 275px;
    border-radius: 16px;
  }

  .badge-title {
    font-size: 16px;
    padding: 8px 26px;
  }

  .badge-subtitle {
    font-size: 15px;
  }
}
</style>
