<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { debounce } from 'lodash-es'

// 定义组件的 props
const props = defineProps({
  options: {
    type: Object,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化 ECharts 实例
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(props.options)

    window.addEventListener('resize', debounceResizeChart)
  }
})

// 销毁 ECharts 实例
onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener('resize', debounceResizeChart)
    chartInstance.dispose()
  }
})

// 监听 options 的变化
watch(
  () => props.options,
  newOptions => {
    if (chartInstance) {
      chartInstance.setOption(newOptions)
    }
  },
  { deep: true }
)

// 防抖的 resize 函数
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 使用 lodash-es 的 debounce 创建防抖函数
const debounceResizeChart = debounce(resizeChart, 200)
</script>

<style lang="scss" scoped>
/* 添加一些样式 */
.chart-container {
  height: 360px;
  padding: $primary-padding;
  background: $primary-bg-color;
  border-radius: 20px;
  border-radius: var(--el-border-radius-round);
}
</style>
