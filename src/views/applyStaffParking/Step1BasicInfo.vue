<script setup>
import { ref, onMounted } from 'vue'
import StepNavigator from '@/components/applyStaffParking/StepNavigator.vue'
import router from '@/router'
import { useStaffStore } from '@/stores/staffStore'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const current_step = ref(1)
const staffStore = useStaffStore()

// 申請人資料
const applicant_data = ref({})
const academicYears = ref([]) // 用來儲存學年選項
// 計算學年
onMounted(() => {
  const currentYear = new Date().getFullYear()
  const currentAcademicYear = currentYear - 1911
  const nextAcademicYear = currentAcademicYear + 1

  // 更新學年選項
  academicYears.value = [currentAcademicYear, nextAcademicYear]
  // 預設選本學年
  applicant_data.value.academic_year = currentAcademicYear
  staffStore.getApplicantData()
})

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    applicant: { required: true },
    applicant_source: { required: true },
    email: { email: true },
    phone_number: { required: true, phone_number: true },
    academic_year: { required: true },
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errorsResult } = formValidatorRef.value.validateForm(
      applicant_data.value,
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
function handleNext() {
  if (formValidate()) {
    showConfirmModal.value = true
  }
}
const showConfirmModal = ref(false) // 控制 確認送出申請Modal 顯示
function closeConfirmModal() {
  showConfirmModal.value = false
}
function apply() {
  if (formValidate()) {
    staffStore.setApplicantData(applicant_data.value)
    router.push('/apply-staff-parking/step2')
  }
}
</script>

<template>
  <StepNavigator :currentStep="current_step" />
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="mb-3">
      <label for="applicant" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.applicant') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="applicant"
        v-model="applicant_data.applicant"
      />
    </div>
    <div class="mb-3">
      <label for="applicant_source" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.applicant_source') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="applicant_source"
        v-model="applicant_data.applicant_source"
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.email') }}
      </label>
      <input
        type="mail"
        class="form-control"
        id="email"
        v-model="applicant_data.email"
      />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.phone_number') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="phone_number"
        v-model="applicant_data.phone_number"
      />
    </div>
    <div class="mb-3">
      <label for="academic_year" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.academic_year') }}
      </label>
      <select class="form-select" v-model="applicant_data.academic_year">
        <option v-for="year in academicYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
    <div class="text-center">
      <button class="btn btn-secondary" @click.prevent="handleNext">
        {{ $t('pages.applyStaffParking.basic_info.next') }}
      </button>
    </div>
  </form>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
  <!-- 確認送出申請資料 modal -->
  <ConfirmModal
    :showConfirmModal="showConfirmModal"
    @close="closeConfirmModal"
    @apply="apply"
  />
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
