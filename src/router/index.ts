/*
 * @Author: tuyongtao1
 * @Date: 2023-05-24 16:16:02
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2023-05-24 16:40:14
 * @Description:
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import { menuRoutes } from '@/router/menu'
import Layout from '@/components/layout/index.vue'

const routes: any = [
  {
    path: '/',
    component: Layout,
    redirect: (_: any) => {
      return { path: '/demo' }
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
