<script setup>
import { onMounted, ref } from 'vue'

const applicationData = ref({
  vehicle_registered_list: [],
  selectedCommuteDistance: '',
})
async function getVehicle_registered_list() {
  applicationData.value.vehicle_registered_list = [
    {
      plate: 'RCC-7788',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WM',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WC',
    },
    {
      plate: 'RAC-2356',
      main_pass_code: 'WM',
    },
  ]
}
onMounted(() => {
  getVehicle_registered_list()
})
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

<style>
.vehicle-registration {
  height: 100px;
  overflow-y: auto;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
