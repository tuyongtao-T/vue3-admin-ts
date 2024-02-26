/*
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:16:02
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-02-26 17:42:13
 * @Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { menuRoutes } from '@/router/menu'
import Layout from '@/Layout/index.vue'

const routes: any = [
  {
    path: '/',
    component: Layout,
    redirect: (_: any) => {
      return { path: '/dashboard' }
    },
    children: [...menuRoutes]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  },
  {
    path: '/:currentPath(.*)*',
    redirect: (_: any) => {
      return { path: '/404' }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
