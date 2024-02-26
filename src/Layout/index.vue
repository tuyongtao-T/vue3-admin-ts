<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-02-02 13:52:42
 * @Description: 
-->
<template>
  <div class="layout-container">
    <el-container class="h-100%">
      <el-scrollbar :noresize="true">
        <LayoutMenu v-if="isDev" />
      </el-scrollbar>
      <el-container class="main-container">
        <LayoutHeader />
        <LayoutContent />
      </el-container>
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
    flex-direction: column;
    margin: 0 10px;
  }
}
</style>
