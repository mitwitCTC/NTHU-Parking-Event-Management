<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import VehicleType from '@/components/applyFacultyStudentParking/VehicleType.vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
import router from '@/router'
const facultyStudentStoreStore = useFacultyStudentStore()

// 車輛類別
const car_type_title = ref('汽車') // 預設為汽車

// 更新車輛類別
function updateCar_type_title(item) {
  car_type_title.value = item
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
  if (car_type_title.value == '機車') {
    vehicle_registration_data.value.car_type = 5
  } else if (car_type_title.value == '腳踏車') {
    vehicle_registration_data.value.car_type = 6
    vehicle_registration_data.value.main_pass_code = 'BS'
    vehicle_registration_data.value.plate = '腳踏車'
    vehicle_registration_data.value.bike_num = bike_num.value
  }
  vehicle_registration_data.value.car_type_title = car_type_title.value
  vehicle_registered_list.value.push(vehicle_registration_data.value)
  vehicle_registration_data.value = {}
  bike_num.value = null
}

// 腳踏車
const bike_num = ref(null)

// 前往上傳
function goToUpload() {
  facultyStudentStoreStore.setVehicleRegisteredList(
    vehicle_registered_list.value,
  )
  console.log(vehicle_registered_list.value)

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
  <form class="mt-5">
    <div class="mb-3" v-if="car_type_title != '腳踏車'">
      <label for="plate" class="form-label">
        {{ $t('pages.applyFacultyStudentParking.vehicle_registration.plate') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="plate"
        v-model="vehicle_registration_data.plate"
      />
    </div>
    <div class="mb-3" v-if="car_type_title != '腳踏車'">
      <label for="car_type" class="form-label">
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
      {{ $t('pages.applyFacultyStudentParking.vehicle_registration.next') }}
    </button>
    <button class="btn btn-secondary" @click="goToUpload">
      {{ $t('pages.applyFacultyStudentParking.vehicle_registration.finish') }}
    </button>
  </div>
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
</template>
