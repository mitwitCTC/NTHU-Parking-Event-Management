<script setup>
import Api from '@/api'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useSerialStore } from '@/stores/serial_numberStore'
const serialStore = useSerialStore()
import { useStaffStore } from '@/stores/staffStore'
const staffStore = useStaffStore()
import { ref, onMounted } from 'vue'
import StepNavigator from '@/components/StepNavigator.vue'
import router from '@/router'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'

const currentStep = ref(3)
// 定義步驟資料
const steps = [
  {
    step: 1,
    to: '/apply-staff-parking/Step1',
    imageSrc: '/images/upload/填寫申請書.svg',
    alt: 'stepNavigator.fillOut',
    title: 'stepNavigator.fillOut',
    currentStepClass: 1,
  },
  {
    step: 3,
    to: '/apply-staff-parking/Step3_1',
    imageSrc: '/images/upload/上傳申請書.svg',
    alt: 'stepNavigator.uploadAndSubmit',
    title: 'stepNavigator.uploadAndSubmit',
    currentStepClass: 3,
  },
]
const login_data = ref({})
const academicYears = ref([]) // 用來儲存學年選項
// 計算學年
onMounted(() => {
  const currentYear = new Date().getFullYear()
  const currentAcademicYear = currentYear - 1911
  const nextAcademicYear = currentAcademicYear + 1

  // 更新學年選項
  academicYears.value = [currentAcademicYear, nextAcademicYear]
  // 預設選本學年
  login_data.value.academic_year = currentAcademicYear
})

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    plate: { required: true },
    phone_number: { required: true, phone_number: true },
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errorsResult } = formValidatorRef.value.validateForm(
      login_data.value,
      rules,
    )

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult // 設定錯誤訊息
      showModal.value = true // 顯示 Modal
    }

    return isValid
  } else {
    console.error('FormValidator reference is not correctly initialized.')
    return false
  }
}
// 這個方法將由 ValidationModal 觸發來關閉 Modal
function closeValidatorModal() {
  showModal.value = false
}

const login_result = ref('')
async function loginAndUpload() {
  if (formValidate()) {
    try {
      await getFormInfo('工作證')
      const form_code = form_info.value.form_code
      const response = await Api.post('/main/uploadLogin', {
        form_code: form_code,
        plate: login_data.value.plate,
        phone_number: login_data.value.phone_number,
        academic_year: login_data.value.academic_year,
      })

      if (response.data.returnCode == 0) {
        login_result.value = 'success'
        const serial_number = response.data.data[0].serial_number
        serialStore.setSerialNumber(form_code, serial_number)
        staffStore.setVehicleRegisteredList(response.data.data)
        setTimeout(() => {
          router.push('/apply-staff-parking/Step3_2')
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
}
function clearLogin_result() {
  setTimeout(() => {
    login_result.value = ''
  }, 2000)
}
</script>

<template>
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
  <StepNavigator :currentStep="currentStep" :steps="steps" />
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="mb-3">
      <label for="plate" class="form-label">
        {{ $t('pages.applyStaffParking.loginAndUpload.plate') }}
        <span class="text-warning">
          (
          {{
            $t('pages.applyStaffParking.loginAndUpload.licensePlateInputFormat')
          }}
          )
        </span>
      </label>
      <input
        type="text"
        class="form-control"
        id="plate"
        v-model="login_data.plate"
      />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyStaffParking.loginAndUpload.phone_number') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="phone_number"
        v-model="login_data.phone_number"
      />
      <div class="mb-3">
        <label for="academic_year" class="form-label">
          {{ $t('pages.applyStaffParking.loginAndUpload.academic_year') }}
        </label>
        <select class="form-select" v-model="login_data.academic_year">
          <option v-for="year in academicYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
    <button class="btn btn-secondary w-100" @click.prevent="loginAndUpload">
      {{ $t('pages.applyStaffParking.loginAndUpload.loginAndUpload') }}
    </button>
  </form>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
</template>
