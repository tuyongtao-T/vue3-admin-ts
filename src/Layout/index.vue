<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-01-30 20:37:56
 * @Description: 
-->
<template>
  <div class="layout-container">
    <el-container class="main-container">
      <el-aside class="main-left" v-if="isDev">
        <LayoutMenu />
      </el-aside>
      <el-main class="main-right">
        <LayoutHeader />
        <LayoutContent />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LayoutMenu from './components/LayoutMenu.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutHeader from './components/LayoutHeader.vue'

export default defineComponent({
  components: {
    LayoutMenu,
    LayoutContent,
    LayoutHeader
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
      height: 100vh;
      padding: 0;
      background-color: white;
    }
  }
}
</style>
