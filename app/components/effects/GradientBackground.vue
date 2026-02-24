<template>
  <div class="gradient-bg" aria-hidden="true">
    <div class="blob blob-a" />
    <div class="blob blob-b" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: hsl(248 18% 4%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(130px);
  opacity: 0.14;
  animation: drift 22s ease-in-out infinite alternate;
  pointer-events: none;
}

.blob-a {
  top: -20%;
  right: -5%;
  width: 65vw;
  height: 65vw;
  max-width: 750px;
  max-height: 750px;
  background: radial-gradient(circle, hsl(258 84% 60%) 0%, transparent 68%);
  animation-duration: 28s;
}

.blob-b {
  bottom: -25%;
  left: -10%;
  width: 58vw;
  height: 58vw;
  max-width: 680px;
  max-height: 680px;
  background: radial-gradient(circle, hsl(220 75% 45%) 0%, transparent 68%);
  animation-duration: 20s;
  animation-delay: -10s;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(248 18% 3% / 0.7) 100%);
  pointer-events: none;
}

@keyframes drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(2%, 3%) scale(1.04); }
}
</style>

