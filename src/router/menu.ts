/*
 * @Author: tuyongtao1
 * @Date: 2024-01-30 21:13:27
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-02-26 17:41:44
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'Aim'
    }
  },
  {
    path: '/systemManage',
    name: 'systemManage',
    component: () => import('@/views/systemManage/index.vue'),
    redirect: { name: 'userManage' },
    meta: {
      title: '系统管理',
      icon: 'Magnet'
    },
    children: [
      {
        path: '/systemManage/userManage',
        name: 'userManage',
        component: () => import('@/views/systemManage/userManage/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'Magnet'
        },
        children: []
      },
      {
        path: '/systemManage/authManage',
        name: 'authManage',
        component: () => import('@/views/systemManage/authManage/index.vue'),
        redirect: { name: 'menu' },
        meta: {
          title: '权限管理',
          icon: 'Magnet'
        },
        children: [
          {
            path: '/systemManage/authManage/menu',
            name: 'menu',
            component: () =>
              import(
                '@/views/systemManage/authManage/menuAuthManage/index.vue'
              ),
            meta: {
              title: '菜单权限',
              icon: 'Magnet'
            }
          },
          {
            path: '/systemManage/authManage/btn',
            name: 'btn',
            component: () =>
              import('@/views/systemManage/authManage/btnAuthManage/index.vue'),
            meta: {
              title: '按钮权限',
              icon: 'Magnet'
            }
          }
        ]
      }
    ]
  }
]
