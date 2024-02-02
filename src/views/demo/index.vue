<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:23:42
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-01-31 09:34:07
 * @Description: 
-->
<template>
  <el-button type="primary" @click="test">你好</el-button>
  <el-button type="primary" @click="test">你好3223</el-button>
  <el-icon><Fold /></el-icon>
</template>

<script lang="ts" setup>
function test() {
  console.log(123)
}
test()
</script>
