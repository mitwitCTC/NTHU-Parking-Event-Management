<script setup>
import { onMounted, ref } from 'vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
const facultyStudentStore = useFacultyStudentStore()

const applicationData = ref({})
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
  <router-link to="/query-links">查詢</router-link>
</template>
