<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2023-05-24 16:29:24
 * @Description: 
-->
<template>
  <el-menu :default-active="route.path" :router="true" class="aside-menu">
    <div v-for="(item, index) in menuList" :key="index">
      <template v-if="item.children && item.children.length">
        <el-sub-menu :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta?.icon" />
            </el-icon>
            <span>{{ item.meta?.title }}</span>
          </template>
          <el-menu-item v-for="(subItem, idx) in item.children" :key="idx" :class="{ isActive: activeTab == subItem.path }" :index="subItem.path" :route="subItem.path">
            <el-icon>
              <component :is="item.meta?.icon" />
            </el-icon>
            <span>{{ subItem.meta?.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :class="{ isActive: activeTab == item.path }" :index="item.path" :route="item.path">
          <el-icon>
            <component :is="item.meta?.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/modules/menu'
import { menuRoutes } from '@/router/menu'

const route = useRoute()
const menuStore = useMenuStore()
const activeTab = menuStore.activeTab
const menuList = reactive(menuRoutes)

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

<style lang="less" scoped>
.aside-menu {
  width: 100%;
  height: 100%;
}
</style>
