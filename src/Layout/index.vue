<template>
  <div class="layout-container">
    <el-container class="h-100%">
      <el-scrollbar :noresize="true">
        <LayoutMenu v-if="isDev" />
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
      isDev: DEV
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;

  .main-container {
    flex-direction: column;
    background-color: rgb(228 228 231 / 0.4);
  }
}
</style>
