<script setup>
import { ref } from 'vue'
import StepNavigator from '@/components/StepNavigator.vue'
const currentStep = ref(1)

// 定義步驟資料
const steps = [
  {
    step: 1,
    to: '/apply-event/Step1',
    imageSrc: '/images/upload/填寫申請書.svg',
    alt: 'stepNavigator.fillOut',
    title: 'stepNavigator.fillOut',
    currentStepClass: 1,
  },
  {
    step: 2,
    to: '/apply-event/Step2_1',
    imageSrc: '/images/upload/上傳申請書.svg',
    alt: 'stepNavigator.uploadAndSubmit',
    title: 'stepNavigator.uploadAndSubmit',
    currentStepClass: 2,
  },
]
</script>
<template>
  <StepNavigator :currentStep="currentStep" :steps="steps" />
  <div>填寫申請書</div>
</template>
