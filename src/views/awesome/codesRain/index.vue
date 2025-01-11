<template>
  <div class="codes-rain">
    <canvas id="codeRain" class="rain-container"></canvas>
  </div>
</template>

<script setup>
const canvasCtx = ref()
const nextChars = new Array(40).fill(0)

function draw() {
  const fontSize = 20
  for (let i = 0; i < 40; i++) {
    const char = getRandomChar()
    canvasCtx.value.fillStyle = getRandomColor()
    canvasCtx.value.font = `${fontSize}px "Roboto Mono"`
    const x = 20 * i
    const nextIndex = nextChars[i]
    const y = (nextIndex + 1) * 20
    canvasCtx.value.fillText(char, x, y)
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
function getRandomChar(length = 1) {
  let str = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    str += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return str
}

onMounted(() => {
  const fontSize = 20
  const columnWidth = fontSize
  const canvasEl = document.getElementById('codeRain')
  const canvasWidth = parseInt(getComputedStyle(canvasEl).width)
  const columnNum = Math.floor(canvasWidth / columnWidth)
  console.log(columnNum)
  canvasCtx.value = canvasEl.getContext('2d')
  draw()
})
</script>

<style lang="scss" scoped>
.codes-rain {
  position: relative;

  .rain-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
