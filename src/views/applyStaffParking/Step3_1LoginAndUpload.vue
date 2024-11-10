<script setup>
import { ref, onMounted } from 'vue'
import StepNavigator from '@/components/applyStaffParking/StepNavigator.vue'
import router from '@/router'

const current_step = ref(3)
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

const login_result = ref('')
function loginAndUpload() {
  if (
    login_data.value.plate == 'AAA-1111' &&
    login_data.value.phone_number == '0909123456'
  ) {
    login_result.value = 'success'
    router.push('/apply-staff-parking/step3_2')
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
  <StepNavigator :currentStep="current_step" />
  <form>
    <div class="mb-3">
      <label for="plate" class="form-label">
        {{ $t('pages.applyStaffParking.loginAndUpload.plate') }}
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
  </form>
  <button class="btn btn-secondary w-100" @click="loginAndUpload">
    {{ $t('pages.applyStaffParking.loginAndUpload.loginAndUpload') }}
  </button>
</template>
