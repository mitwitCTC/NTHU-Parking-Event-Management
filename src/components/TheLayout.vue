<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheHeader from './TheHeader.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const contentHeight = ref('auto')

// 計算 .content 的動態高度
const setContentHeight = () => {
  const bgSecondary = document.querySelector('.bg-secondary')
  const bgSecondaryHeight = bgSecondary ? bgSecondary.offsetHeight : 0
  contentHeight.value = `calc(100vh + ${bgSecondaryHeight}px)`
}

// 設定及移除 resize 事件監聽器
onMounted(() => {
  setContentHeight()
  window.addEventListener('resize', setContentHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', setContentHeight)
})
</script>

<template>
  <TheHeader>
    <!-- 頁首內容插槽 -->
    <template #header-content>
      <slot name="header-content"></slot>
    </template>
    <!-- 插入語言切換按鈕區塊 -->
    <LanguageSwitcher />
  </TheHeader>

  <!-- 主要內容區域 -->
  <div class="bg-light content" :style="{ height: contentHeight }">
    <slot name="content"></slot>
  </div>
</template>
