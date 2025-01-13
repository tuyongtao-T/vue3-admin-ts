<template>
  <div class="layout-container">
    <el-container class="h-100%">
      <el-scrollbar :noresize="true">
        <LayoutMenu />
      </el-scrollbar>
      <el-container class="main-container">
        <LayoutHeader />
        <MainContent />
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LayoutMenu from './components/LayoutMenu.vue'
import MainContent from './components/MainContent.vue'
import LayoutHeader from './components/LayoutHeader.vue'

export default defineComponent({
  components: {
    LayoutMenu,
    MainContent,
    LayoutHeader
  },
  setup() {
    const DEV = ref(import.meta.env.DEV)
    return {
      // 控制是否展示菜单，开发环境为true，生产环境为false
      isDev: DEV
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;

  .main-container {
    flex-basis: min-content;
    flex-direction: column;
    background-color: rgb(228 228 231 / 0.4);
  }
}
</style>
