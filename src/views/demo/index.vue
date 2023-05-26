<template>
  <el-button type="primary" @click="test">你好</el-button>
  <el-button type="primary" @click="test">你好3223</el-button>
</template>

<script lang="ts" setup>
function test() {
  console.log(123)
}
test()
</script>
