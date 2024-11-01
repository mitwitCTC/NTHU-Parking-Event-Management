import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
const i18n = createI18n({
  locale: 'zh', // 預設語言
  fallbackLocale: 'zh', // 當找不到對應語言時使用的語言
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
