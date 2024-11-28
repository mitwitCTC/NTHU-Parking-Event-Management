<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import VehicleType from '@/components/applyFacultyStudentParking/VehicleType.vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
import router from '@/router'
const facultyStudentStoreStore = useFacultyStudentStore()
import { Modal } from 'bootstrap'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'

// 車輛類別
const car_type_title = ref('汽車') // 預設為汽車
const vehicleTypeSelected = ref(
  'pages.applyFacultyStudentParking.vehicle_registration.vehicle_type_car',
)
// 更新車輛類別
function updateCar_type_title(item) {
  car_type_title.value = item
  if (car_type_title.value == '汽車') {
    vehicleTypeSelected.value =
      'pages.applyFacultyStudentParking.vehicle_registration.vehicle_type_car'
  } else if (car_type_title.value == '機車') {
    vehicleTypeSelected.value =
      'pages.applyFacultyStudentParking.vehicle_registration.vehicle_type_scooter'
  } else {
    vehicleTypeSelected.value =
      'pages.applyFacultyStudentParking.vehicle_registration.vehicle_type_bike'
  }
}

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

// 根據 car_type_title 篩選車證型態
const main_pass_code_list = ref([])
function updateMain_pass_code_list() {
  main_pass_code_list.value = all_main_pass_code_list.filter(item =>
    car_type_title.value === '汽車'
      ? ['TC', 'TE', 'SC', 'HF'].includes(item.code)
      : car_type_title.value === '機車'
        ? ['TM', 'TEM', 'SM'].includes(item.code)
        : [],
  )
}
onMounted(() => {
  updateMain_pass_code_list()
})
watchEffect(() => {
  updateMain_pass_code_list()
})
// 車輛型式選項
const car_types = ref([])
function getCar_types() {
  car_types.value = [
    {
      id: 1,
      des: '汽油車',
    },
    {
      id: 2,
      des: '油電車',
    },
    {
      id: 3,
      des: '電動車',
    },
    {
      id: 4,
      des: '柴油車',
    },
  ]
}

onMounted(() => {
  getCar_types()
})

const vehicle_registration_data = ref({
  plate: '', // 車牌，若為腳踏車，則為"腳踏車"
  car_type: '', // 車輛形式代號
  car_type_title: '', // 車輛類別
  main_pass_code: '', // 車證型態
})
const vehicle_registered_list = ref([])
function addVehicle_registered_list() {
  // 在進行驗證之前，處理腳踏車特殊邏輯
  if (car_type_title.value == '腳踏車') {
    vehicle_registration_data.value.plate = '腳踏車'
    vehicle_registration_data.value.car_type = 6
    vehicle_registration_data.value.main_pass_code = 'BS'
    vehicle_registration_data.value.bike_num = bike_num.value
  } else if (car_type_title.value == '機車') {
    vehicle_registration_data.value.car_type = 5
  }

  // 驗證資料
  if (formValidate()) {
    vehicle_registration_data.value.car_type_title = car_type_title.value

    // 驗證成功，新增車輛
    handleAddVehicle(vehicle_registration_data.value)

    // 重置輸入值
    vehicle_registration_data.value = {}
    bike_num.value = null
  }
}
// 檢查是否重複車牌並處理新增車輛（腳踏車除外）
function handleAddVehicle(vehicleData) {
  const existingIndex = vehicle_registered_list.value.findIndex(
    vehicle =>
      vehicle.plate === vehicleData.plate && vehicle.plate !== '腳踏車',
  )

  if (existingIndex !== -1) {
    alert(
      '車牌已經存在，請重新輸入。The License Plate Number already exists, please re-enter it.',
    )
    return
  }

  // 處理腳踏車特殊邏輯
  if (vehicleData.plate === '腳踏車') {
    const bikeIndex = vehicle_registered_list.value.findIndex(
      vehicle => vehicle.plate === '腳踏車',
    )

    if (bikeIndex !== -1) {
      // 更新已存在的腳踏車數據
      vehicle_registered_list.value[bikeIndex] = {
        ...vehicle_registered_list.value[bikeIndex],
        bike_num: vehicleData.bike_num,
      }
    } else {
      // 新增腳踏車數據並確保在陣列最後
      vehicle_registered_list.value.push(vehicleData)
    }
  } else {
    // 一般車輛直接新增
    vehicle_registered_list.value.push(vehicleData)
  }

  // 確保腳踏車永遠在最後
  ensureBikeAtEnd()
}
function ensureBikeAtEnd() {
  const bikeData = vehicle_registered_list.value.filter(
    vehicle => vehicle.plate === '腳踏車',
  )
  const otherVehicles = vehicle_registered_list.value.filter(
    vehicle => vehicle.plate !== '腳踏車',
  )

  vehicle_registered_list.value = [...otherVehicles, ...bikeData]
}

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    plate: { required: true },
    main_pass_code: { required: true },
    car_type: { required: true },
  }
  if (car_type_title.value === '腳踏車') {
    rules.bike_num = { required: true }
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

// 腳踏車
const bike_num = ref(null)

// 前往上傳
function goToUpload() {
  facultyStudentStoreStore.setVehicleRegisteredList(
    vehicle_registered_list.value,
  )

  router.push({ name: 'ApplyFacultyStudentParking_step3' })
}

onMounted(() => {
  facultyStudentStoreStore.getVehicleRegisteredList() // 取得 vehicle_registered_list
  vehicle_registered_list.value =
    facultyStudentStoreStore.vehicle_registered_list
})
</script>
<template>
  <VehicleType
    :car_type_title="car_type_title"
    @updateCar_type_title="updateCar_type_title"
  />
  <h3 class="mt-3 fw-bold">
    {{ $t(vehicleTypeSelected) }}
  </h3>
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form class="mt-3">
    <div class="mb-3" v-if="car_type_title != '腳踏車'">
      <label for="plate" class="form-label">
        {{ $t('pages.applyFacultyStudentParking.vehicle_registration.plate') }}
        <span class="text-warning">
          (
          {{
            $t(
              'pages.applyFacultyStudentParking.vehicle_registration.licensePlateInputFormat',
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
    <div class="mb-3" v-if="car_type_title != '腳踏車'">
      <label for="main_pass_code" class="form-label">
        {{
          $t(
            'pages.applyFacultyStudentParking.vehicle_registration.main_pass_code',
          )
        }}
      </label>
      <select
        class="form-select"
        v-model="vehicle_registration_data.main_pass_code"
      >
        <option
          v-for="item in main_pass_code_list"
          :key="item.code"
          :value="item.code"
        >
          {{ item.des }}
        </option>
      </select>
    </div>
    <div class="mb-3" v-if="car_type_title == '汽車'">
      <label for="car_type" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.car_type') }}
      </label>
      <select class="form-select" v-model="vehicle_registration_data.car_type">
        <option v-for="item in car_types" :key="item.id" :value="item.id">
          {{ item.des }}
        </option>
      </select>
    </div>
    <div class="mb-3" v-if="car_type_title == '腳踏車'">
      <label for="bike_num" class="form-label">
        {{
          $t('pages.applyFacultyStudentParking.vehicle_registration.bike_num')
        }}
      </label>
      <input
        type="number"
        class="form-control"
        id="bike_num"
        v-model="bike_num"
      />
    </div>
  </form>
  <div class="d-flex justify-content-between">
    <button class="btn btn-secondary" @click="addVehicle_registered_list">
      {{ $t('pages.applyFacultyStudentParking.vehicle_registration.register') }}
    </button>
    <button
      class="btn btn-secondary"
      @click="goToUpload"
      :disabled="vehicle_registered_list.length <= 0"
    >
      {{ $t('pages.applyFacultyStudentParking.vehicle_registration.next') }}
    </button>
  </div>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
  <section>
    <p class="mt-3">
      {{
        $t(
          'pages.applyFacultyStudentParking.vehicle_registration.plate_registered',
        )
      }}
    </p>
    <div class="registered-list border rounded vehicle-registration">
      <ul>
        <li v-for="(item, index) in vehicle_registered_list" :key="index">
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
                  all_main_pass_code_list.find(
                    code => code.code === item.main_pass_code,
                  )?.des || '未知'
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
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-secondary">
            <h5 class="modal-title text-black" id="deleteModalModalLabel">
              {{
                $t(
                  'pages.applyFacultyStudentParking.vehicle_registration.delete_confirm_title',
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
                {{
                  all_main_pass_code_list.find(
                    code =>
                      code.code ===
                      deleteVehicle_registered_data.main_pass_code,
                  )?.des || '未知'
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
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
