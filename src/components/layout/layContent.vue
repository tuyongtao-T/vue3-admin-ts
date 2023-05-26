<template>
  <template v-if="menuStore.showTab">
    <el-tabs v-model="menuStore.activeTab" type="card" :closable="menuStore.menuItems.length > 1" class="demo-tabs tabs" @tab-click="handleTabsClick" @tab-remove="handleTabRemove">
      <el-tab-pane class="tabs" v-for="item in menuStore.menuItems" :key="item.path" :label="item.title" :name="item.path"> </el-tab-pane>
    </el-tabs>
  </template>
  <LayMain />
</template>
<script lang="ts" setup>
import LayMain from '@/components/layout/layMain.vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/store/modules/menu'
import type { TabPaneName, TabsPaneContext } from 'element-plus'

const router = useRouter()
const menuStore = useMenuStore()

const handleTabsClick = (tab: TabsPaneContext) => {
  if (tab.props.name) {
    router.push({
      path: `${tab.props.name}`
    })
  }
}

const handleTabRemove = (tabName: TabPaneName) => {
  const activeName = menuStore.activeTab
  const tabs = menuStore.menuItems

  if (activeName === tabName) {
    tabs.forEach((tab, index) => {
      if (tab.path === tabName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          router.push({
            path: nextTab.path
          })
        }
      }
    })
  }

  menuStore.removeTab(tabName.toString())
}
</script>
