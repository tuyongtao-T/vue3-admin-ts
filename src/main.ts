import { createApp } from 'vue'
import './assets/styles/index.less'
import 'unfonts.css'
import 'uno.css'
import { setupStore } from '@/store'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

setupStore(app)
app.use(router).mount('#app')
