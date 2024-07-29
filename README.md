# 简介

vue-admin-ts 是一个后台前端解决方案，它基于 vue3 和 element-ui plus 实现。它使用了最新的前端技术栈，内置了 i18n 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。

- 在线预览

# 前序准备

你需要在本地安装 node 和 git。本项目技术栈基于 TypeScript、ES2015+、vue3、pinia、vue-router4 、vite 、axios 和 element-ui plus，所有的请求数据都使用 Mock.js 进行模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

## 环境准备

```
node: 16.18.1
pnpm: 9.1.2
```

## 开发

```
# 克隆项目
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 进入项目目录
cd vue-admin-ts

# 安装依赖
pnpm install

# 启动服务
pnpm run dev
```

浏览器访问 http://localhost:9527

## 发布

```
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
