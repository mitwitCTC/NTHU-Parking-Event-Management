<script setup>
import Api from '@/api'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useSerialStore } from '@/stores/serial_numberStore'
const serialStore = useSerialStore()
import router from '@/router'
import { ref } from 'vue'
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
  captcha: '',
  document_list: Array(3).fill(null),
})

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
  await getFormInfo('活動')
  const form_code = form_info.value.form_code
  // 備份原始 document_list 資料
  const originalDocumentList = [...applicationData.value.document_list]
  applicationData.value.document_list =
    applicationData.value.document_list.filter(file => file !== null)
  const serialNumber = serialStore.getSerialNumber(form_code)
  const formData = new FormData()
  if (!serialNumber) {
    console.error('表單序號不存在')
    return false
  }
  // 添加 serial_number 至 formData
  formData.append('serial_number', serialNumber)

  // 檢查文件列表是否有效
  const validFiles = applicationData.value.document_list.filter(file => file)

  // 添加檔案至 FormData
  validFiles.forEach(file => {
    if (file instanceof File) {
      formData.append('file', file)
    } else {
      console.error('無效檔案', file)
    }
  })

  try {
    const response = await Api.post('/main/uploadDocuments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.returnCode == 0) {
      // 文件上傳成功
      serialStore.clearSerialNumber(form_code)
      router.replace('/application-success')
    } else {
      console.error('文件上傳失敗', response)
      // 恢復 document_list 為原始資料
      applicationData.value.document_list = [...originalDocumentList]
      showApplicatioinResultModal.value = true
      return false
    }
  } catch (error) {
    //  恢復 document_list 為原始資料
    applicationData.value.document_list = [...originalDocumentList]
    console.error('上傳文件時發生錯誤', error)
    showApplicatioinResultModal.value = true
    return false
  } finally {
    showConfirmModal.value = false
  }
}
const showApplicatioinResultModal = ref(false) // 控制 Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
}
</script>
<template>
  <form class="mt-5">
    <div class="mb-3">
      <p>
        {{ $t('pages.applyEvent.upload.title') }}
      </p>
      <div
        v-for="(file, index) in applicationData.document_list"
        :key="index"
        class="bg-secondary mb-3 d-flex justify-content-around justify-content-md-center align-items-center upload position-relative pointer"
        @click="!file && $refs[`fileInput${index}`][0].click()"
      >
        <p class="fs-4 fw-bold px-1 py-3 align-content-center m-0">
          {{ file?.name || $t('pages.applyEvent.upload.upload') + (index + 1) }}
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
          $t('pages.applyEvent.upload.certificateApplicationInstructionsRead')
        }}
      </button>
    </div>
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <label for="captcha" class="form-label text-nowrap m-0">
            {{ $t('pages.applyEvent.upload.captcha') }}
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
        @click.prevent="handleSubmit"
      >
        {{ $t('pages.applyEvent.upload.apply') }}
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
                'pages.applyEvent.upload.certificateApplicationInstructionsTitle',
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
            {{ $t('pages.applyEvent.upload.cancel') }}
          </p>
          <p class="pointer text-primary fw-bold" @click="confirmAction">
            {{ $t('pages.applyEvent.upload.confirm') }}
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
