<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-02-02 10:55:33
 * @Description: 
-->
<template>
  <el-menu
    :default-active="route.path"
    :router="true"
    :collapse="isCollapse"
    class="aside-menu"
  >
    <aside-menu-item :menu-list="menuList"></aside-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/modules/menu'
import { menuRoutes } from '@/router/menu'
import { useConfigStore } from '@/store/modules/config'
import AsideMenuItem from './AsideMenuItem.vue'

const route = useRoute()
const menuStore = useMenuStore()
const configStore = useConfigStore()
const menuList = reactive(menuRoutes)

const isCollapse = computed(() => {
  return configStore.isCollapse
})

watch(
  () => route.path,
  () => {
    menuStore.setActiveTab(route.path)
    if (route.path === '/home') {
      menuStore.clearTab()
    }
    if (menuStore.menuItems.every(v => v.path !== route.path)) {
      if (route.meta.title) {
        menuStore.addTab({
          path: route.path,
          title: route.meta.title
        })
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.aside-menu {
  // width: 100%;
  .isShow {
    display: none;
  }
}
</style>
