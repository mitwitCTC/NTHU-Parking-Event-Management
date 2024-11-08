<script setup>
import { ref } from 'vue'
import StepNavigator from '@/components/applyStaffParking/StepNavigator.vue'

const current_step = ref(3)
</script>

<template>
  <StepNavigator :currentStep="current_step" />
</template>
