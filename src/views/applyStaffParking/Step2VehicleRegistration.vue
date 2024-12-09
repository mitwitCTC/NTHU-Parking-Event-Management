<script setup>
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

import { useStaffStore } from '@/stores/staffStore'
import VehicleType from '@/components/applyStaffParking/VehicleType.vue'

import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import { useFormInfo } from '@/composables/useFormInfo'
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

// 組合送出表單所需資料
const formatApplicationData = ref({})
async function print() {
  await getFormInfo('工作證')
  formatApplicationData.value.title = form_info.value.title // 表單名稱
  formatApplicationData.value.form_code = form_info.value.form_code // 表單代碼
  formatApplicationData.value.applicant = staffStore.applicant_data.applicant
  formatApplicationData.value.academic_year =
    staffStore.applicant_data.academic_year
  formatApplicationData.value.applicant = staffStore.applicant_data.applicant
  formatApplicationData.value.email = staffStore.applicant_data.email
  formatApplicationData.value.phone_number =
    staffStore.applicant_data.phone_number
  formatApplicationData.value.content = vehicle_registered_list.value
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
  <VehicleType
    :car_type_title="car_type_title"
    @updateCar_type_title="updateCar_type_title"
  />
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
      <input
        type="text"
        class="form-control"
        id="plate"
        v-model="vehicle_registration_data.plate"
      />
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
  </form>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
  <div class="d-flex justify-content-between">
    <button class="btn btn-secondary" @click="addVehicle_registered_list">
      {{ $t('pages.applyStaffParking.vehicle_registration.next') }}
    </button>
    <button
      class="btn btn-secondary"
      @click="print"
      :disabled="vehicle_registered_list.length <= 0"
    >
      {{ $t('pages.applyStaffParking.vehicle_registration.print') }}
    </button>
  </div>
  <section>
    <p class="mt-3">
      {{ $t('pages.applyStaffParking.vehicle_registration.plate_registered') }}
    </p>
    <div class="registered-list border rounded vehicle-registration">
      <ul>
        <li v-for="(item, index) in vehicle_registered_list" :key="index">
          <div
            class="d-flex justify-content-between align-items-center px-3 py-1 mt-1"
          >
            <p class="m-0">
              <span>
                {{ item.plate }}
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
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
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
            <button
              type="button"
              class="btn-close"
              @click="closeDeleteModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <span>{{ deleteVehicle_registered_data.plate }}</span>
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
            <p
              class="pointer text-primary fw-bold"
              @click="deleteVehicle_registered"
            >
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
