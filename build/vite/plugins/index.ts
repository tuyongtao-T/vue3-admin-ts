/*
 * @Author: tuyongtao1
 * @Date: 2023-05-26 10:26:41
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-01-30 21:16:24
 * @Description:
 */
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import DefineOptions from 'unplugin-vue-define-options/dist/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import Unocss from 'unocss/vite'
import Unfonts from 'unplugin-fonts/vite'

const CWD = process.cwd()

export const getPlugins = (command, mode) => {
  const { VITE_USE_MOCK, VITE_APP_TITLE, npm_lifecycle_event } = loadEnv(mode, CWD, '')

  const isEnabledMock = command === 'serve' && mode !== 'production' && VITE_USE_MOCK === '1'
  const isBuild = command === 'build'

  const plugins = [
    vue(),
    vueJsx(),
    DefineOptions(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      dts: true,
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      include: [/\.tsx$/, /\.vue$/, /\.vue\?vue/],
      // 生产环境按需引入
      resolvers: [
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver()
      ]
    }),
    // 开发环境完整引入element-plus
    {
      name: 'dev-auto-import-element-plus',
      transform(code, id) {
        if (process.env.NODE_ENV !== 'production' && /src\/main.ts$/.test(id)) {
          return {
            code: `${code};import ElementPlus from 'element-plus';import 'element-plus/dist/index.css';app.use(ElementPlus);`,
            map: null
          }
        }
      }
    },
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    Unocss(),
    createHtmlPlugin({
      minify: isBuild,
      inject: {
        data: {
          title: VITE_APP_TITLE
        }
      }
    }),
    // 字体优化
    Unfonts({
      custom: {
        display: 'swap',
        families: {
          myFont: {
            local: 'myFont',
            src: './src/assets/styles/fonts/myFont/myFont-SC*'
          }
        },
        injectTo: 'head'
      }
    })
  ]

  if (isEnabledMock) {
    plugins.push(
      viteMockServe({
        mockPath: 'mock',
        localEnabled: isEnabledMock,
        prodEnabled: false,
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true // 监视文件更改
      })
    )
  }
  if (npm_lifecycle_event === 'report') {
    plugins.push(visualizer())
  }

  return plugins
}
