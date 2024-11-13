<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { locale } = useI18n()

const languageDisplay = computed(() => {
  return locale.value === 'zh' ? '中文/EN' : '中文/EN'
})
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

const route = useRoute()

// 根據當前路由名稱來判斷是否顯示 query-btn
const isHomeRoute = computed(() => route.name === 'Home')
// 判斷按鈕是否顯示，來動態調整樣式
const buttonsClass = computed(() => {
  return isHomeRoute.value
    ? 'd-flex justify-content-between'
    : 'd-flex justify-content-end'
})
</script>

<template>
  <div class="bg-light mt-0 py-2 header-btn-section">
    <div class="container px-5 px-md-0">
      <div :class="buttonsClass">
        <div v-if="isHomeRoute" class="query-btn">
          <button class="btn btn-primary">
            <router-link to="query-links" class="text-white">
              {{ $t('pages.index.queryLinks') }}
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
