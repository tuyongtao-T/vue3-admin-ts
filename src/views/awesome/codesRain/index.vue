<template>
  <div class="codes-rain">
    <el-button
      class="fullScreen-btn"
      @click="toggleFullscreen"
      type="primary"
      size="small"
      icon="FullScreen"
    ></el-button>
    <canvas ref="codeRainRef" id="codeRain" class="rain-container"></canvas>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const codeRainRef = ref(null)
const { toggle: toggleFullscreen } = useFullscreen(codeRainRef)
const FONT_SIZE = 16

let animationFrameId

function draw(ctx, columns, fontSize, drops) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.font = `${fontSize}px monospace`

  for (let i = 0; i < columns; i++) {
    const text = getRandomChar()
    const x = i * fontSize
    const y = drops[i] * fontSize

    ctx.fillStyle = getRandomColor()
    ctx.fillText(text, x, y)

    if (y > ctx.canvas.height && Math.random() > 0.975) {
      drops[i] = 0
    }

    drops[i]++
  }
}

function init() {
  const fontSize = FONT_SIZE
  const canvasEl = document.getElementById('codeRain')
  const canvasStyle = getComputedStyle(canvasEl)
  const canvasWidth = parseInt(canvasStyle.width)
  const canvasHeight = parseInt(canvasStyle.height)

  const dpr = window.devicePixelRatio || 1
  canvasEl.width = canvasWidth * dpr
  canvasEl.height = canvasHeight * dpr

  const ctx = canvasEl.getContext('2d')
  ctx.scale(dpr, dpr)

  const columns = Math.floor(canvasWidth / fontSize)
  const drops = new Array(columns).fill(0)

  function animate() {
    draw(ctx, columns, fontSize, drops)
    animationFrameId = requestAnimationFrame(animate)
  }

  // 添加鼠标事件监听器
  // canvasEl.addEventListener('mouseenter', () => {
  //   cancelAnimationFrame(animationFrameId)
  // })

  // canvasEl.addEventListener('mouseleave', () => {
  //   animate()
  // })

  animate()
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getRandomChar() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return characters.charAt(Math.floor(Math.random() * characters.length))
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<style lang="scss" scoped>
.codes-rain {
  position: relative;

  .fullScreen-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
  }

  .rain-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: black;
  }
}
</style>
