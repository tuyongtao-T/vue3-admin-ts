/*
 * @Author: tuyongtao1
 * @Date: 2023-05-24 14:35:59
 * @LastEditors: tuyongtao1
 * @LastEditTime: 2024-01-30 20:04:00
 * @Description:
 */
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import { getPlugins } from './build/vite/plugins'

const CWD = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_PROXY_URL } = loadEnv(mode, CWD)

  const plugins = getPlugins(command, mode)

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
            xlsx: ['xlsx'],
            utils: ['axios', 'lodash-es']
          }
        }
      }
    },
    plugins,
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
        less: {
          charset: false,
          additionalData: `@import "${resolve(__dirname, 'src/assets/styles/variables.less')}";`,
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      //设置别名
      alias: {
        '@': resolve(__dirname, './src'),
        '@assets': resolve(__dirname, './src/assets')
      },
      extensions: ['.js', '.json', '.ts', '.tsx', '.vue', '.mjs']
    },
    server: {
      host: 'vue.admin.com',
      port: 5173,
      open: true,
      cors: true, // 允许跨域
      proxy: {
        '/api': {
          target: VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
