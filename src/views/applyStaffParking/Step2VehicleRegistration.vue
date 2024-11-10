<script setup>
import { onMounted, ref } from 'vue'
import { useStaffStore } from '@/stores/staffStore'
import VehicleType from '@/components/applyStaffParking/VehicleType.vue'

const staffStore = useStaffStore()
const vehicle_type = ref('WC') // 預設為汽車

onMounted(() => {
  staffStore.getApplicantData()
})

// 更新車輛類型( 車證型態：汽車/機車 )
function updateVehicleType(type) {
  vehicle_type.value = type
}
</script>

<template>
  <p class="fw-bold">
    {{ $t('pages.applyStaffParking.vehicle_registration.vehicle_type') }}
  </p>
  <VehicleType
    :vehicleType="vehicle_type"
    @updateVehicleType="updateVehicleType"
  />
</template>
