<script setup>
import { onMounted, ref } from 'vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
import router from '@/router'
const facultyStudentStore = useFacultyStudentStore()

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
  { code: 'TEM', des: '職務宿舍區機車識別證' },
  { code: 'SM', des: '學生機車識別證' },
]

// 通勤距離
const commuteDistances = [
  '5-10km',
  '10-20km',
  '20-30km',
  '30-40km',
  '40-50km',
  '50km 以上',
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

// 取得表單名稱及代碼
const form_code_list = ref([])
function getForm_code_list() {
  form_code_list.value = [
    [
      {
        id: '1',
        title: '車證',
        form_code: 'A00001',
        created_at: '2024-09-24 20:48:25',
      },
      {
        id: '2',
        title: '工作證',
        form_code: 'B00002',
        created_at: '2024-09-24 20:48:25',
      },
      {
        id: '3',
        title: '活動',
        form_code: 'C00003',
        created_at: '2024-09-24 20:48:25',
      },
      {
        id: '4',
        title: '折抵券',
        form_code: 'D00004',
        created_at: '2024-09-24 20:48:25',
      },
      {
        id: '5',
        title: '活動+折抵券',
        form_code: 'E00005',
        created_at: '2024-09-24 20:48:25',
      },
    ],
  ]
}
onMounted(() => {
  getForm_code_list()
  // 取得 title 為 "車證" 的資料
  const carTicketForm = form_code_list.value
    .flat()
    .find(item => item.title === '車證')

  // 如果找到了該資料，將 title 和 form_code 資料寫入 applicationData
  if (carTicketForm) {
    applicationData.value.title = carTicketForm.title
    applicationData.value.form_code = carTicketForm.form_code
  }
})

const formatApplicationData = ref({})

async function apply() {
  facultyStudentStore.getApplicantData()
  applicationData.value.basic_info = facultyStudentStore.applicant_data
  formatBikeRegisteredList()
  applicationData.value.document_list =
    applicationData.value.document_list.filter(file => file !== null)
  console.log(applicationData.value)

  formatApplicationData.value = {
    title: applicationData.value.title, // 表單名稱
    academic_year: applicationData.value.basic_info.academic_year, // 學年
    form_code: applicationData.value.form_code, // 表單代碼
    receive_location: applicationData.value.campusToReceiveCertificate, // 領取校區
    applicant_type: applicationData.value.basic_info.applicant_type, // 申請人類別
    applicant_number: applicationData.value.basic_info.applicant_number, // 申請人編號(學號或員編)
    applicant: applicationData.value.basic_info.applicant, // 申請人名稱
    email: applicationData.value.basic_info.email, // 申請人電子郵件
    phone_number: applicationData.value.basic_info.phone_number, // 申請人手機
    applicant_source: applicationData.value.basic_info.applicant_source, // 申請單位
    content: applicationData.value.vehicle_registered_list, // 申請車牌列表
  }
  console.log(formatApplicationData.value)

  router.push('/query-links')
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
          <p>
            <span class="me-3" v-if="item.plate != '腳踏車'">{{
              item.plate
            }}</span>
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
                all_main_pass_code_list.find(
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
      <label for="distance" class="form-label">
        {{ $t('pages.applyFacultyStudentParking.uploadDocuments.distance') }}
      </label>
      <select
        class="form-select"
        v-model="applicationData.selectedCommuteDistance"
      >
        <option v-for="item in commuteDistances" :key="item" :value="item">
          {{ item }}
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
        $t('pages.applyStaffParking.uploadDocuments.campusToReceiveCertificate')
      }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="campusToReceiveCertificate1"
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
            name="campusToReceiveCertificate2"
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
        data-bs-toggle="modal"
        data-bs-target="#introductionModal"
      >
        <i class="bi bi-check-circle"></i>
        {{
          $t(
            'pages.applyStaffParking.uploadDocuments.certificateApplicationInstructionsRead',
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
    <div class="modal-dialog modal-dialog-centered">
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
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{
            $t(
              'pages.applyStaffParking.uploadDocuments.certificateApplicationInstructionsContent',
            )
          }}
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary fw-bold" data-bs-dismiss="modal">
            {{ $t('pages.applyStaffParking.basic_info.cancel') }}
          </p>
          <p
            class="pointer text-primary fw-bold"
            data-bs-dismiss="modal"
            @click="certificateApplicationInstructionsRead = true"
          >
            {{ $t('pages.applyStaffParking.basic_info.confirm') }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 辦證說明 modal 結束 -->
  <div class="text-center">
    <button
      class="btn btn-secondary w-100"
      :disabled="!certificateApplicationInstructionsRead"
      data-bs-toggle="modal"
      data-bs-target="#comfirmModal"
    >
      {{ $t('pages.applyStaffParking.uploadDocuments.apply') }}
    </button>
  </div>
  <div
    class="modal fade"
    id="comfirmModal"
    tabindex="-1"
    aria-labelledby="comfirmModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-secondary">
          <h5 class="modal-title text-black" id="comfirmModalLabel">
            {{ $t('pages.applyStaffParking.uploadDocuments.confirm_title') }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ $t('pages.applyStaffParking.uploadDocuments.confirm_message') }}
        </div>
        <div class="modal-footer">
          <p class="pointer text-primary fw-bold" data-bs-dismiss="modal">
            {{ $t('pages.applyStaffParking.uploadDocuments.cancel') }}
          </p>
          <p
            class="pointer text-primary fw-bold"
            data-bs-dismiss="modal"
            @click="apply"
          >
            {{ $t('pages.applyStaffParking.uploadDocuments.confirm') }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
