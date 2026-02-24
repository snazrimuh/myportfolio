<script setup lang="ts">
interface Props {
  text: string
  class?: string
  /** Continuously animate or only on hover */
  continuous?: boolean
  /** Glitch intensity: 'low' | 'medium' | 'high' */
  intensity?: 'low' | 'medium' | 'high'
  /** Animation speed in seconds */
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  continuous: false,
  intensity: 'medium',
  speed: 3,
})
</script>

<template>
  <span
    :class="[
      props.class,
      'glitch-text',
      `glitch-${intensity}`,
      { 'glitch-continuous': continuous, 'glitch-hover': !continuous },
    ]"
    :data-text="text"
    :style="{ '--glitch-speed': `${speed}s` }"
  >
    {{ text }}
  </span>
</template>

<style scoped>
.glitch-text {
  position: relative;
  display: inline-block;
  font-family: var(--font-retro);
}

/* Pseudo layers for chromatic aberration */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}

.glitch-text::before {
  color: hsl(180 100% 50%); /* cyan */
  z-index: -1;
}

.glitch-text::after {
  color: hsl(300 100% 60%); /* magenta */
  z-index: -1;
}

/* Continuous glitch */
.glitch-continuous::before {
  opacity: 0.8;
  animation: glitch-before var(--glitch-speed, 3s) infinite linear alternate-reverse;
}
.glitch-continuous::after {
  opacity: 0.8;
  animation: glitch-after var(--glitch-speed, 3s) infinite linear alternate-reverse;
}
.glitch-continuous {
  animation: glitch-skew var(--glitch-speed, 3s) infinite linear alternate-reverse;
}

/* Hover glitch */
.glitch-hover:hover::before {
  opacity: 0.8;
  animation: glitch-before 0.4s infinite linear alternate-reverse;
}
.glitch-hover:hover::after {
  opacity: 0.8;
  animation: glitch-after 0.4s infinite linear alternate-reverse;
}
.glitch-hover:hover {
  animation: glitch-skew 0.5s infinite linear alternate-reverse;
}

/* Intensity — clip offsets */
.glitch-low::before { clip-path: inset(20% 0 60% 0); }
.glitch-low::after  { clip-path: inset(60% 0 10% 0); }

.glitch-medium::before { clip-path: inset(10% 0 50% 0); }
.glitch-medium::after  { clip-path: inset(50% 0 5% 0); }

.glitch-high::before { clip-path: inset(5% 0 30% 0); }
.glitch-high::after  { clip-path: inset(40% 0 2% 0); }

@keyframes glitch-before {
  0%   { clip-path: inset(40% 0 35% 0); transform: translate(-3px, 1px); }
  5%   { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
  10%  { clip-path: inset(70% 0 5% 0);  transform: translate(-1px, 2px); }
  15%  { clip-path: inset(20% 0 50% 0); transform: translate(1px, 0px); }
  20%  { clip-path: inset(80% 0 2% 0);  transform: translate(-2px, -1px); }
  25%  { clip-path: inset(5% 0 70% 0);  transform: translate(3px, 1px); }
  30%  { clip-path: inset(55% 0 20% 0); transform: translate(-1px, -2px); }
  35%  { clip-path: inset(15% 0 65% 0); transform: translate(2px, 0px); }
  40%  { clip-path: inset(45% 0 30% 0); transform: translate(0px, 1px); }
  45%  { clip-path: inset(75% 0 8% 0);  transform: translate(-3px, -1px); }
  50%  { clip-path: inset(25% 0 45% 0); transform: translate(1px, 2px); }
  55%  { clip-path: inset(60% 0 15% 0); transform: translate(-2px, 0px); }
  60%  { clip-path: inset(8% 0 75% 0);  transform: translate(3px, -2px); }
  65%  { clip-path: inset(35% 0 40% 0); transform: translate(0px, 1px); }
  70%  { clip-path: inset(85% 0 3% 0);  transform: translate(-1px, -1px); }
  75%  { clip-path: inset(50% 0 25% 0); transform: translate(2px, 2px); }
  80%  { clip-path: inset(12% 0 55% 0); transform: translate(-3px, 0px); }
  85%  { clip-path: inset(65% 0 10% 0); transform: translate(1px, -2px); }
  90%  { clip-path: inset(30% 0 42% 0); transform: translate(-2px, 1px); }
  95%  { clip-path: inset(90% 0 1% 0);  transform: translate(3px, 0px); }
  100% { clip-path: inset(42% 0 33% 0); transform: translate(-1px, -1px); }
}

@keyframes glitch-after {
  0%   { clip-path: inset(60% 0 10% 0);  transform: translate(3px, -1px); }
  5%   { clip-path: inset(25% 0 50% 0);  transform: translate(-2px, 2px); }
  10%  { clip-path: inset(5% 0 80% 0);   transform: translate(1px, -2px); }
  15%  { clip-path: inset(55% 0 20% 0);  transform: translate(-3px, 0px); }
  20%  { clip-path: inset(15% 0 65% 0);  transform: translate(2px, 1px); }
  25%  { clip-path: inset(85% 0 5% 0);   transform: translate(-1px, -2px); }
  30%  { clip-path: inset(30% 0 45% 0);  transform: translate(3px, 0px); }
  35%  { clip-path: inset(70% 0 8% 0);   transform: translate(0px, 2px); }
  40%  { clip-path: inset(10% 0 72% 0);  transform: translate(-2px, -1px); }
  45%  { clip-path: inset(48% 0 28% 0);  transform: translate(1px, 1px); }
  50%  { clip-path: inset(78% 0 3% 0);   transform: translate(-3px, -2px); }
  55%  { clip-path: inset(20% 0 58% 0);  transform: translate(2px, 0px); }
  60%  { clip-path: inset(88% 0 2% 0);   transform: translate(0px, 2px); }
  65%  { clip-path: inset(38% 0 35% 0);  transform: translate(-1px, -1px); }
  70%  { clip-path: inset(65% 0 12% 0);  transform: translate(3px, 1px); }
  75%  { clip-path: inset(8% 0 68% 0);   transform: translate(-2px, -2px); }
  80%  { clip-path: inset(52% 0 22% 0);  transform: translate(1px, 0px); }
  85%  { clip-path: inset(82% 0 6% 0);   transform: translate(-3px, 2px); }
  90%  { clip-path: inset(18% 0 60% 0);  transform: translate(2px, -1px); }
  95%  { clip-path: inset(45% 0 30% 0);  transform: translate(-1px, 1px); }
  100% { clip-path: inset(72% 0 8% 0);   transform: translate(3px, -2px); }
}

@keyframes glitch-skew {
  0%    { transform: skew(0deg); }
  2%    { transform: skew(0.5deg); }
  4%    { transform: skew(-0.3deg); }
  6%    { transform: skew(0deg); }
  20%   { transform: skew(0deg); }
  22%   { transform: skew(-0.8deg); }
  24%   { transform: skew(0.4deg); }
  26%   { transform: skew(0deg); }
  50%   { transform: skew(0deg); }
  52%   { transform: skew(0.6deg); }
  54%   { transform: skew(-0.5deg); }
  56%   { transform: skew(0deg); }
  80%   { transform: skew(0deg); }
  82%   { transform: skew(-0.4deg); }
  84%   { transform: skew(0.7deg); }
  86%   { transform: skew(0deg); }
  100%  { transform: skew(0deg); }
}
</style>
