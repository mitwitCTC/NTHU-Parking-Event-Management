<script setup>
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import Api from '@/api'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useAcademicYears } from '@/composables/getAcademicYears.js'
const { academicYears } = useAcademicYears('/api/academic-years')
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import PendingReviewRestrictionModal from '@/components/PendingReviewRestrictionModal.vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'

const facultyStudentStore = useFacultyStudentStore()

const applicant_data = ref({
  has_disability_certificate: '0', // 預設未持有身心障礙手冊
  academic_year: '', // 學年
  email: '', // 電子郵件
  phone_number: '', // 電話號碼
})

// 取得基本資料
async function getBasic_info() {
  applicant_data.value.applicant_type = '2'
  applicant_data.value.applicant_type_title = '在職教職員工'
  applicant_data.value.applicant_source = '課務組'
  applicant_data.value.applicant = '王大明'
  applicant_data.value.applicant_number = 'A09035'
  applicant_data.value.email = 'DM.Wang@ess.nthu.edu.tw'
  applicant_data.value.phone_number = '0960712213'
  generateSerialNumber()
}
const showApplicatioinResultModal = ref(false) // 控制 提交失敗結果Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
}

const ischeckingPlateCount = ref(false) // 等待確認車輛數資料回傳中
const showPendingReviewRestrictionModal = ref(false) // 有審核中/待審核申請 Modal
// 確認車輛數
async function checkPlateCount() {
  ischeckingPlateCount.value = true
  try {
    const response = await Api.post('/main/plateCount', {
      academic_year: applicant_data.value.academic_year,
      applicant_number: applicant_data.value.applicant_number,
    })
    if (response.data.returnCode == -2) {
      showPendingReviewRestrictionModal.value = true
    } else if (response.data.returnCode == 0) {
      if (response.data.message === '目前已登記車輛數') {
        facultyStudentStore.filterAndCalculatePassCodes(response.data.data)
      } else if (response.data.message === '無資料') {
        facultyStudentStore.setPermitTypeRemaining([
          { main_pass_code: 'TC', remaining_count: 5 },
          { main_pass_code: 'TE', remaining_count: 5 },
        ])
      }
    } else {
      showApplicatioinResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    showApplicatioinResultModal.value = true
  } finally {
    ischeckingPlateCount.value = false
  }
}
function closePendingReviewRestrictionModal() {
  showPendingReviewRestrictionModal.value = false
  router.push({ name: 'Home' })
}

// 建立表單序號
function generateSerialNumber() {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 取西元年後兩碼
  const month = String(now.getMonth() + 1).padStart(2, '0') // 月份補零
  const date = String(now.getDate()).padStart(2, '0') // 日期補零
  const hours = String(now.getHours()).padStart(2, '0') // 小時補零
  const minutes = String(now.getMinutes()).padStart(2, '0') // 分鐘補零
  const seconds = String(now.getSeconds()).padStart(2, '0') // 秒數補零
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0') // 毫秒補零

  // 組合表單序號
  const serialNumber = `C${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`

  // 將表單序號寫入 applicant_data.value
  applicant_data.value.serial_number = serialNumber
}

onMounted(() => {
  getBasic_info()
})

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    email: { required: true, email: true },
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

// 前往登記車輛頁面
function next() {
  if (formValidate()) {
    facultyStudentStore.setApplicantData(applicant_data.value)
    router.push({ name: 'ApplyFacultyStudentParking_step2' })
  }
}

// 這個方法將由 ValidationModal 觸發來關閉 Modal
function closeValidatorModal() {
  showModal.value = false
}
</script>

<template>
  <div>
    <!-- 引入 FormValidator 元件 -->
    <FormValidator ref="formValidatorRef" />

    <loading :active="ischeckingPlateCount" :is-full-page="true"></loading>
    <!-- <p v-if="ischeckingPlateCount" class="loading-overlay">載入中...</p> -->
    <section>
      <p class="m-0">
        <span>{{ applicant_data.applicant_type_title }}</span>
        <span>／</span>
        <span>{{ applicant_data.applicant_source }}</span>
      </p>
      <p class="my-1">
        {{ applicant_data.applicant_number }}
      </p>
      <p class="m-0">
        {{ applicant_data.applicant }}
      </p>
    </section>
    <section>
      <form>
        <div class="my-3">
          <label for="academic_year" class="form-label">
            {{
              $t('pages.applyFacultyStudentParking.basic_info.academic_year')
            }}
          </label>
          <select
            class="form-select"
            v-model="applicant_data.academic_year"
            @change="checkPlateCount"
          >
            <option v-for="year in academicYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.email') }}
          </label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="applicant_data.email"
          />
        </div>
        <div class="mb-3">
          <label for="phone_number" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.phone_number') }}
          </label>
          <input
            type="text"
            class="form-control"
            id="phone_number"
            v-model="applicant_data.phone_number"
          />
        </div>
        <div class="mb-3">
          {{
            $t(
              'pages.applyFacultyStudentParking.basic_info.has_disability_certificate',
            )
          }}
          <div class="d-flex flex-column flex-md-row gap-md-5">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="campusToReceiveCertificate1"
                id="campusToReceiveCertificate1"
                v-model="applicant_data.has_disability_certificate"
                value="1"
              />
              <label class="form-check-label" for="campusToReceiveCertificate1">
                {{ $t('pages.applyFacultyStudentParking.basic_info.yes') }}
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="campusToReceiveCertificate2"
                id="campusToReceiveCertificate2"
                v-model="applicant_data.has_disability_certificate"
                value="0"
              />
              <label class="form-check-label" for="campusToReceiveCertificate2">
                {{ $t('pages.applyFacultyStudentParking.basic_info.no') }}
              </label>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-secondary" @click.prevent="next">
            {{ $t('pages.applyFacultyStudentParking.basic_info.next') }}
          </button>
        </div>
      </form>
    </section>

    <!-- 提交申請失敗 modal 開始 -->
    <ApplicatioinResultModal
      :showApplicatioinResultModal="showApplicatioinResultModal"
      @close="closeApplicatioinResultModal"
    />
    <!-- 申請限制 modal  -->
    <PendingReviewRestrictionModal
      :showPendingReviewRestrictionModal="showPendingReviewRestrictionModal"
      @close="closePendingReviewRestrictionModal"
    />
    <!-- 引入 ValidationModal 元件 -->
    <ValidationModal
      :showModal="showModal"
      :errors="errors"
      @close="closeValidatorModal"
    />
  </div>
</template>
