<!--
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:21:07
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-01-30 20:53:07
 * @Description: 
-->
<template>
  <div class="header-box">
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

<style lang="less" scoped>
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  color: #fff;

  .header-left {
    display: flex;
    align-items: center;

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

    .user-info {
      display: flex;
      align-items: center;
      color: #fff;

      .user-name {
        padding-left: 10px;
      }
    }
  }
}
</style>
