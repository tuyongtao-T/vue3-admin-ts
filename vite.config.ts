import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
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
import fs from 'fs'
import path from 'path'

const CWD = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_PROXY_URL, VITE_APP_TITLE } = loadEnv(mode, CWD)

  return {
    base: VITE_BASE_URL, // 设置打包路径
    build: {
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      reportCompressedSize: false, // 关闭文件计算
      sourcemap: false, // 关闭生成map文件 可以达到缩小打包体积
      terserOptions: {
        compress: {
          drop_console: true, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        },
        output: {
          comments: true // 去掉注释内容
        }
      },

      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'static/js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            elementplus: ['element-plus'],
            elementicon: ['@element-plus/icons-vue'],
            echarts: ['echarts'],
            utils: ['axios', 'lodash-es']
          }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      DefineOptions(),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        dts: true,
        imports: ['vue', 'vue-router', 'pinia']
      }),
      Components({
        include: [/\.tsx$/, /\.vue$/, /\.vue\?vue/],
        // 生产环境按需引入
        resolvers: [
          // Auto register Element Plus components
          // 自动导入 Element Plus 组件
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      Unocss(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: VITE_APP_TITLE
          }
        }
      }),
      viteMockServe({
        mockPath: './mock',
        enable: true
      }),
      visualizer()
    ],
    css: {
      modules: {
        localsConvention: 'camelCase', // 默认只支持驼峰，修改为同时支持横线和驼峰
        generateScopedName: '[name]_[local]_[hash:base64:5]'
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      //设置别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets')
      },
      extensions: ['.js', '.json', '.ts', '.tsx', '.vue', '.mjs']
    },
    server: {
      host: 'yongtao-custom.com',
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem'))
      },
      port: 5173,
      open: true,
      cors: true // 允许跨域
      // proxy: {
      //   '/api': {
      //     target: VITE_PROXY_URL,
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api/, '')
      //   }
      // }
    }
  }
})
