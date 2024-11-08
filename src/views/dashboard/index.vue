<template>
  <div class="dashboard">
    <GrowCard :dashboardCardList="dashboardCardList" />
  </div>
</template>

<script lang="ts" setup>
import GrowCard from './components/GrowCard.vue'
import { useDashboardApi } from '@/api/dashboard'

const dashboardCardList = ref([])

const getDashboardCardList = async () => {
  try {
    const res = await useDashboardApi.getDashboardCardList()
    dashboardCardList.value = res.data
  } catch (error) {
    console.log(error)
  }
}
getDashboardCardList()
</script>
<style lang="scss" scoped>
.dashboard {
  background: transparent;
}
</style>
