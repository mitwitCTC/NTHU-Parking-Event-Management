<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  showBackIcon: {
    type: Boolean,
    default: false,
  },
})
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
const { locale } = useI18n()
// 根據當前語系決定 title subtitle的字型大小
const titleClass = computed(() => {
  return locale.value === 'en' ? 'fs-3' : 'fs-2'
})
const subtitleClass = computed(() => {
  return locale.value === 'en' ? 'fs-6' : 'fs-5'
})
</script>

<template>
  <div class="bg-secondary text-center fixed-top">
    <div class="header text-white d-flex align-items-center">
      <!-- 回上一頁 -->
      <img
        v-if="showBackIcon"
        src="/images/Chevron-left.svg"
        alt="back-icon"
        @click="$emit('goBack')"
        class="back-icon me-3"
      />
      <div class="flex-grow-1 text-center">
        <!-- 標題 -->
        <p :class="titleClass">{{ title }}</p>
        <!-- 副標題 -->
        <h5 :class="subtitleClass">{{ subtitle }}</h5>
      </div>
    </div>
    <!-- 默認插槽，顯示 HeaderButtonsSection -->
    <slot></slot>
  </div>
</template>

<style scoped>
.header {
  padding: 20px;
  color: white;
}

.back-icon {
  cursor: pointer;
  width: 24px;
}
</style>
