<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languageDisplay = computed(() => {
  return locale.value === 'zh' ? '中文/EN' : '中文/EN'
})
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <div class="bg-light mt-0 py-2 header-btn-section">
    <div class="d-flex justify-content-end pe-3">
      <button class="btn btn-primary" @click="toggleLanguage">
        {{ languageDisplay }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.header-btn-section {
  border-radius: 50px 0 0 0;
}
</style>
