<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'

const current_step = ref(3) // 初始化 current_step 變數

function goStep1BasicInfo() {
  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/apply-staff-parking/Step1') {
    router.push('/apply-staff-parking/Step1')
  }
}

function goStep3_1LoginAndUpload() {
  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/apply-staff-parking/step3_1') {
    router.push('/apply-staff-parking/step3_1')
  }
}

// 在頁面載入時檢查 current_step 值
onMounted(() => {
  current_step.value = 3
})
</script>

<template>
  <section>
    <div class="d-flex justify-content-around">
      <div
        class="d-flex flex-column align-items-center nav-item"
        :class="{ 'gray-overlay': current_step === 3 }"
        @click="goStep1BasicInfo"
      >
        <div class="img-container">
          <img src="/images/upload/填寫申請書.svg" alt="填寫申請書" />
        </div>
        <p class="mt-2 text-nowrap">
          {{ $t('pages.applyStaffParking.basic_info.fillOut') }}
        </p>
      </div>
      <div
        class="d-flex flex-column align-items-center nav-item"
        :class="{ 'gray-overlay': current_step === 1 }"
        @click="goStep3_1LoginAndUpload"
      >
        <div class="img-container">
          <img src="/images/upload/上傳申請書.svg" alt="上傳申請書" />
        </div>
        <p class="mt-2 text-nowrap">
          {{ $t('pages.applyStaffParking.basic_info.uploadAndSubmit') }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nav-item {
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
  width: 60px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
