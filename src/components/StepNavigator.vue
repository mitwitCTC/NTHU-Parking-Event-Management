<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// 定義 props
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
    validator: value =>
      value.every(
        step =>
          'step' in step &&
          'to' in step &&
          'currentStepClass' in step &&
          'imageSrc' in step &&
          'alt' in step &&
          'title' in step,
      ),
  },
})

const { locale } = useI18n()
const router = useRouter()

// 格式化 steps，根據當前語言設置樣式
const formattedSteps = computed(() => {
  return props.steps.map(step => ({
    // 使用 props.steps
    ...step,
    stepClass: locale.value === 'en' ? 'fs-12' : 'fs-6',
  }))
})

// 導航到指定步驟
function navigateToStep(step) {
  const currentPath = router.currentRoute.value.path
  if (currentPath !== step.to) {
    router.push(step.to)
  }
}
</script>

<template>
  <section>
    <div class="d-flex justify-content-around gap-3">
      <div
        v-for="(step, index) in formattedSteps"
        :key="index"
        class="d-flex flex-column align-items-center nav-item"
        :class="{ 'gray-overlay': currentStep != step.currentStepClass }"
        @click="navigateToStep(step)"
      >
        <div class="img-container">
          <img :src="step.imageSrc" :alt="$t(step.alt)" />
        </div>
        <p class="mt-2 text-center" :class="step.stepClass">
          {{ $t(step.title) }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nav-item {
  cursor: pointer;
}

.gray-overlay {
  position: relative;
  opacity: 0.5;
}

.img-container {
  background: #ffffff;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  border-radius: 15px;
  padding: 10px;
  width: 60px;
  height: 60px;
}
img {
  width: 100%;
  height: 100%;
}
</style>
