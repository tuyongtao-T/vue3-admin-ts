<template>
  <div class="layout-container">
    <el-container class="main-container">
      <el-aside class="main-left" v-if="isDev">
        <LayMenu />
      </el-aside>
      <el-main class="main-right">
        <LayContent></LayContent>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LayMenu from '@/components/layout/layMenu.vue'
import LayContent from './layContent.vue'

export default defineComponent({
  components: {
    LayMenu,
    LayContent
  },
  setup() {
    const DEV = ref(import.meta.env.DEV)
    return {
      isDev: DEV
    }
  }
})
</script>

<style lang="less" scoped>
.layout-container {
  height: 100%;

  .main-container {
    position: relative;
    height: 100%;
    background: #f5f5f5;

    .main-left {
      width: 200px;
      height: 100%;
    }

    .main-right {
      height: 100%;
      // Apphub 默认存在内边距20px
      padding: 20px;
      background-color: white;
    }
  }
}
</style>
