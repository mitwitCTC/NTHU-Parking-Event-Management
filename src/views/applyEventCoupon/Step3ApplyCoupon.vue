<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
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
const applicationData = ref({
  payment_method: '2', // 預設付費方式為計畫經費
  collection_method: '0', // 預設領券方式為電子郵件寄送
  captcha: '',
})
async function getaAplicationData() {
  ;(applicationData.value.applicant = '金城武'),
    (applicationData.value.email = 'YYY@ess.nthu.edu.tw'),
    (applicationData.value.phone_number = '0900123456')
}
onMounted(() => {
  getaAplicationData()
})
const payment_methods = ref([
  { value: '2', labelKey: 'pages.applyEventCoupon.coupon.payment.project' },
  { value: '4', labelKey: 'pages.applyEventCoupon.coupon.payment.cash' },
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
const invoice_needVat = ref(null)
// 驗證碼
const generatedCaptcha = ref('')
const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    payment_method: { required: true },
    // project_number: { required: true },
    reason: { required: true },
    quantity: { required: true },
    collection_method: { required: true },
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errors: errorsResult } =
      formValidatorRef.value.validateForm(applicationData.value, rules)

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult
      console.log(errors.value)

      // 設定錯誤訊息
      showModal.value = true // 顯示驗證錯誤 Modal
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
// 是否成功送出申請
const isApplicationSuccess = ref(false)
async function apply() {
  isApplicationSuccess.value = true
  router.replace('/application-success')
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
  <section>
    <p class="m-0">
      <span>{{ applicationData.applicant }}</span>
    </p>
    <p class="my-1">
      {{ applicationData.email }}
    </p>
    <p class="m-0">
      {{ applicationData.phone_number }}
    </p>
  </section>
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="my-3">
      <label for="payment_method" class="form-label">
        {{ $t('pages.applyEventCoupon.coupon.payment.title') }}
      </label>
      <select class="form-select" v-model="applicationData.payment_method">
        <option
          v-for="item in payment_methods"
          :key="item.value"
          :value="item.value"
        >
          {{ $t(item.labelKey) }}
        </option>
      </select>
    </div>
    <div v-if="applicationData.payment_method == 2">
      <div class="mb-3">
        <label for="project_number" class="form-label">
          {{ $t('pages.applyEventCoupon.coupon.project_number') }}
        </label>
        <input
          type="text"
          class="form-control"
          id="project_number"
          v-model="applicationData.project_number"
        />
      </div>
    </div>
    <div v-if="applicationData.payment_method == 4">
      <div class="mb-3">
        {{ $t('pages.applyEventCoupon.coupon.invoice.title') }}
        <div class="d-flex flex-column flex-md-row gap-md-5">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="invoice_needVat1"
              v-model="invoice_needVat"
              value="true"
            />
            <label class="form-check-label" for="invoice_needVat1">
              {{ $t('pages.applyEventCoupon.coupon.invoice.withVat') }}
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              id="invoice_needVat2"
              v-model="invoice_needVat"
              value="false"
            />
            <label class="form-check-label" for="invoice_needVat2">
              {{ $t('pages.applyEventCoupon.coupon.invoice.withoutVat') }}
            </label>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="company_name" class="form-label">
          {{ $t('pages.applyEventCoupon.coupon.invoice.company_name') }}
        </label>
        <input
          type="text"
          class="form-control"
          id="company_name"
          v-model="applicationData.company_name"
        />
      </div>
      <div class="mb-3">
        <label for="vat_number" class="form-label">
          {{ $t('pages.applyEventCoupon.coupon.invoice.vat_number') }}
        </label>
        <input
          type="text"
          class="form-control"
          id="vat_number"
          v-model="applicationData.vat_number"
        />
      </div>
    </div>
    <div class="mb-3">
      <label for="reason" class="form-label">
        {{ $t('pages.applyEventCoupon.coupon.reason') }}
      </label>
      <textarea
        type="text"
        rows="5"
        cols="20"
        class="form-control"
        id="reason"
        v-model="applicationData.reason"
      >
      </textarea>
    </div>
    <div class="mb-3">
      <label for="quantity" class="form-label">
        {{ $t('pages.applyEventCoupon.coupon.quantity') }}
      </label>
      <input
        type="number"
        class="form-control"
        id="quantity"
        v-model="applicationData.quantity"
      />
    </div>
    <div class="mb-3">
      {{ $t('pages.applyEventCoupon.coupon.collection_method') }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="collection_method1"
            v-model="applicationData.collection_method"
            value="0"
          />
          <label class="form-check-label" for="collection_method1">
            {{ $t('pages.applyEventCoupon.coupon.by_email') }}
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="collection_method2"
            v-model="applicationData.collection_method"
            value="1"
          />
          <label class="form-check-label" for="collection_method2">
            {{ $t('pages.applyEventCoupon.coupon.physical') }}
          </label>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <button
        type="button"
        class="btn btn-secondary fw-bold w-100"
        :class="{
          btn: true,
          'btn-dark': !certificateApplicationInstructionsRead,
          'btn-secondary': certificateApplicationInstructionsRead,
          'fw-bold': certificateApplicationInstructionsRead,
          'w-100': true,
        }"
        :style="{
          color: certificateApplicationInstructionsRead
            ? '#702f9f'
            : 'lightgray',
        }"
        @click="showIntroductionModal"
      >
        <i class="bi bi-check-circle"></i>
        {{
          $t(
            'pages.applyEventCoupon.coupon.certificateApplicationInstructionsRead',
          )
        }}
      </button>
    </div>
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <label for="captcha" class="form-label text-nowrap m-0">
            {{ $t('pages.applyEventCoupon.coupon.captcha') }}
          </label>
          <input
            type="text"
            class="form-control"
            id="captcha"
            v-model="applicationData.captcha"
          />
        </div>
        <div class="captcha m-0">
          <TheCaptcha v-model:captchaText="generatedCaptcha" />
        </div>
      </div>
    </div>
    <div class="text-center">
      <button class="btn btn-secondary w-100" @click.prevent="handleSubmit">
        {{ $t('pages.applyEventCoupon.coupon.apply') }}
      </button>
    </div>
  </form>
  <!-- 辦證說明 modal 開始 -->
  <div
    class="modal fade"
    id="introductionModal"
    tabindex="-1"
    aria-labelledby="introductionModalLabel"
  >
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
          <button
            type="button"
            class="btn-close"
            @click="closeIntroductionModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <PdfViewer :pdfUrl="pdfUrl" />
        </div>
        <div class="modal-footer">
          <p
            class="pointer text-primary fw-bold"
            @click="closeIntroductionModal"
          >
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
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
  <!-- 確認送出申請資料 modal -->
  <ConfirmCouponModal
    :showConfirmCouponModal="showConfirmCouponModal"
    @close="closeConfirmCouponModal"
    @apply="apply"
  />
  <!-- 未閱讀辦證說明 modal 開始 -->
  <NotReadModal
    :showNotReadModal="showNotReadModal"
    @close="closeNotReadModal"
  />
  <!-- 驗證碼不正確 modal 開始 -->
  <CaptchaErrorModal
    :showCaptchaModal="showCaptchaModal"
    @close="closeCaptchaModal"
  />
  <!-- 提交申請結果 modal 開始 -->
  <ApplicatioinResultModal
    :showApplicatioinResultModal="showApplicatioinResultModal"
    @close="closeApplicatioinResultModal"
  />
</template>
<style scoped>
textarea {
  resize: none;
}
</style>
