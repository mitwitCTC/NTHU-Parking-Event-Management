<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
})

const router = useRouter()

// 定義步驟的資料
const steps = [
  {
    step: 1,
    to: '/apply-staff-parking/Step1',
    imageSrc: '/images/upload/填寫申請書.svg',
    alt: 'pages.applyStaffParking.basic_info.fillOut',
    title: 'pages.applyStaffParking.basic_info.fillOut',
    currentStepClass: 1, // 用來辨識當前步驟
  },
  {
    step: 3,
    to: '/apply-staff-parking/step3_1',
    imageSrc: '/images/upload/上傳申請書.svg',
    alt: 'pages.applyStaffParking.basic_info.uploadAndSubmit',
    title: 'pages.applyStaffParking.basic_info.uploadAndSubmit',
    currentStepClass: 3, // 用來辨識當前步驟
  },
]

function navigateToStep(step) {
  const currentPath = router.currentRoute.value.path
  if (currentPath !== step.to) {
    router.push(step.to)
  }
}
const formattedSteps = computed(() => {
  return steps.map(step => {
    return {
      ...step,
      stepClass: locale.value === 'en' ? 'fs-12' : 'fs-6',
    }
  })
})
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
