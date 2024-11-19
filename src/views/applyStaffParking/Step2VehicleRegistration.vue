<script setup>
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'

import { useStaffStore } from '@/stores/staffStore'
import VehicleType from '@/components/applyStaffParking/VehicleType.vue'

const staffStore = useStaffStore()
// 車證型態
const mainPassCode = ref('WC') // 預設為汽車

onMounted(() => {
  staffStore.getApplicantData()
})

// 車輛型式選項
const car_types = [
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

// 更新車證型態
function updateMainPassCode(type) {
  mainPassCode.value = type
}

const vehicle_registration_data = ref({})
const vehicle_registered_list = ref([])
function addVehicle_registered_list() {
  vehicle_registration_data.value.main_pass_code = mainPassCode.value
  // 判斷為汽車或機車
  if (vehicle_registration_data.value.main_pass_code == 'WC') {
    vehicle_registration_data.value.car_type_title = '汽車'
  } else {
    vehicle_registration_data.value.car_type_title = '機車'
    vehicle_registration_data.value.car_type = 5
  }
  vehicle_registered_list.value.push(vehicle_registration_data.value)
  vehicle_registration_data.value = {}
}
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

async function print() {
  console.log(vehicle_registered_list.value)
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
    :mainPassCode="mainPassCode"
    @updateMainPassCode="updateMainPassCode"
  />
  <form class="mt-5">
    <div class="mb-3">
      <label for="plate" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.plate') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="plate"
        v-model="vehicle_registration_data.plate"
      />
    </div>
    <div class="mb-3" v-if="mainPassCode != 'WM'">
      <label for="car_type" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.car_type') }}
      </label>
      <select class="form-select" v-model="vehicle_registration_data.car_type">
        <option v-for="item in car_types" :key="item.id" :value="item.id">
          {{ item.des }}
        </option>
      </select>
    </div>
  </form>
  <div class="d-flex justify-content-between">
    <button class="btn btn-secondary" @click="addVehicle_registered_list">
      {{ $t('pages.applyStaffParking.vehicle_registration.next') }}
    </button>
    <button class="btn btn-secondary" @click="print">
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
            <p class="m-0 d-flex align-items-center">
              <span class="me-3" v-if="item.plate != '腳踏車'">
                {{ item.plate }}
              </span>
              <span v-if="item.car_type_title === '腳踏車'">
                <span>
                  {{
                    $t(
                      'pages.applyStaffParking.vehicle_registration.main_pass_bike',
                    )
                  }}
                </span>
                <span>&nbsp;{{ item.bike_num || 0 }}&nbsp;</span>
                <span>
                  {{ $t('pages.applyStaffParking.vehicle_registration.unit') }}
                </span>
              </span>
              <span v-else>
                {{
                  main_pass_code_list.find(
                    code => code.code === item.main_pass_code,
                  )?.des || '未知'
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
                      'pages.applyStaffParking.vehicle_registration.main_pass_bike',
                    )
                  }}
                </span>
                <span
                  >&nbsp;{{
                    deleteVehicle_registered_data.bike_num || 0
                  }}&nbsp;</span
                >
                <span>
                  {{ $t('pages.applyStaffParking.vehicle_registration.unit') }}
                </span>
              </span>
              <span v-else>
                {{
                  main_pass_code_list.find(
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
