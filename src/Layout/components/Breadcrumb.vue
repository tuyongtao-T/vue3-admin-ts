<!-- components/Breadcrumb.vue -->
<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
      <router-link v-if="index < breadcrumbs.length - 1" :to="crumb.path">
        {{ crumb.name }}
      </router-link>
      <span v-else>{{ crumb.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

interface Breadcrumb {
  path: string
  name: string
}

const route = useRoute()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const allRoutes = route.matched.map(route => ({
    path: route.path,
    name: route.meta.title as string
  }))
  return allRoutes.filter(item => {
    return item.path !== '/'
  })
})
</script>
