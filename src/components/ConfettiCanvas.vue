<template>
  <canvas ref="canvas" class="confetti-canvas"></canvas>
</template>

<script setup>
import { ref } from 'vue'

const canvas = ref(null)
const COLORS = ['#f44336','#e91e63','#9c27b0','#3f51b5','#2196f3','#4caf50','#ffeb3b','#ff9800']

defineExpose({ trigger })

function trigger() {
  const c = canvas.value
  if (!c) return
  c.width = window.innerWidth
  c.height = window.innerHeight
  const ctx = c.getContext('2d')

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * c.width,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.2,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 1,
  }))

  let frame
  const startTime = performance.now()

  function draw(now) {
    const elapsed = now - startTime
    ctx.clearRect(0, 0, c.width, c.height)
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.08
      p.rot += p.rotV
      p.life = Math.max(0, 1 - elapsed / 2200)
      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    })
    if (elapsed < 2400) frame = requestAnimationFrame(draw)
    else {
      ctx.clearRect(0, 0, c.width, c.height)
      cancelAnimationFrame(frame)
    }
  }

  frame = requestAnimationFrame(draw)
}
</script>

<style scoped>
.confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
}
</style>
