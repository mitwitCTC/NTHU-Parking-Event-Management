import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'

// 設定 i18n
const i18n = createI18n({
  locale: 'zh', // 預設語言
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
