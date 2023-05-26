import type { RouteRecordRaw } from 'vue-router'

export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
    meta: {
      title: 'Demo',
      icon: 'Aim'
    }
  },
  {
    path: '/menu1',
    name: 'menu1',
    component: () => import('@/views/menu1/index.vue'),
    meta: {
      title: '一级菜单-2',
      icon: 'Magnet'
    },
    children: [
      {
        path: '/menu1/menu21',
        name: 'menu21',
        component: () => import('@/views/menu1/menu21/index.vue'),
        meta: {
          title: '二级菜单-1',
          icon: 'Magnet'
        }
      },
      {
        path: '/menu1/menu22',
        name: 'menu22',
        component: () => import('@/views/menu1/menu22/index.vue'),
        meta: {
          title: '二级菜单-2',
          icon: 'Magnet'
        }
      }
    ]
  }
]
