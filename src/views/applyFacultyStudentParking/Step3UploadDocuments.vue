<script setup>
import imageCompression from 'browser-image-compression'
import { onMounted, ref } from 'vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
import router from '@/router'
const facultyStudentStore = useFacultyStudentStore()
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import NotReadModal from '@/components/NotReadModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { Modal } from 'bootstrap'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import pacaApi from '@/pacaApi'
import Api from '@/api'
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

let deleteModal = null
const deleteVehicle_registered_data = ref({})
function openDeleteModal(index) {
  const modalElement = document.getElementById('deleteModal')
  if (!deleteModal) {
    deleteModal = new Modal(modalElement)
  }
  deleteModal.show()
  deleteVehicle_registered_data.value =
    applicationData.value.vehicle_registered_list[index]
  deleteVehicle_registered_data.value.index = index
}

function closeDeleteModal() {
  if (deleteModal) {
    deleteModal.hide()
  }
}

function deleteVehicle_registered() {
  applicationData.value.vehicle_registered_list.splice(
    deleteVehicle_registered_data.value.index,
    1,
  )
  closeDeleteModal()
  facultyStudentStore.setVehicleRegisteredList(
    applicationData.value.vehicle_registered_list,
  )
}

const applicationData = ref({
  basic_info: {},
  vehicle_registered_list: [],
  selectedCommuteDistance: '',
  document_list: Array(5).fill(null),
  campusToReceiveCertificate: '1', // 預設在校本部領證
})
onMounted(() => {
  facultyStudentStore.getVehicleRegisteredList() // 取得 vehicle_registered_list
  applicationData.value.vehicle_registered_list =
    facultyStudentStore.vehicle_registered_list
})
// 全部車證型態列表
const all_main_pass_code_list = [
  { code: 'TC', des: '教職員校內汽車識別證' },
  { code: 'TE', des: '職務宿舍區汽車識別證' },
  { code: 'SC', des: '學生汽車識別證' },
  { code: 'HF', des: '短期汽車識別證' },
  { code: 'TM', des: '教職員機車識別證' },
  { code: 'TME', des: '職務宿舍區機車識別證' },
  { code: 'SM', des: '學生機車識別證' },
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

async function compressImage(file) {
  try {
    const options = {
      maxSizeMB: 1, // 壓縮目標為 1MB 以下
      // maxWidthOrHeight: 1920, // 限制圖片最大寬度或高度
      useWebWorker: true, // 使用 Web Worker 加速壓縮
    }
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('壓縮圖片失敗：', error)
    return file // 如果壓縮失敗，回傳原始檔案
  }
}

// 上傳單筆證件
async function handleFileUpload(event, index) {
  const file = event.target.files[0]
  if (!file) return

  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/heic',
  ]
  const isPdf = file.type === 'application/pdf'
  const isImage = allowedImageTypes.includes(file.type)
  const maxPdfSize = 1 * 1024 * 1024 // 1MB for PDFs
  const maxImageSize = 5 * 1024 * 1024 // 5MB for images
  const compressionLimitSize = 1 * 1024 * 1024

  // 驗證檔案類型
  if (!isPdf && !isImage) {
    alert('只支援上傳 PDF 或圖片檔案！Only PDF or image files are supported.')
    event.target.value = '' // 清空檔案輸入
    return
  }

  // 驗證檔案大小
  if (isPdf && file.size > maxPdfSize) {
    alert(
      'PDF 檔案大小不可超過 1MB，請重新上傳！The PDF file size cannot exceed 1MB, please re-upload.',
    )
    event.target.value = '' // 清空檔案輸入
    return
  }
  if (isImage && file.size > maxImageSize) {
    alert(
      '圖片檔案大小不可超過 5MB，請重新上傳！The image file size cannot exceed 5MB, please re-upload.',
    )
    event.target.value = '' // 清空檔案輸入
    return
  }
  // 如果是圖片且大於 1MB，進行壓縮
  let finalFile = file
  if (isImage && file.size > compressionLimitSize) {
    finalFile = await compressImage(file)
  }
  // 更新檔案
  applicationData.value.document_list[index] = finalFile
}

// 刪除上傳的證件
function removeFile(index) {
  applicationData.value.document_list[index] = null
}
// 上傳證件
async function uploadDocuments() {
  // 備份原始 document_list 資料
  const originalDocumentList = [...applicationData.value.document_list]

  const formData = new FormData()

  // 檢查 serial_number 是否存在
  const serialNumber = formatApplicationData.value.serial_number
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
    if (file instanceof Blob) {
      formData.append('attachment', file, file.name)
    } else {
      console.error('無效檔案', file)
    }
  })

  try {
    const response = await pacaApi.post('/v2/forms/attachment', formData, {
      headers: {
        authorization:
          'jYs3u6lUwi4iwyvGCl0BPnPyefUfIVd1iGLcMUoFn0mWm2hLs04MY460IJbZTT9T+6+H+ejjAbzwzmW17aSX5+z3',
      },
    })

    if (response.status === 200) {
      // 文件上傳成功
      return true
    } else {
      console.error('文件上傳失敗', response)
      // 恢復 document_list 為原始資料
      applicationData.value.document_list = [...originalDocumentList]
      applicationData.value.vehicle_registered_list =
        facultyStudentStore.vehicle_registered_list
      showApplicatioinResultModal.value = true
      return false
    }
  } catch (error) {
    //  恢復 document_list 為原始資料
    applicationData.value.vehicle_registered_list =
      facultyStudentStore.vehicle_registered_list
    applicationData.value.document_list = [...originalDocumentList]
    console.error('上傳文件時發生錯誤', error.response?.data || error.message)
    showApplicatioinResultModal.value = true
    return false
  }
}

// 辦證說明閱讀狀態
const certificateApplicationInstructionsRead = ref(false)

// 處理送出的腳踏車登記資料
function formatBikeRegisteredList() {
  applicationData.value.vehicle_registered_list =
    applicationData.value.vehicle_registered_list.flatMap(item => {
      if (item.car_type_title === '腳踏車' && item.bike_num) {
        return Array(item.bike_num).fill({
          plate: item.plate,
          car_type: item.car_type,
          car_type_title: item.car_type_title,
          main_pass_code: item.main_pass_code,
        })
      } else {
        return item
      }
    })
}

const formatApplicationData = ref({})

async function apply() {
  await getFormInfo('停車證')
  // 備份原始 document_list 資料
  const originalDocumentList = [...applicationData.value.document_list]
  facultyStudentStore.getApplicantData()
  applicationData.value.basic_info = facultyStudentStore.applicant_data
  formatBikeRegisteredList()
  formatApplicationData.value = {
    serial_number: applicationData.value.basic_info.serial_number, //表單序號
    title: form_info.value.title, // 表單名稱
    academic_year: applicationData.value.basic_info.academic_year, // 學年
    form_code: form_info.value.form_code, // 表單代碼
    receive_location: applicationData.value.campusToReceiveCertificate, // 領取校區
    applicant_type: applicationData.value.basic_info.applicant_type, // 申請人類別
    applicant_number: applicationData.value.basic_info.applicant_number, // 申請人編號(學號或員編)
    applicant: applicationData.value.basic_info.applicant, // 申請人名稱
    email: applicationData.value.basic_info.email, // 申請人電子郵件
    phone_number: applicationData.value.basic_info.phone_number, // 申請人手機
    applicant_source: applicationData.value.basic_info.applicant_source, // 申請單位
    content: applicationData.value.vehicle_registered_list, // 申請車牌列表
    distance_title: applicationData.value.selectedCommuteDistance, //  每日單趟通勤距離-距離文字
    distance: 0, //  每日單趟通勤距離-距離
  }
  try {
    const response = await Api.post(
      '/main/applicationForm',
      formatApplicationData.value,
    )

    if (response.data.returnCode == 0) {
      // 判斷是否有上傳的檔案
      const hasValidFiles = applicationData.value.document_list.some(
        file => file instanceof File,
      )

      if (!hasValidFiles) {
        // 沒有檔案的情況下，送出申請表單成功即為申請成功
        isApplicationSuccess.value = true
        facultyStudentStore.clear()
        router.push('/application-success')
        return true
      } else {
        // 有檔案的情況下，執行上傳文件
        const uploadResult = await uploadDocuments()
        if (uploadResult) {
          isApplicationSuccess.value = true
          facultyStudentStore.clear()
          router.replace('/application-success')
          return true
        } else {
          isApplicationSuccess.value = false
        }
      }
    } else {
      isApplicationSuccess.value = false
      applicationData.value.vehicle_registered_list =
        facultyStudentStore.vehicle_registered_list
      showApplicatioinResultModal.value = true
    }
  } catch (error) {
    isApplicationSuccess.value = false
    console.error(error)
    applicationData.value.vehicle_registered_list =
      facultyStudentStore.vehicle_registered_list
    // 恢復 document_list 為原始資料
    applicationData.value.document_list = [...originalDocumentList]
    showApplicatioinResultModal.value = true
  }
}
// 是否成功送出申請，送出申請表單成功+上傳證件成功
const isApplicationSuccess = ref(false)
const showApplicatioinResultModal = ref(false) // 控制 Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
  showConfirmModal.value = false
}

const showNotReadModal = ref(false) // 控制 未閱讀辦證說明Modal 顯示
const showConfirmModal = ref(false) // 控制 確認送出申請Modal 顯示
function handleSubmit() {
  if (!certificateApplicationInstructionsRead.value) {
    showNotReadModal.value = true
  } else if (certificateApplicationInstructionsRead.value) {
    showConfirmModal.value = true
  }
}

function closeNotReadModal() {
  showNotReadModal.value = false
}
function closeConfirmModal() {
  showConfirmModal.value = false
}
</script>

<template>
  <section>
    <p class="mt-3">
      {{
        $t('pages.applyFacultyStudentParking.uploadDocuments.plate_registered')
      }}
    </p>
    <div class="registered-list border rounded vehicle-registration">
      <ul>
        <li
          v-for="(item, index) in applicationData.vehicle_registered_list"
          :key="index"
        >
          <div
            class="d-flex justify-content-between align-items-center px-3 py-1 mt-1"
          >
            <p class="m-0 d-flex align-items-center">
              <span class="me-3" v-if="item.plate != '腳踏車'">
                {{ item.plate }}
              </span>
              <span v-if="item.car_type_title === '腳踏車'">
                <span>
                  {{
                    $t(
                      'pages.applyFacultyStudentParking.vehicle_registration.main_pass_bike',
                    )
                  }}
                </span>
                <span>&nbsp;{{ item.bike_num || 0 }}&nbsp;</span>
                <span>
                  {{
                    $t(
                      'pages.applyFacultyStudentParking.vehicle_registration.unit',
                    )
                  }}
                </span>
              </span>
              <span v-else>
                {{
                  $t(
                    `all_main_pass_code_list.${
                      all_main_pass_code_list.find(
                        code => code.code === item.main_pass_code,
                      )?.code || 'unknown'
                    }`,
                  )
                }}
              </span>
            </p>
            <button class="btn btn-dark" @click="openDeleteModal(index)">
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.delete',
                )
              }}
            </button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 刪除已登記車號 modal 開始 -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-secondary">
            <h5 class="modal-title text-black w-100 text-center" id="deleteModalModalLabel">
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.delete_confirm_title',
                )
              }}
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteModal" aria-label="Close"></button>
          </div>
          <div class="icon-container">
            <img src="/images/modal/Paomedia-Small-N-Flat-Sign-warning.svg" alt="warning" />
          </div>
          <div class="modal-body">
            <p>
              <span
                class="me-3"
                v-if="deleteVehicle_registered_data.plate != '腳踏車'"
                >{{ deleteVehicle_registered_data.plate }}</span
              >
              <span
                v-if="deleteVehicle_registered_data.car_type_title === '腳踏車'"
              >
                <span>
                  {{
                    $t(
                      'pages.applyFacultyStudentParking.vehicle_registration.main_pass_bike',
                    )
                  }}
                </span>
                <span
                  >&nbsp;{{
                    deleteVehicle_registered_data.bike_num || 0
                  }}&nbsp;</span
                >
                <span>
                  {{
                    $t(
                      'pages.applyFacultyStudentParking.vehicle_registration.unit',
                    )
                  }}
                </span>
              </span>
              <span v-else>
                <br />
                {{
                  $t(
                    `all_main_pass_code_list.${
                      all_main_pass_code_list.find(
                        code =>
                          code.code ===
                          deleteVehicle_registered_data.main_pass_code,
                      )?.code || 'unknown'
                    }`,
                  )
                }}
              </span>
            </p>
            <p>
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.delete_confirm_content',
                )
              }}
            </p>
          </div>
          <div class="modal-footer">
            <p class="pointer text-primary fw-bold" @click="closeDeleteModal">
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.cancel',
                )
              }}
            </p>
            <p
              class="pointer text-primary fw-bold"
              @click="deleteVehicle_registered"
            >
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.delete',
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除已登記車號 modal 結束 -->
  </section>
  <form class="mt-5">
    <div class="mb-3">
      <label for="distance" class="form-label">
        {{ $t('pages.applyFacultyStudentParking.uploadDocuments.distance') }}
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
        {{ $t('pages.applyFacultyStudentParking.uploadDocuments.upload') }}
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
            $t('pages.applyFacultyStudentParking.uploadDocuments.upload') +
              (index + 1)
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
        $t(
          'pages.applyFacultyStudentParking.uploadDocuments.campusToReceiveCertificate',
        )
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
            {{
              $t(
                'pages.applyFacultyStudentParking.uploadDocuments.primaryCampus',
              )
            }}
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
            {{
              $t('pages.applyFacultyStudentParking.uploadDocuments.nanDaCampus')
            }}
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
            'pages.applyFacultyStudentParking.uploadDocuments.certificateApplicationInstructionsRead',
          )
        }}
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
  <div class="text-center">
    <button class="btn btn-secondary w-100" @click="handleSubmit">
      {{ $t('pages.applyFacultyStudentParking.uploadDocuments.apply') }}
    </button>
  </div>
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
  <!-- 提交申請結果 modal 開始 -->
  <ApplicatioinResultModal
    :showApplicatioinResultModal="showApplicatioinResultModal"
    @close="closeApplicatioinResultModal"
  />
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
