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
    path: '/awesome',
    name: 'awesome',
    component: () => import('@/views/awesome/index.vue'),
    redirect: { name: 'honeycomb' },
    meta: {
      title: '奇淫巧技',
      icon: 'Magnet'
    },
    children: [
      {
        path: '/awesome/onlineVscode',
        name: 'onlineVscode',
        component: () => import('@/views/awesome/onlineVscode/index.vue'),
        meta: {
          title: '在线vscode',
          icon: 'Magnet'
        },
        children: []
      },
      {
        path: '/awesome/honeycomb',
        name: 'honeycomb',
        component: () => import('@/views/awesome/honeycomb/index.vue'),
        meta: {
          title: '蜂巢网页',
          icon: 'Magnet'
        },
        children: []
      },
      {
        path: '/awesome/codesRain',
        name: 'codesRain',
        component: () => import('@/views/awesome/codesRain/index.vue'),
        meta: {
          title: '代码雨',
          icon: 'Magnet'
        },
        children: []
      }
    ]
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
