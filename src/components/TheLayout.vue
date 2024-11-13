<!-- TheLayout.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheHeader from './TheHeader.vue'
import HeaderButtonsSection from './HeaderButtonsSection.vue'

const headerHeight = ref(0)

// 計算 header 的高度以便正確定位 content 區塊
const updateLayout = () => {
  const bgSecondary = document.querySelector('.bg-secondary')
  headerHeight.value = bgSecondary ? bgSecondary.offsetHeight : 0
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
})
</script>

<template>
  <TheHeader>
    <!-- 頁首內容插槽 -->
    <template #header-content>
      <slot name="header-content"></slot>
    </template>
    <!-- 插入頁首按鈕區塊 -->
    <HeaderButtonsSection />
  </TheHeader>

  <!-- 主要內容區域 -->
  <div
    class="bg-light content"
    :style="{
      paddingTop: `${headerHeight}px`,
      paddingBottom: '20px',
      height: '100vh',
    }"
  >
    <slot name="content"></slot>
  </div>
</template>

<style scoped>
.content {
  overflow-y: auto;
}
</style>
