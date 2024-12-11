<script setup>
import StepNavigator from '@/components/StepNavigator.vue'
import { ref } from 'vue'
import router from '@/router'
const currentStep = 2

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
const login_data = ref({
  email: '',
  phone_number: '',
})

const login_result = ref('')
async function login() {
  if (
    login_data.value.email == 'test@gmail.com' &&
    login_data.value.phone_number == '0909123456'
  ) {
    login_result.value = 'success'
    router.push('/apply-event/step2_2')
  } else {
    login_result.value = 'fail'
  }
  clearLogin_result()
}

function clearLogin_result() {
  setTimeout(() => {
    login_result.value = ''
  }, 2000)
}
</script>
<template>
  <StepNavigator :currentStep="currentStep" :steps="steps" />
  <div
    v-if="login_result"
    :class="[
      'alert',
      login_result == 'success' ? 'alert-success' : 'alert-danger',
    ]"
    role="alert"
  >
    {{
      login_result == 'success'
        ? $t('pages.applyStaffParking.loginAndUpload.success')
        : $t('pages.applyStaffParking.loginAndUpload.fail')
    }}
  </div>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyEvent.login.email') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="email"
        v-model="login_data.email"
      />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyEvent.login.phone_number') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="phone_number"
        v-model="login_data.phone_number"
      />
    </div>
    <button class="btn btn-secondary w-100" @click.prevent="login">
      {{ $t('pages.applyEvent.login.login') }}
    </button>
  </form>
</template>
