<script setup>
import Api from '@/api'
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useSerialStore } from '@/stores/serial_numberStore'
const serialStore = useSerialStore()
import { useEventCouponStore } from '@/stores/eventCouponStore'
const eventCouponStore = useEventCouponStore()
import StepNavigator from '@/components/StepNavigator.vue'
import { ref } from 'vue'
import router from '@/router'
const currentStep = 2

// 定義步驟資料
const steps = [
  {
    step: 1,
    to: '/apply-event-coupon/Step1',
    imageSrc: '/images/upload/填寫申請書.svg',
    alt: 'stepNavigator.fillOut',
    title: 'stepNavigator.fillOut',
    currentStepClass: 1,
  },
  {
    step: 2,
    to: '/apply-event-coupon/Step2_1',
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
const isLogining = ref(false)
async function login() {
  isLogining.value = true
  try {
    await getFormInfo('活動暨抵用券')
    const form_code = form_info.value.form_code
    const response = await Api.post('/main/uploadLogin', {
      form_code: form_code,
      email: login_data.value.email,
      phone_number: login_data.value.phone_number,
    })
    if (response.data.returnCode == 0) {
      eventCouponStore.setApplicantData({
        applicant: response.data.data.applicant,
        email: response.data.data.email,
        phone_number: response.data.data.phone_number,
      })

      login_result.value = 'success'
      const serial_number = response.data.data.serial_number
      serialStore.setSerialNumber(form_code, serial_number)
      setTimeout(() => {
        router.push('/apply-event-coupon/step2_2')
      }, 500)
    } else {
      login_result.value = 'fail'
    }
  } catch (error) {
    console.error(error)
    login_result.value = 'fail'
  } finally {
    isLogining.value = false
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
        ? $t('pages.applyEventCoupon.login.success')
        : $t('pages.applyEventCoupon.login.fail')
    }}
  </div>
  <loading :active="isLogining" :is-full-page="true"></loading>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyEventCoupon.login.email') }}
      </label>
      <input type="text" class="form-control" id="email" v-model="login_data.email" />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyEventCoupon.login.phone_number') }}
      </label>
      <input type="text" class="form-control" id="phone_number" v-model="login_data.phone_number" />
    </div>
    <button class="btn btn-secondary w-100" @click.prevent="login">
      {{ $t('pages.applyEventCoupon.login.login') }}
    </button>
  </form>
</template>
