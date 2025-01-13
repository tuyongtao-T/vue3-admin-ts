import { createApp } from 'vue'
import '@/assets/styles/index.scss'
import 'uno.css'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'

import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { setupStore } from '@/store'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import BasePage from '@/components/BasePage.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VxeTable)

app.component('BasePage', BasePage)

setupStore(app)
app.use(router).mount('#app')
