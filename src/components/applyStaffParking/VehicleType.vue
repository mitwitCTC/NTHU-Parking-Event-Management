<script setup>
defineProps({
  car_type_title: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['updateCar_type_title'])

function handleClick(item) {
  emit('updateCar_type_title', item)
}
</script>

<template>
  <section>
    <p class="fw-bold">
      {{ $t('pages.applyStaffParking.vehicle_registration.vehicle_type') }}
    </p>
    <div class="d-flex justify-content-start gap-5">
      <div
        class="d-flex flex-column align-items-center pointer"
        :class="{ 'gray-overlay': car_type_title != '汽車' }"
        @click="handleClick('汽車')"
      >
        <div class="img-container">
          <img src="/images/vehicle/汽車.svg" alt="汽車" />
        </div>
      </div>
      <div
        class="d-flex flex-column align-items-center pointer"
        :class="{ 'gray-overlay': car_type_title != '機車' }"
        @click="handleClick('機車')"
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
