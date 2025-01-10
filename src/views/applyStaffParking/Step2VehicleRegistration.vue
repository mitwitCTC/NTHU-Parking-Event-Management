<script setup>
import { onMounted, ref, computed, watchEffect } from 'vue'
import { Modal } from 'bootstrap'

import { useStaffStore } from '@/stores/staffStore'
import VehicleType from '@/components/applyStaffParking/VehicleType.vue'

import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import { useFormInfo } from '@/composables/useFormInfo'
import Api from '@/api'
import router from '@/router'
const { form_info, getFormInfo } = useFormInfo()

const staffStore = useStaffStore()
// 車輛型式名稱 (汽車/機車)
const car_type_title = ref('汽車') // 預設為汽車

onMounted(() => {
  staffStore.getApplicantData()
})

// 車輛型式選項
const car_types = ref([])
function getCar_types() {
  car_types.value = [
    { id: 1, des: 'Gasoline' },
    { id: 2, des: 'Hybrid' },
    { id: 3, des: 'Electric' },
    { id: 4, des: 'Diesel' },
  ]
}

onMounted(() => {
  getCar_types()
})

// 更新車輛型式名稱 (汽車/機車)
function updateCar_type_title(type) {
  car_type_title.value = type
}

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    plate: { required: true, plate: true },
  }
  if (car_type_title.value == '汽車') {
    rules.car_type = { required: true }
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errorsResult } = formValidatorRef.value.validateForm(
      vehicle_registration_data.value,
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

const vehicle_registration_data = ref({})
const vehicle_registered_list = ref([])
function addVehicle_registered_list() {
  vehicle_registration_data.value.car_type_title = car_type_title.value
  if (formValidate()) {
    if (vehicle_registration_data.value.car_type_title == '機車') {
      vehicle_registration_data.value.car_type = 5
      vehicle_registration_data.value.main_pass_code = 'WM'
    }
    handleAddVehicle(vehicle_registration_data.value)
    vehicle_registration_data.value = {}
  }
}

// 檢查是否重複車牌並處理新增車輛
function handleAddVehicle(vehicleData) {
  const existingIndex = vehicle_registered_list.value.findIndex(
    vehicle => vehicle.plate === vehicleData.plate,
  )

  if (existingIndex !== -1) {
    alert(
      '車牌已經存在，請重新輸入。The License Plate Number already exists, please re-enter it.',
    )
    return
  } else {
    vehicle_registered_list.value.push(vehicleData)
  }
}
// 全部車證型態列表
const all_main_pass_code_list = [
  { code: 'WC', des: ' 工作證汽車識別證' },
  { code: 'HF', des: ' 短期汽車識別證' },
  { code: 'WM', des: ' 工作機車識別證' },
]

// 根據 car_type_title 篩選車證型態
const main_pass_code_list = ref([])
function updateMain_pass_code_list() {
  main_pass_code_list.value = all_main_pass_code_list.filter(item =>
    car_type_title.value === '汽車'
      ? ['WC', 'HF'].includes(item.code)
      : car_type_title.value === '機車'
        ? ['WM'].includes(item.code)
        : [],
  )
}
onMounted(() => {
  updateMain_pass_code_list()
})
watchEffect(() => {
  updateMain_pass_code_list()
})
// 通勤距離
const commuteDistances = [
  { value: '5-10km', labelKey: 'commute_distances.5_10km' },
  { value: '10-20km', labelKey: 'commute_distances.10_20km' },
  { value: '20-30km', labelKey: 'commute_distances.20_30km' },
  { value: '30-40km', labelKey: 'commute_distances.30_40km' },
  { value: '40-50km', labelKey: 'commute_distances.40_50km' },
  { value: '50km 以上', labelKey: 'commute_distances.over_50km' },
]
const selectedCommuteDistance = ref('')
// 被選中的通勤距離（假設初始為5-10km）
selectedCommuteDistance.value = '5-10km'
// 動態控制 showCommuteDistance
const showCommuteDistance = computed(() => {
  // 檢查是否還有 "汽車" 的資料
  return !vehicle_registered_list.value.some(
    vehicle => vehicle.car_type_title === '汽車',
  )
})

// 組合送出表單所需資料
const formatApplicationData = ref({})
async function prepareApplicationData() {
  await getFormInfo('工作證')
  formatApplicationData.value = {
    title: form_info.value.title, // 表單名稱
    form_code: form_info.value.form_code, // 表單代碼
    applicant: staffStore.applicant_data.applicant,
    academic_year: staffStore.applicant_data.academic_year,
    applicant_source: staffStore.applicant_data.applicant_source,
    applicant_type: 4, // 申請人類別：校外人員
    receive_location: staffStore.applicant_data.campusToReceiveCertificate,
    email: staffStore.applicant_data.email || '',
    phone_number: staffStore.applicant_data.phone_number,
    content: vehicle_registered_list.value,
    distance_title: selectedCommuteDistance.value,
    distance: 0,
  }
}

// 是否成功送出申請
const showApplicatioinResultModal = ref(false) // 控制 申請失敗結果Modal 顯示
async function submitApplication() {
  try {
    await prepareApplicationData()
    const response = await Api.post(
      '/main/applicationForm',
      formatApplicationData.value,
    )
    if (response.data.returnCode == 0) {
      router.replace({ name: 'Home' })
      staffStore.clear()
    } else {
      showApplicatioinResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    showApplicatioinResultModal.value = true
  }
}
function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
}

let deleteModal = null
const deleteVehicle_registered_data = ref({})
function openDeleteModal(index) {
  const modalElement = document.getElementById('deleteModal')
  if (!deleteModal) {
    deleteModal = new Modal(modalElement)
  }
  deleteModal.show()
  deleteVehicle_registered_data.value = vehicle_registered_list.value[index]
  deleteVehicle_registered_data.value.index = index
}

function closeDeleteModal() {
  if (deleteModal) {
    deleteModal.hide()
  }
}

function deleteVehicle_registered() {
  vehicle_registered_list.value.splice(
    deleteVehicle_registered_data.value.index,
    1,
  )
  closeDeleteModal()
}
</script>

<template>
  <VehicleType :car_type_title="car_type_title" @updateCar_type_title="updateCar_type_title" />
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form class="mt-5">
    <div class="mb-3">
      <label for="plate" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.plate') }}
        <span class="text-warning">
          (
          {{
            $t(
              'pages.applyStaffParking.vehicle_registration.licensePlateInputFormat',
            )
          }}
          )
        </span>
      </label>
      <input type="text" class="form-control" id="plate" v-model="vehicle_registration_data.plate" />
    </div>
    <div class="mb-3" v-if="car_type_title == '汽車'">
      <label for="car_type" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.car_type') }}
      </label>
      <select class="form-select" v-model="vehicle_registration_data.car_type">
        <option v-for="item in car_types" :key="item.id" :value="item.id">
          {{ $t(`car_types.${item.des}`) }}
        </option>
      </select>
    </div>
    <div class="mb-3" v-if="car_type_title == '汽車'">
      <label for="main_pass_code" class="form-label">
        {{
          $t(
            'pages.applyFacultyStudentParking.vehicle_registration.main_pass_code',
          )
        }}
      </label>
      <select class="form-select" v-model="vehicle_registration_data.main_pass_code">
        <option v-for="item in main_pass_code_list" :key="item.code" :value="item.code">
          {{ $t(`all_main_pass_code_list.${item.code}`) }}
        </option>
      </select>
    </div>
    <div v-if="showCommuteDistance && car_type_title == '汽車'" class="mb-3">
      <label for="commute_distance" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.distance') }}
      </label>
      <select class="form-select" v-model="selectedCommuteDistance">
        <option v-for="item in commuteDistances" :key="item.value" :value="item.value">
          {{ $t(item.labelKey) }}
        </option>
      </select>
    </div>
    <div class="d-flex justify-content-between">
      <button class="btn btn-secondary" @click.prevent="addVehicle_registered_list">
        {{ $t('pages.applyStaffParking.vehicle_registration.next') }}
      </button>
      <button class="btn btn-secondary" @click.prevent="submitApplication"
        :disabled="vehicle_registered_list.length <= 0">
        {{ $t('pages.applyStaffParking.vehicle_registration.print') }}
      </button>
    </div>
  </form>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal :showModal="showModal" :errors="errors" @close="closeValidatorModal" />
  <!-- 提交申請結果 modal 開始 -->
  <ApplicatioinResultModal :showApplicatioinResultModal="showApplicatioinResultModal"
    @close="closeApplicatioinResultModal" />
  <section>
    <p class="mt-3">
      {{ $t('pages.applyStaffParking.vehicle_registration.plate_registered') }}
    </p>
    <div class="registered-list border rounded vehicle-registration">
      <ul>
        <li v-for="(item, index) in vehicle_registered_list" :key="index">
          <div class="d-flex justify-content-between align-items-center px-3 py-1 mt-1">
            <p class="m-0">
              <span> {{ item.plate }}&nbsp;</span>
              <span>
                {{
                  $t(
                    `all_main_pass_code_list.${all_main_pass_code_list.find(
                      code => code.code === item.main_pass_code,
                    )?.code || 'unknown'
                    }`,
                  )
                }}
              </span>
            </p>
            <button class="btn btn-dark" @click="openDeleteModal(index)">
              {{ $t('pages.applyStaffParking.vehicle_registration.delete') }}
            </button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 刪除已登記車號 modal 開始 -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-secondary">
            <h5 class="modal-title text-black" id="deleteModalModalLabel">
              {{
                $t(
                  'pages.applyStaffParking.vehicle_registration.delete_confirm_title',
                )
              }}
            </h5>
            <button type="button" class="btn-close" @click="closeDeleteModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              <span>{{ deleteVehicle_registered_data.plate }}</span>
              <span>
                <br />
                {{
                  $t(
                    `all_main_pass_code_list.${all_main_pass_code_list.find(
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
                  'pages.applyStaffParking.vehicle_registration.delete_confirm_content',
                )
              }}
            </p>
          </div>
          <div class="modal-footer">
            <p class="pointer text-primary fw-bold" @click="closeDeleteModal">
              {{ $t('pages.applyStaffParking.vehicle_registration.cancel') }}
            </p>
            <p class="pointer text-primary fw-bold" @click="deleteVehicle_registered">
              {{ $t('pages.applyStaffParking.vehicle_registration.delete') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除已登記車號 modal 結束 -->
  </section>
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
</style>
