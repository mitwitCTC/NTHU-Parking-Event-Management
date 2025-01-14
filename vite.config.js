import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/pacaApi': {
        target: 'http://hq.paca.com.tw:21080/api', // paca 的根路由
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pacaApi/, ''), // 去掉前綴 '/pacaApi'
      },
      '/api': {
        target: 'http://122.116.23.30:4320', // 另一個 API 的根路由
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // 去掉前綴 '/api'
      },
    },
  },
})
