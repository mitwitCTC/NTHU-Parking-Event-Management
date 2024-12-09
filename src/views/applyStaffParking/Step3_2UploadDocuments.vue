<script setup>
// import router from '@/router'
import { onMounted, ref } from 'vue'
import TheCaptcha from '@/components/TheCaptcha.vue'
import { Modal } from 'bootstrap'
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import NotReadModal from '@/components/NotReadModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CaptchaErrorModal from '@/components/CaptchaErrorModal.vue'

import PdfViewer from '@/components/PdfViewer.vue'
const pdfUrl = '/documents/國立清華大學校園車輛管理辦法-1130626.pdf'
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

const confirmAction = () => {
  certificateApplicationInstructionsRead.value = true
  closeIntroductionModal()
}
const applicationData = ref({
  vehicle_registered_list: [],
  selectedCommuteDistance: '',
  document_list: Array(5).fill(null),
  campusToReceiveCertificate: '1', // 預設在校本部領證
})
async function getVehicle_registered_list() {
  applicationData.value.vehicle_registered_list = [
    {
      plate: 'RCC-7788',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WM',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WM',
    },
  ]
}
onMounted(() => {
  getVehicle_registered_list()
})
// 車證型態對照表
const main_pass_code_list = [
  {
    code: 'WC',
    des: '工作證汽車識別證',
  },
  {
    code: 'WM',
    des: '工作機車識別證',
  },
]

// 通勤距離
const commuteDistances = [
  { value: '5-10km', labelKey: 'commute_distances.5_10km' },
  { value: '10-20km', labelKey: 'commute_distances.10_20km' },
  { value: '20-30km', labelKey: 'commute_distances.20_30km' },
  { value: '30-40km', labelKey: 'commute_distances.30_40km' },
  { value: '40-50km', labelKey: 'commute_distances.40_50km' },
  { value: '50km 以上', labelKey: 'commute_distances.over_50km' },
]
// 被選中的通勤距離（假設初始為5-10km）
applicationData.value.selectedCommuteDistance = '5-10km'

// 上傳證件
function handleFileUpload(event, index) {
  const file = event.target.files[0]
  if (file) {
    applicationData.value.document_list[index] = file
  }
}
// 刪除上傳的證件
function removeFile(index) {
  applicationData.value.document_list[index] = null
}

// 辦證說明閱讀狀態
const certificateApplicationInstructionsRead = ref(false)
// 驗證碼
const generatedCaptcha = ref('')

const showNotReadModal = ref(false)
const showCaptchaModal = ref(false)
const showConfirmModal = ref(false) // 控制 確認送出申請Modal 顯示
function closeNotReadModal() {
  showNotReadModal.value = false
}
function closeConfirmModal() {
  showConfirmModal.value = false
}
function closeCaptchaModal() {
  showCaptchaModal.value = false
}
function handleSubmit() {
  if (!certificateApplicationInstructionsRead.value) {
    showNotReadModal.value = true
  } else if (certificateApplicationInstructionsRead.value) {
    if (applicationData.value.captcha.toUpperCase() == generatedCaptcha.value) {
      showConfirmModal.value = true
    } else {
      showCaptchaModal.value = true
    }
  }
}

async function apply() {
  // 備份原始 document_list 資料
  const originalDocumentList = [...applicationData.value.document_list]
  applicationData.value.document_list =
    applicationData.value.document_list.filter(file => file !== null)
  isApplicationSuccess.value = true
  if (isApplicationSuccess.value) {
    console.log(applicationData.value)
    showConfirmModal.value = false
    // router.push('/application-success')
  } else {
    // 恢復 document_list 原始資料
    applicationData.value.document_list = [...originalDocumentList]
    showConfirmModal.value = false
    showApplicatioinResultModal.value = true
  }
}
// 是否成功送出申請
const isApplicationSuccess = ref(false)
const showApplicatioinResultModal = ref(false) // 控制 Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
}
</script>
<template>
  <section>
    <p class="mt-3">
      {{ $t('pages.applyStaffParking.uploadDocuments.plate_registered') }}
    </p>
    <div class="registered-list border rounded vehicle-registration">
      <ul>
        <li
          v-for="(item, index) in applicationData.vehicle_registered_list"
          :key="index"
        >
          <p>
            <span class="me-3">{{ item.plate }}</span>
            <span>
              {{
                main_pass_code_list.find(
                  code => code.code === item.main_pass_code,
                )?.des || '未知'
              }}
            </span>
          </p>
        </li>
      </ul>
    </div>
  </section>
  <form class="mt-5">
    <div class="mb-3">
      <label for="car_type" class="form-label">
        {{ $t('pages.applyStaffParking.uploadDocuments.distance') }}
      </label>
      <select
        class="form-select"
        v-model="applicationData.selectedCommuteDistance"
      >
        <option
          v-for="item in commuteDistances"
          :key="item.value"
          :value="item.value"
        >
          {{ $t(item.labelKey) }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <p>
        {{ $t('pages.applyStaffParking.uploadDocuments.upload') }}
      </p>
      <div
        v-for="(file, index) in applicationData.document_list"
        :key="index"
        class="bg-secondary mb-3 d-flex justify-content-around justify-content-md-center align-items-center upload position-relative pointer"
        @click="!file && $refs[`fileInput${index}`][0].click()"
      >
        <p class="fs-4 fw-bold px-1 py-3 align-content-center m-0">
          {{
            file?.name ||
            $t('pages.applyStaffParking.uploadDocuments.upload') + (index + 1)
          }}
        </p>

        <div v-if="!file" class="img-container">
          <img src="/images/upload/upload.svg" alt="upload" />
        </div>

        <button
          v-if="file"
          type="button"
          class="btn btn-sm position-absolute top-25 end-0"
          @click.stop="removeFile(index)"
        >
          X
        </button>

        <input
          type="file"
          :ref="`fileInput${index}`"
          class="d-none"
          @change="handleFileUpload($event, index)"
        />
      </div>
    </div>
    <div class="mb-3">
      {{
        $t('pages.applyStaffParking.uploadDocuments.campusToReceiveCertificate')
      }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="campusToReceiveCertificate1"
            v-model="applicationData.campusToReceiveCertificate"
            value="1"
          />
          <label class="form-check-label" for="campusToReceiveCertificate1">
            {{ $t('pages.applyStaffParking.uploadDocuments.primaryCampus') }}
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="campusToReceiveCertificate2"
            v-model="applicationData.campusToReceiveCertificate"
            value="2"
          />
          <label class="form-check-label" for="campusToReceiveCertificate2">
            {{ $t('pages.applyStaffParking.uploadDocuments.nanDaCampus') }}
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
            'pages.applyStaffParking.uploadDocuments.certificateApplicationInstructionsRead',
          )
        }}
      </button>
    </div>
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <label for="captcha" class="form-label text-nowrap m-0">
            {{ $t('pages.applyStaffParking.uploadDocuments.captcha') }}
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
      <button
        class="btn btn-secondary w-100"
        :disabled="applicationData.document_list.every(doc => doc === null)"
        @click="handleSubmit"
      >
        {{ $t('pages.applyStaffParking.uploadDocuments.apply') }}
      </button>
    </div>
  </form>
  <!-- 辦證說明 modal 開始 -->
  <div
    class="modal fade"
    id="introductionModal"
    tabindex="-1"
    aria-labelledby="introductionModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-fullscreen modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="introductionModalModalLabel">
            {{
              $t(
                'pages.applyStaffParking.uploadDocuments.certificateApplicationInstructionsTitle',
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
            {{ $t('pages.applyStaffParking.uploadDocuments.cancel') }}
          </p>
          <p class="pointer text-primary fw-bold" @click="confirmAction">
            {{ $t('pages.applyStaffParking.uploadDocuments.confirm') }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 辦證說明 modal 結束 -->
  <!-- 確認送出申請資料 modal -->
  <ConfirmModal
    :showConfirmModal="showConfirmModal"
    @close="closeConfirmModal"
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
  <!-- 提交申請結果 modal 結束 -->
</template>

<style scoped>
.vehicle-registration {
  height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
}

.img-container {
  padding: 10px;
  width: 60px;
  height: 60px;
}
img {
  width: 100%;
  height: 100%;
}

.pointer {
  cursor: pointer;
}
</style>
