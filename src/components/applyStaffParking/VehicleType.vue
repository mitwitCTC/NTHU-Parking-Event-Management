<script setup>
// 定義接收的 props 和 emits
import { defineProps, defineEmits } from 'vue'

defineProps({
  vehicleType: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['updateVehicleType'])

function handleClick(type) {
  emit('updateVehicleType', type)
}
</script>

<template>
  <section>
    <div class="d-flex justify-content-start gap-5">
      <div
        class="d-flex flex-column align-items-center pointer"
        :class="{ 'gray-overlay': vehicleType != 'WC' }"
        @click="handleClick('WC')"
      >
        <div class="img-container">
          <img src="/images/vehicle/汽車.svg" alt="汽車" />
        </div>
      </div>
      <div
        class="d-flex flex-column align-items-center pointer"
        :class="{ 'gray-overlay': vehicleType != 'WM' }"
        @click="handleClick('WM')"
      >
        <div class="img-container">
          <img src="/images/vehicle/機車.svg" alt="機車" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}

.gray-overlay {
  position: relative;
  opacity: 0.5;
}

.img-container {
  background: #ffffff;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  border-radius: 15px;
  padding: 10px;
  width: 80px;
  height: 80px;
}
img {
  width: 100%;
  height: 100%;
}
</style>
