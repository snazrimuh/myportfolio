<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  colorStops?: string[]
  speed?: number
  amplitude?: number
  blend?: number
}

const props = withDefaults(defineProps<Props>(), {
  colorStops: () => ['#3A29FF', '#FF94B4', '#FF3232'],
  speed: 1.0,
  amplitude: 1.0,
  blend: 0.5,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let startTime = 0

function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (!gl) return

  const vertexShaderSrc = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `

  const fragmentShaderSrc = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uAmplitude;
    uniform float uBlend;

    // simplex noise helpers
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float t = uTime * 0.3;

      float n1 = snoise(uv * 2.0 + vec2(t * 0.5, t * 0.3)) * uAmplitude;
      float n2 = snoise(uv * 3.0 + vec2(-t * 0.4, t * 0.2)) * uAmplitude;
      float n3 = snoise(uv * 1.5 + vec2(t * 0.6, -t * 0.5)) * uAmplitude;

      float blend1 = smoothstep(-0.5, 0.5, n1) * uBlend + (1.0 - uBlend) * 0.33;
      float blend2 = smoothstep(-0.5, 0.5, n2) * uBlend + (1.0 - uBlend) * 0.33;
      float blend3 = smoothstep(-0.5, 0.5, n3) * uBlend + (1.0 - uBlend) * 0.34;

      float total = blend1 + blend2 + blend3;
      vec3 color = (uColor1 * blend1 + uColor2 * blend2 + uColor3 * blend3) / total;

      // Vignette
      float vignette = 1.0 - length(uv - 0.5) * 0.8;
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `

  function createShader(type: number, source: string) {
    const shader = gl!.createShader(type)!
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    return shader
  }

  const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc)
  const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = gl.createProgram()!
  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const pos = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(pos)
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(program, 'uTime')
  const uRes = gl.getUniformLocation(program, 'uResolution')
  const uC1 = gl.getUniformLocation(program, 'uColor1')
  const uC2 = gl.getUniformLocation(program, 'uColor2')
  const uC3 = gl.getUniformLocation(program, 'uColor3')
  const uAmp = gl.getUniformLocation(program, 'uAmplitude')
  const uBlend = gl.getUniformLocation(program, 'uBlend')

  function resize() {
    if (!canvas) return
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    gl!.viewport(0, 0, canvas.width, canvas.height)
  }

  resize()
  window.addEventListener('resize', resize)
  startTime = performance.now()

  const colors = props.colorStops.map(hexToVec3)

  function render() {
    const elapsed = (performance.now() - startTime) / 1000 * props.speed
    gl!.uniform1f(uTime, elapsed)
    gl!.uniform2f(uRes, canvas!.width, canvas!.height)
    gl!.uniform3fv(uC1, colors[0] || [0.23, 0.16, 1])
    gl!.uniform3fv(uC2, colors[1] || [1, 0.58, 0.7])
    gl!.uniform3fv(uC3, colors[2] || [1, 0.2, 0.2])
    gl!.uniform1f(uAmp, props.amplitude)
    gl!.uniform1f(uBlend, props.blend)
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
    animationId = requestAnimationFrame(render)
  }

  render()

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full -z-10"
  />
</template>
