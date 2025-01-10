<script setup>
import { onMounted, ref, watch } from 'vue'
import router from '@/router'
import Api from '@/api'
import { Modal } from 'bootstrap'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import TheCaptcha from '@/components/TheCaptcha.vue'
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import NotReadModal from '@/components/NotReadModal.vue'
import ConfirmCouponModal from '@/components/ConfirmCouponModal.vue'
import CaptchaErrorModal from '@/components/CaptchaErrorModal.vue'
import PdfViewer from '@/components/PdfViewer.vue'
const pdfUrl = '/documents/國立清華大學校園車輛管理辦法-1130626.pdf'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useROCYear } from '@/composables/getCurrentROCYear'
const { rocYear, getROCYear } = useROCYear()
onMounted(() => {
  getROCYear()
})
import { useDonationOrganization } from '@/composables/useDonationOrganization'
const { donationOrganizationList } = useDonationOrganization()
import { generateUXB2BCode } from '@/composables/generateUXB2BCode'

const applicationData = ref({
  payment_method: '2', // 預設付費方式為計畫經費
  collection_method: '0', // 預設領券方式為電子郵件寄送
  captcha: '',
  CarrierType: '3J0001', // 預設為網優載具
  CarrierID1: '', // 載具顯碼
  CarrierID2: '', // 載具隱碼
  DonateMark: '0', // 捐贈註記，0：預設，無捐贈，1：捐贈
  NPOBAN: '' // 捐贈對象
})
const payment_methods = ref([
  { value: '2', labelKey: 'pages.preorderCoupon.payment.project' },
  { value: '4', labelKey: 'pages.preorderCoupon.payment.cash' },
])
let introductionModal = null
const showIntroductionModal = () => {
  const modalElement = document.getElementById('introductionModal')
  if (!introductionModal) {
    introductionModal = new Modal(modalElement)
  }
  introductionModal.show()
}

const closeIntroductionModal = () => {
  if (introductionModal) {
    introductionModal.hide()
  }
}
// 辦證說明閱讀狀態
const certificateApplicationInstructionsRead = ref(false)
const confirmAction = () => {
  certificateApplicationInstructionsRead.value = true
  closeIntroductionModal()
}
const invoice_needVat = ref(false)
// 驗證碼
const generatedCaptcha = ref('')
const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const baseRules = {
    applicant: { required: true },
    phone_number: { required: true, phone_number: true },
    email: { required: true, email: true },
    payment_method: { required: true },
    reason: { required: true },
    quantity: { required: true },
    collection_method: { required: true },
  }

  // 根據 payment_method 動態調整規則
  if (applicationData.value.payment_method === '2') {
    baseRules.project_number = { required: true }
    applicationData.value.company_name = ''
    applicationData.value.vat_number = ''
  } else if (applicationData.value.payment_method === '4') {
    // 選擇共通性載具，則載具欄位為必填
    if (applicationData.value.CarrierType == '3J0002') {
      baseRules.CarrierID1 = { required: true, CarrierID1: true }
    }
    // 選擇捐贈，則捐贈機構欄位為必填
    if (applicationData.value.DonateMark == true) {
      baseRules.NPOBAN = { required: true }
    }
    baseRules.company_name = { required: true }
    if (invoice_needVat.value) {
      baseRules.vat_number = { required: true, vat_number: true }
    }
    applicationData.value.project_number = ''
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errors: errorsResult } =
      formValidatorRef.value.validateForm(applicationData.value, baseRules)

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult

      showModal.value = true // 顯示驗證錯誤 Modal
    }

    return isValid
  } else {
    console.error('FormValidator reference is not correctly initialized.')
    return false
  }
}

watch(
  () => applicationData.value.DonateMark,
  (newValue) => {
    if (newValue == 1) {
      // DonateMark 勾選時
      applicationData.value.NPOBAN = ''; // NPOBAN 可選 (清空，讓使用者重新選擇)
      invoice_needVat.value = false; // 強制 invoice_needVat 為 false
      applicationData.value.vat_number = ''; // 清空統編
    } else {
      // DonateMark 未勾選時
      applicationData.value.NPOBAN = ''; // 確保 NPOBAN 為空
    }
  }
);

watch(
  () => invoice_needVat.value,
  (newValue) => {
    if (newValue) {
      applicationData.value.DonateMark = 0; // DonateMark 必須未勾選
    } else {
      applicationData.value.vat_number = ''
    }
  }
);

// 這個方法將由 ValidationModal 觸發來關閉 Modal
function closeValidatorModal() {
  showModal.value = false
}
// 是否成功送出申請
const formatApplicationData = ref({})
async function prepareApplicationData() {
  if (applicationData.value.CarrierType == '3J0001') {
    applicationData.value.CarrierID1 = generateUXB2BCode(applicationData.value.phone_number)
  }
  applicationData.value.CarrierID2 = applicationData.value.CarrierID1
  await getFormInfo('抵用券')
  formatApplicationData.value = {
    title: form_info.value.title,
    form_code: form_info.value.form_code,
    academic_year: rocYear.value,
    applicant_type: 0,
    applicant: applicationData.value.applicant,
    phone_number: applicationData.value.phone_number,
    email: applicationData.value.email,
    payment_method: applicationData.value.payment_method,
    project_number: applicationData.value.project_number,
    company_name: applicationData.value.company_name,
    buyer_tax_id: applicationData.value.vat_number,
    reason_application: applicationData.value.reason,
    coupon_quantity: applicationData.value.quantity,
    receive_method: applicationData.value.collection_method,
    DonateMark: applicationData.value.DonateMark, // 捐贈註記
    NPOBAN: applicationData.value.NPOBAN, // 捐贈對象
    CarrierType: applicationData.value.CarrierType, // 載具類別
    CarrierID1: applicationData.value.CarrierID1, // 載具顯碼
    CarrierID2: applicationData.value.CarrierID2, // 載具隱碼
  }
}
async function submitApplication() {
  await prepareApplicationData()
  try {
    const response = await Api.post(
      '/main/applicationForm',
      formatApplicationData.value,
    )
    if (response.data.returnCode == 0) {
      router.replace({ name: 'applicationSuccess' })
    } else {
      showApplicatioinResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    showApplicatioinResultModal.value = true
  } finally {
    showConfirmCouponModal.value = false
  }
}
const showApplicatioinResultModal = ref(false) // 控制 Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
  showConfirmCouponModal.value = false
}

const showNotReadModal = ref(false) // 控制 未閱讀辦證說明Modal 顯示
const showConfirmCouponModal = ref(false) // 控制 確認送出申請Modal 顯示
const showCaptchaModal = ref(false) // 控制 驗證碼錯誤Modal 顯示
function handleSubmit() {
  if (formValidate()) {
    if (!certificateApplicationInstructionsRead.value) {
      showNotReadModal.value = true
    } else if (certificateApplicationInstructionsRead.value) {
      if (
        applicationData.value.captcha.toUpperCase() == generatedCaptcha.value
      ) {
        showConfirmCouponModal.value = true
      } else {
        showCaptchaModal.value = true
      }
    }
  }
}

function closeNotReadModal() {
  showNotReadModal.value = false
}
function closeConfirmCouponModal() {
  showConfirmCouponModal.value = false
}
function closeCaptchaModal() {
  showCaptchaModal.value = false
}
</script>
<template>
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="mb-3">
      <label for="applicant" class="form-label">
        {{ $t('pages.preorderCoupon.applicant') }}
      </label>
      <input type="text" class="form-control" id="applicant" v-model="applicationData.applicant" />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.preorderCoupon.phone_number') }}
      </label>
      <input type="text" class="form-control" id="phone_number" v-model="applicationData.phone_number" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.preorderCoupon.email') }}
      </label>
      <input type="email" class="form-control" id="email" v-model="applicationData.email" />
    </div>
    <div class="mb-3">
      <label for="payment_method" class="form-label">
        {{ $t('pages.preorderCoupon.payment.title') }}
      </label>
      <select class="form-select" v-model="applicationData.payment_method">
        <option v-for="item in payment_methods" :key="item.value" :value="item.value">
          {{ $t(item.labelKey) }}
        </option>
      </select>
    </div>
    <div v-if="applicationData.payment_method == 2">
      <div class="mb-3">
        <label for="project_number" class="form-label">
          {{ $t('pages.preorderCoupon.project_number') }}
        </label>
        <input type="text" class="form-control" id="project_number" v-model="applicationData.project_number" />
      </div>
    </div>
    <div v-if="applicationData.payment_method == 4">
      <div class="mb-3">
        {{
          $t(
            'pages.preorderCoupon.invoice.title',
          )
        }}
        <div class="invoice-section p-2">

          <div class="d-flex flex-column flex-md-row gap-md-5">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="carrierType1" id="carrierType1"
                v-model="applicationData.CarrierType" value="3J0001" />
              <label class="form-check-label" for="carrierType1">
                {{ $t('pages.preorderCoupon.invoice.uxb2b') }}
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="carrierType2" id="carrierType2"
                v-model="applicationData.CarrierType" value="3J0002" />
              <label class="form-check-label" for="carrierType2">
                {{ $t('pages.preorderCoupon.invoice.mobile_carrier') }}
              </label>
            </div>
          </div>
          <div class="mb-3" v-if="applicationData.CarrierType == '3J0002'">
            <input type="text" class="form-control" id="CarrierID1" v-model="applicationData.CarrierID1" />
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="DonateMark" id="DonateMark"
              v-model="applicationData.DonateMark" true-value="1" false-value="0" />
            <label class="form-check-label" for="DonateMark">
              {{ $t('pages.preorderCoupon.invoice.donate') }}
            </label>
          </div>
          <select class="form-select" v-model="applicationData.NPOBAN" :disabled="applicationData.DonateMark == 0">
            <option v-for="item in donationOrganizationList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
          <hr>
          <div class="mb-3">
            <div class="d-flex flex-column flex-md-row gap-md-5">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="invoice_needVat1" v-model="invoice_needVat" :value=true
                  :disabled="applicationData.DonateMark == 1" />
                <label class="form-check-label" for="invoice_needVat1">
                  {{ $t('pages.preorderCoupon.invoice.withVat') }}
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="invoice_needVat2" v-model="invoice_needVat"
                  :value=false />
                <label class="form-check-label" for="invoice_needVat2">
                  {{ $t('pages.preorderCoupon.invoice.withoutVat') }}
                </label>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="company_name" class="form-label">
              {{ $t('pages.preorderCoupon.invoice.company_name') }}
            </label>
            <input type="text" class="form-control" id="company_name" v-model="applicationData.company_name" />
          </div>
          <div class="mb-3">
            <label for="vat_number" class="form-label">
              {{ $t('pages.preorderCoupon.invoice.vat_number') }}
            </label>
            <input type="text" class="form-control" id="vat_number" :disabled="invoice_needVat == false"
              v-model="applicationData.vat_number" />
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="reason" class="form-label">
        {{ $t('pages.preorderCoupon.reason') }}
      </label>
      <textarea type="text" rows="5" cols="20" class="form-control" id="reason" v-model="applicationData.reason">
      </textarea>
    </div>
    <div class="mb-3">
      <label for="quantity" class="form-label">
        {{ $t('pages.preorderCoupon.quantity') }}
      </label>
      <input type="number" class="form-control" id="quantity" v-model="applicationData.quantity" />
    </div>
    <div class="mb-3">
      {{ $t('pages.preorderCoupon.collection_method') }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input class="form-check-input" type="radio" id="collection_method1"
            v-model="applicationData.collection_method" value="0" />
          <label class="form-check-label" for="collection_method1">
            {{ $t('pages.preorderCoupon.by_email') }}
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="collection_method2"
            v-model="applicationData.collection_method" value="1" />
          <label class="form-check-label" for="collection_method2">
            {{ $t('pages.preorderCoupon.physical') }}
          </label>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <button type="button" class="btn btn-secondary fw-bold w-100" :class="{
        btn: true,
        'btn-dark': !certificateApplicationInstructionsRead,
        'btn-secondary': certificateApplicationInstructionsRead,
        'fw-bold': certificateApplicationInstructionsRead,
        'w-100': true,
      }" :style="{
        color: certificateApplicationInstructionsRead
          ? '#702f9f'
          : 'lightgray',
      }" @click="showIntroductionModal">
        <i class="bi bi-check-circle"></i>
        {{ $t('pages.preorderCoupon.certificateApplicationInstructionsRead') }}
      </button>
    </div>
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <label for="captcha" class="form-label text-nowrap m-0">
            {{ $t('pages.preorderCoupon.captcha') }}
          </label>
          <input type="text" class="form-control" id="captcha" v-model="applicationData.captcha" />
        </div>
        <div class="captcha m-0">
          <TheCaptcha v-model:captchaText="generatedCaptcha" />
        </div>
      </div>
    </div>
    <div class="text-center">
      <button class="btn btn-secondary w-100" @click.prevent="handleSubmit">
        {{ $t('pages.preorderCoupon.apply') }}
      </button>
    </div>
  </form>
  <!-- 辦證說明 modal 開始 -->
  <div class="modal fade" id="introductionModal" tabindex="-1" aria-labelledby="introductionModalLabel">
    <div class="modal-dialog modal-fullscreen modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="introductionModalModalLabel">
            {{
              $t(
                'pages.applyFacultyStudentParking.uploadDocuments.certificateApplicationInstructionsTitle',
              )
            }}
          </h5>
          <button type="button" class="btn-close" @click="closeIntroductionModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <PdfViewer :pdfUrl="pdfUrl" />
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary fw-bold" @click="closeIntroductionModal">
            {{ $t('pages.applyFacultyStudentParking.uploadDocuments.cancel') }}
          </p>
          <p class="pointer text-primary fw-bold" @click="confirmAction">
            {{ $t('pages.applyFacultyStudentParking.uploadDocuments.confirm') }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 辦證說明 modal 結束 -->
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal :showModal="showModal" :errors="errors" @close="closeValidatorModal" />
  <!-- 確認送出申請資料 modal -->
  <ConfirmCouponModal :showConfirmCouponModal="showConfirmCouponModal" @close="closeConfirmCouponModal"
    @apply="submitApplication" />
  <!-- 未閱讀辦證說明 modal 開始 -->
  <NotReadModal :showNotReadModal="showNotReadModal" @close="closeNotReadModal" />
  <!-- 驗證碼不正確 modal 開始 -->
  <CaptchaErrorModal :showCaptchaModal="showCaptchaModal" @close="closeCaptchaModal" />
  <!-- 提交申請結果 modal 開始 -->
  <ApplicatioinResultModal :showApplicatioinResultModal="showApplicatioinResultModal"
    @close="closeApplicatioinResultModal" />
</template>
<style scoped>
.pointer {
  cursor: pointer;
}

textarea {
  resize: none;
}

.invoice-section {
  border: 2px solid darkgray;
  border-radius: 5px;
}
</style>
