<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()

// 根據當前語言，處理翻譯中的換行
const formattedQueryLinks = computed(() => {
  const text = t('pages.index.queryLinks')

  // 只在英文中處理換行
  if (locale.value === 'en') {
    return text.split('\n').join('<br />')
  }
  return text
})
const formattedHomeLinks = computed(() => {
  const text = t('pages.query.goHomePage')

  // 只在英文中處理換行
  if (locale.value === 'en') {
    return text.split('\n').join('<br />')
  }
  return text
})

const languageDisplay = computed(() => {
  return locale.value === 'zh' ? '中文/EN' : '中文/EN'
})
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

const route = useRoute()

// 根據當前路由名稱來判斷是否顯示 query-btn
const isHomeRoute = computed(() => route.name === 'Home')
const isQueryHomeRoute = computed(() => route.name === 'QueryLinks')
// 判斷按鈕是否顯示，來動態調整樣式
const buttonsClass = computed(() => {
  return isHomeRoute.value || isQueryHomeRoute.value
    ? 'd-flex justify-content-between'
    : 'd-flex justify-content-end'
})
</script>

<template>
  <div class="bg-light mt-0 py-2 header-btn-section">
    <div class="container px-4 px-md-3">
      <div :class="buttonsClass">
        <div v-if="isHomeRoute" class="query-btn">
          <button class="btn btn-primary">
            <router-link to="query-links" class="text-white">
              <span v-html="formattedQueryLinks"></span>
            </router-link>
          </button>
        </div>
        <div v-if="isQueryHomeRoute" class="query-btn">
          <button class="btn btn-primary">
            <router-link to="/" class="text-white">
              <span v-html="formattedHomeLinks"></span>
            </router-link>
          </button>
        </div>
        <button class="btn btn-primary" @click="toggleLanguage">
          {{ languageDisplay }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-btn-section {
  border-radius: 50px 0 0 0;
}
</style>
