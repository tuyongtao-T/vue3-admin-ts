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
