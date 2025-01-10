<template>
  <div class="layout-header">
    <div class="header-box">
      <el-space wrap :size="20">
        <el-icon color="#409EFC" size="20px" @click="foldMenu">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
        <Breadcrumb />
      </el-space>

      <div class="header-right">
        <el-button text bg @click="toggleDark()" circle>
          <el-icon v-if="!isDark"><Moon /></el-icon>
          <el-icon v-else><Sunny /></el-icon>
        </el-button>
        <el-dropdown>
          <span class="user-info">
            <el-avatar
              :size="30"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <span class="user-name">用户名</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <template v-if="menuStore.showTab">
      <div class="route-tab">
        <el-tabs
          v-model="menuStore.activeTab"
          type="card"
          :closable="menuStore.menuItems.length > 1"
          class="bg-white"
          @tab-click="handleTabsClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="item in menuStore.menuItems"
            :key="item.path"
            :label="item.title"
            :name="item.path"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { toggleDark, isDark } from '@/composables'
import { useMenuStore } from '@/store/modules/menu'
import type { TabPaneName, TabsPaneContext } from 'element-plus'
import Breadcrumb from './Breadcrumb.vue'
import { useConfigStore } from '@/store/modules/config'
const configStore = useConfigStore()
const { foldMenu } = configStore
const { isCollapse } = storeToRefs(configStore)

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

<style lang="scss" scoped>
.layout-header {
  .header-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $app-header-height;
    padding: 0 12px;
    background: $primary-bg-color;

    .header-right {
      display: flex;
      align-items: center;

      .user-info {
        display: flex;
        align-items: center;

        .user-name {
          padding-left: 10px;
        }
      }
    }

    svg {
      cursor: pointer;
    }
  }

  .route-tab {
    box-sizing: border-box;
    height: $app-route-tab-height;
    border-top: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
  }
}

::v-deep(.el-tabs__header) {
  margin-bottom: 0 !important;
}

::v-deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-top: none !important;
}
</style>
