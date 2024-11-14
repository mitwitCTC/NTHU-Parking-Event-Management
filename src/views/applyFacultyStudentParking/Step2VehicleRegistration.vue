<script setup>
import { ref } from 'vue'
import VehicleType from '@/components/applyFacultyStudentParking/VehicleType.vue'

// 車輛類別
const car_type_title = ref('汽車') // 預設為汽車

// 更新車輛類別
function updateCar_type_title(item) {
  car_type_title.value = item
}
</script>
<template>
  <VehicleType
    :car_type_title="car_type_title"
    @updateCar_type_title="updateCar_type_title"
  />
  <router-link to="/apply-faculty-student-parking/step3">上傳資料</router-link>
</template>
