declare module 'element-plus/dist/locale/zh-cn.mjs'

declare module '@/utils/excel/Export2Excel.js'
declare module '@/utils/urlLoadingList.ts'
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
