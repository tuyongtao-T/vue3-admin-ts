<template>
  <div class="honeycomb">
    <div
      class="line"
      @mouseover="handleMouseOver"
      v-for="item in rows"
      :key="item"
    >
      <div
        class="item"
        v-for="i in cols"
        :style="{ background: numberToColorRGB((item - 1) * cols + i) }"
        :key="i"
        :class="{
          grow: (item - 1) * cols + i === activeIndex,
          shrink: shrinkIndex.includes((item - 1) * cols + i)
        }"
        :data-index="(item - 1) * cols + i"
      ></div>
    </div>
  </div>
</template>

<script setup>
const activeIndex = ref(-1)
const rows = ref(15)
const cols = ref(20)
function numberToColorRGB(num) {
  const maxNum = 300
  const r = Math.floor((num / maxNum) * 255)
  const g = Math.floor(((num * 2) / maxNum) * 255) % 256
  const b = Math.floor(((num * 3) / maxNum) * 255) % 256
  return `rgb(${r}, ${g}, ${b})`
}

const shrinkIndex = computed(() => {
  const left = activeIndex.value - 1
  const right = activeIndex.value + 1
  let preLeft, preRight, nextLeft, nextRight
  const isEven = Math.floor(activeIndex.value / cols.value) % 2 !== 0

  if (!isEven) {
    preLeft = activeIndex.value - 20
    preRight = activeIndex.value - 20 + 1
    nextLeft = activeIndex.value + 20
    nextRight = activeIndex.value + 20 + 1
  } else {
    preLeft = activeIndex.value - 20 - 1
    preRight = activeIndex.value - 20
    nextLeft = activeIndex.value + 20 - 1
    nextRight = activeIndex.value + 20
  }

  return [left, right, preLeft, preRight, nextLeft, nextRight]
})

const handleMouseOver = e => {
  const currentIndex = e.target?.dataset?.index
  if (currentIndex) {
    activeIndex.value = +currentIndex
  }
}
</script>

<style lang="scss" scoped>
.honeycomb {
  padding: 0;
  $n: 19;
  $size: 100vw / $n;

  .line {
    display: flex;

    &:nth-child(even) {
      transform: translateX(-($size / 2));
    }

    &:nth-child(n + 2) {
      margin-top: -($size / 6);
    }

    .item {
      flex-shrink: 0;
      width: $size;
      height: $size;
      clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
      color: white;
      text-align: center;
      cursor: pointer;
      transition: all 0.5 ease;
    }

    .grow {
      background: rgb(190 81 81) !important;
      transform: scale(1.3);
    }

    .shrink {
      background: pink !important;
      transform: scale(0.7);
    }
  }
}
</style>
