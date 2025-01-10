<script setup>
import { ref, watch, onMounted } from 'vue'
import StepNavigator from '@/components/StepNavigator.vue'
import router from '@/router'
import { useStaffStore } from '@/stores/staffStore'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useAcademicYears } from '@/composables/getAcademicYears.js'
const { academicYears } = useAcademicYears('/api/academic-years')
import { useDonationOrganization } from '@/composables/useDonationOrganization'
const { donationOrganizationList } = useDonationOrganization()
import { generateUXB2BCode } from '@/composables/generateUXB2BCode'


const currentStep = ref(1)
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
const staffStore = useStaffStore()

const invoice_needVat = ref(false)
// 申請人資料
const applicant_data = ref({
  campusToReceiveCertificate: '1', // 預設在校本部領證
  CarrierType: '3J0001', // 預設為網優載具
  CarrierID1: '', // 載具顯碼
  CarrierID2: '', // 載具隱碼
  DonateMark: '0', // 捐贈註記，0：預設，無捐贈，1：捐贈
  NPOBAN: '' // 捐贈對象
})
onMounted(() => {
  staffStore.getApplicantData()
  if (staffStore.applicant_data != {}) {
    Object.assign(applicant_data.value, staffStore.applicant_data)
  }
  if (staffStore.applicant_data.vat_number != '') {
    invoice_needVat.value = true
  }
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

  // 選擇共通性載具，則載具欄位為必填
  if (applicant_data.value.CarrierType == '3J0002') {
    rules.CarrierID1 = { required: true, CarrierID1: true }
  }
  // 選擇捐贈，則捐贈機構欄位為必填
  if (applicant_data.value.DonateMark == true) {
    rules.NPOBAN = { required: true }
  }
  // 如果需開立統編，則統編欄位為必填
  if (invoice_needVat.value) {
    rules.vat_number = { required: true, vat_number: true }
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errors: errorsResult } =
      formValidatorRef.value.validateForm(applicant_data.value, rules)

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult

      // 設定錯誤訊息
      showModal.value = true // 顯示驗證錯誤 Modal
    }

    return isValid
  } else {
    console.error('FormValidator reference is not correctly initialized.')
    return false
  }
}

watch(
  () => applicant_data.value.DonateMark,
  (newValue) => {
    if (newValue == 1) {
      // DonateMark 勾選時
      applicant_data.value.NPOBAN = ''; // NPOBAN 可選 (清空，讓使用者重新選擇)
      invoice_needVat.value = false; // 強制 invoice_needVat 為 false
      applicant_data.value.vat_number = ''; // 清空統編
    } else {
      // DonateMark 未勾選時
      applicant_data.value.NPOBAN = ''; // 確保 NPOBAN 為空
    }
  }
);

watch(
  () => invoice_needVat.value,
  (newValue) => {
    if (newValue) {
      applicant_data.value.DonateMark = 0; // DonateMark 必須未勾選
    } else {
      applicant_data.value.vat_number = ''
    }
  }
);

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
    formatApplicationData()
    staffStore.setApplicantData(applicant_data.value)
    router.push('/apply-staff-parking/step2')
  }
}

// 處理申請人資料
function formatApplicationData() {
  if (applicant_data.value.CarrierType == '3J0001') {
    applicant_data.value.CarrierID1 = generateUXB2BCode(applicant_data.value.phone_number)
  }
  applicant_data.value.CarrierID2 = applicant_data.value.CarrierID1
}
</script>

<template>
  <StepNavigator :currentStep="currentStep" :steps="steps" />
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="mb-3">
      <label for="applicant" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.applicant') }}
      </label>
      <input type="text" class="form-control" id="applicant" v-model="applicant_data.applicant" />
    </div>
    <div class="mb-3">
      <label for="applicant_source" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.applicant_source') }}
      </label>
      <input type="text" class="form-control" id="applicant_source" v-model="applicant_data.applicant_source" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.email') }}
      </label>
      <input type="mail" class="form-control" id="email" v-model="applicant_data.email" />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyStaffParking.basic_info.phone_number') }}
      </label>
      <input type="text" class="form-control" id="phone_number" v-model="applicant_data.phone_number" />
    </div>
    <div class="mb-3">
      {{
        $t('pages.applyStaffParking.uploadDocuments.campusToReceiveCertificate')
      }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input class="form-check-input" type="radio" id="campusToReceiveCertificate1"
            v-model="applicant_data.campusToReceiveCertificate" value="1" />
          <label class="form-check-label" for="campusToReceiveCertificate1">
            {{ $t('pages.applyStaffParking.uploadDocuments.primaryCampus') }}
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="campusToReceiveCertificate2"
            v-model="applicant_data.campusToReceiveCertificate" value="2" />
          <label class="form-check-label" for="campusToReceiveCertificate2">
            {{ $t('pages.applyStaffParking.uploadDocuments.nanDaCampus') }}
          </label>
        </div>
      </div>
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
    <div class="mb-3">
      {{
        $t(
          'pages.applyStaffParking.basic_info.invoice.title',
        )
      }}
      <div class="invoice-section p-2">

        <div class="d-flex flex-column flex-md-row gap-md-5">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="carrierType1" id="carrierType1"
              v-model="applicant_data.CarrierType" value="3J0001" />
            <label class="form-check-label" for="carrierType1">
              {{ $t('pages.applyStaffParking.basic_info.invoice.uxb2b') }}
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="carrierType2" id="carrierType2"
              v-model="applicant_data.CarrierType" value="3J0002" />
            <label class="form-check-label" for="carrierType2">
              {{ $t('pages.applyStaffParking.basic_info.invoice.mobile_carrier') }}
            </label>
          </div>
        </div>
        <div class="mb-3" v-if="applicant_data.CarrierType == '3J0002'">
          <input type="text" class="form-control" id="CarrierID1" v-model="applicant_data.CarrierID1" />
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" name="DonateMark" id="DonateMark"
            v-model="applicant_data.DonateMark" true-value="1" false-value="0" />
          <label class="form-check-label" for="DonateMark">
            {{ $t('pages.applyStaffParking.basic_info.invoice.donate') }}
          </label>
        </div>
        <select class="form-select" v-model="applicant_data.NPOBAN" :disabled="applicant_data.DonateMark == 0">
          <option v-for="item in donationOrganizationList" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <hr>
        <div class="mb-3">
          <div class="d-flex flex-column flex-md-row gap-md-5">
            <div class="form-check">
              <input class="form-check-input" type="radio" id="invoice_needVat1" v-model="invoice_needVat" :value=true
                :disabled="applicant_data.DonateMark == 1" />
              <label class="form-check-label" for="invoice_needVat1">
                {{ $t('pages.applyStaffParking.basic_info.invoice.withVat') }}
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" id="invoice_needVat2" v-model="invoice_needVat"
                :value=false />
              <label class="form-check-label" for="invoice_needVat2">
                {{ $t('pages.applyStaffParking.basic_info.invoice.withoutVat') }}
              </label>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="company_name" class="form-label">
            {{ $t('pages.applyStaffParking.basic_info.invoice.company_name') }}
          </label>
          <input type="text" class="form-control" id="company_name" v-model="applicant_data.company_name" />
        </div>
        <div class="mb-3">
          <label for="vat_number" class="form-label">
            {{ $t('pages.applyStaffParking.basic_info.invoice.vat_number') }}
          </label>
          <input type="text" class="form-control" id="vat_number" :disabled="invoice_needVat == false"
            v-model="applicant_data.vat_number" />
        </div>
      </div>
    </div>
    <div class="text-center">
      <button class="btn btn-secondary" @click.prevent="handleNext">
        {{ $t('pages.applyStaffParking.basic_info.next') }}
      </button>
    </div>
  </form>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal :showModal="showModal" :errors="errors" @close="closeValidatorModal" />
  <!-- 確認送出申請資料 modal -->
  <ConfirmModal :showConfirmModal="showConfirmModal" @close="closeConfirmModal" @apply="apply" />
</template>

<style scoped>
.pointer {
  cursor: pointer;
}

.invoice-section {
  border: 2px solid darkgray;
  border-radius: 5px;
}
</style>
