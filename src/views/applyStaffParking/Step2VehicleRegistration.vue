<script setup>
import { onMounted, ref } from 'vue'
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

function print() {
  console.log(vehicle_registered_list.value)
}
</script>

<template>
  <p class="fw-bold">
    {{ $t('pages.applyStaffParking.vehicle_registration.vehicle_type') }}
  </p>
  <VehicleType
    :mainPassCode="mainPassCode"
    @updateMainPassCode="updateMainPassCode"
  />
  <form class="mt-5">
    <div class="mb-3">
      <label for="applicant" class="form-label">
        {{ $t('pages.applyStaffParking.vehicle_registration.plate') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="applicant"
        v-model="vehicle_registration_data.plate"
      />
    </div>
    <div class="mb-3" v-if="mainPassCode != 'WM'">
      <label for="academic_year" class="form-label">
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
    <div class="registered-list border rounded">
      <ul>
        <li v-for="(item, index) in vehicle_registered_list" :key="index">
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
</template>
