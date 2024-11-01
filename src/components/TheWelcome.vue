<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languageDisplay = computed(() => {
  return locale.value === 'zh' ? '中文/EN' : '中文/EN'
})
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

const contentHeight = ref('auto') // 儲存 .content 高度的狀態
// 動態計算 .content 高度
const setContentHeight = () => {
  const bgSecondary = document.querySelector('.bg-secondary')
  const bgSecondaryHeight = bgSecondary ? bgSecondary.offsetHeight : 0
  contentHeight.value = `calc(100vh - ${bgSecondaryHeight}px)`
}

// 在組件掛載時設定 .content 高度
onMounted(() => {
  setContentHeight()
  // 監聽視窗大小變化，視窗改變時重新計算高度
  window.addEventListener('resize', setContentHeight)
})

// 清除監聽事件
onUnmounted(() => {
  window.removeEventListener('resize', setContentHeight)
})
</script>

<template>
  <div class="bg-secondary text-center">
    <div class="header text-white">
      <h2>{{ $t('pages.index.title') }}</h2>
      <h5>{{ $t('pages.index.subtitle') }}</h5>
    </div>
    <div class="bg-light mt-0 py-3 header-btn-section">
      <div class="d-flex justify-content-end pe-3">
        <button class="btn btn-primary" @click="toggleLanguage">
          {{ languageDisplay }}
        </button>
      </div>
    </div>
  </div>
  <div class="bg-light content" :style="{ height: contentHeight }">
    {{ $t('pages.index.queryLinks') }}
  </div>
</template>

<style scoped>
.header {
  padding: 20px;
}

.header-btn-section {
  border-radius: 50px 0 0 0;
}
</style>
