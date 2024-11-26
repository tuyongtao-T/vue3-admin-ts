<template>
  <div
    class="md:(grid grid-cols-2 grid-rows-2 gap-16) lg:(grid grid-cols-4 grid-rows-1 gap-16)"
  >
    <template v-for="(item, index) in dashboardCardList" :key="item.title">
      <el-card
        v-if="item.title"
        class="!rd-10"
        shadow="hover"
        :class="{
          'mt-10 md:mt-0 lg:mt-0': index > 0
        }"
      >
        <template #header>
          <div class="card-header">
            <span class="fw-bold text-20">{{ item.title }}</span>
          </div>
        </template>
        <div class="f-b-c text-24">
          <el-statistic :value="item.value" />
          <el-icon color="#409eff" v-if="item.icon === 'PartlyCloudy'"
            ><PartlyCloudy
          /></el-icon>
          <el-icon color="#409eff" v-if="item.icon === 'Sunset'"
            ><Sunset
          /></el-icon>
          <el-icon color="#409eff" v-if="item.icon === 'Drizzling'"
            ><Drizzling
          /></el-icon>
          <el-icon color="#409eff" v-if="item.icon === 'Lightning'"
            ><Lightning
          /></el-icon>
        </div>
        <template #footer>
          <div class="f-b-c text-14">
            <span>总{{ item.title }}</span>
            <el-statistic class="!text-14" :value="item.total" />
          </div>
        </template>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps(['dashboardCardList', 'loading'])
</script>

<style scoped>
::v-deep(.el-card__header),
::v-deep(.el-card__body),
::v-deep(.el-card__footer) {
  padding: 8px;
}

::v-deep(.el-card__header) {
  border: none;
}
</style>
