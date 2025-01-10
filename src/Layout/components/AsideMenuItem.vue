<template>
  <template v-for="item in menuList" :key="item.name">
    <template v-if="item.children && item.children.length">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta?.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <aside-menu-item :menu-list="item.children"></aside-menu-item>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item :index="item.path">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta?.icon" />
        </el-icon>
        <template #title>
          <span> {{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script lang="ts" setup>
defineProps(['menuList'])
</script>
<style lang="scss" scoped>
:deep(.el-menu-item, .el-sub-menu) {
  min-width: 200px !important;
}
</style>
