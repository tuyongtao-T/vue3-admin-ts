<template>
  <el-menu
    :default-active="route.path"
    :router="true"
    :collapse="isCollapse"
    class="el-menu-vertical-custom"
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
.el-menu-vertical-custom:not(.el-menu--collapse) {
  width: $app-aside-width;
}
</style>
