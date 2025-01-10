<template>
  <router-view v-slot="{ Component, route }">
    <template v-if="route.path !== '/home'">
      <keep-alive>
        <component class="route-out" :is="Component" />
      </keep-alive>
    </template>
    <!-- TODO -->
    <template v-else>
      <component class="route-out" :is="Component" />
    </template>
  </router-view>
</template>

<style lang="scss" scoped>
@use 'sass:math';
$top: $app-header-height + $app-route-tab-height;

.route-out {
  height: calc(100% - $top);
  padding: $primary-padding;
  overflow: auto;
}
</style>
