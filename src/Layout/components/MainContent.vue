<template>
  <router-view v-slot="{ Component, route }">
    <template v-if="route.path !== '/home'">
      <keep-alive>
        <component class="route-out" :is="Component" />
      </keep-alive>
    </template>
    <template v-else>
      <component class="route-out" :is="Component" />
    </template>
  </router-view>
</template>

<style lang="scss">
.route-out {
  height: calc(100% - 83px);
  padding: 16px;
}
</style>
