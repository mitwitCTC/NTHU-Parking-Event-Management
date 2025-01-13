<script setup>
import Api from '@/api'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useSerialStore } from '@/stores/serial_numberStore'
const serialStore = useSerialStore()

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
  try {
    await getFormInfo('活動')
    const form_code = form_info.value.form_code
    const response = await Api.post('/main/uploadLogin', {
      form_code: form_code,
      email: login_data.value.email,
      phone_number: login_data.value.phone_number,
    })
    if (response.data.returnCode == 0) {
      login_result.value = 'success'
      const serial_number = response.data.data.serial_number
      serialStore.setSerialNumber(form_code, serial_number)
      setTimeout(() => {
        router.push('/apply-event/step2_2')
      }, 500)
    } else {
      login_result.value = 'fail'
    }
  } catch (error) {
    console.error(error)
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
  <div v-if="login_result" :class="['alert', login_result == 'success' ? 'alert-success' : 'alert-danger']"
    role="alert">
    {{
      login_result == 'success'
        ? $t('pages.applyEvent.login.success')
        : $t('pages.applyEvent.login.fail')
    }}
  </div>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyEvent.login.email') }}
      </label>
      <input type="text" class="form-control" id="email" v-model="login_data.email" />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyEvent.login.phone_number') }}
      </label>
      <input type="text" class="form-control" id="phone_number" v-model="login_data.phone_number" />
    </div>
    <button class="btn btn-secondary w-100" @click.prevent="login">
      {{ $t('pages.applyEvent.login.login') }}
    </button>
  </form>
</template>
