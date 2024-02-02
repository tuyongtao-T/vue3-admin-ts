<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-02-02 09:49:01
 * @Description: 
-->
<template>
  <div class="header-box">
    <el-icon color="#409EFC" size="20px" @click="foldMenu">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
    <div class="header-left">
      <img src="@/assets/img/logo.png" class="logo" />
      <h1>后台管理系统模板</h1>
    </div>
    <div class="header-right">
      <el-dropdown>
        <span class="user-info">
          <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
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
</template>
<script lang="ts" setup>
import { useConfigStore } from '@/store/modules/config'
const configStore = useConfigStore()
const { foldMenu } = configStore
const { isCollapse } = storeToRefs(configStore)
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
  color: #fff;
  border-bottom: 1px solid rgb(202 196 196);

  .header-left {
    display: flex;
    align-items: center;
    width: 60px;

    .logo {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }

    h1 {
      font-size: 24px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    width: 60px;

    .user-info {
      display: flex;
      align-items: center;
      color: #fff;

      .user-name {
        padding-left: 10px;
      }
    }
  }

  svg {
    cursor: pointer;
  }
}
</style>
