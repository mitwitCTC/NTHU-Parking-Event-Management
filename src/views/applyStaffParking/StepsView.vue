<template>
  <h3 class="text-center">
    {{ $t('pages.applyStaffParking.steps.title') }}
  </h3>
  <div class="container">
    <div class="mt-5 d-flex flex-column align-items-center">
      <div class="d-flex gap-3 mb-5 mb-sm-3 text-white">
        <span class="bg-dark rounded step-num"> 1 </span>
        <span class="bg-dark rounded step-des">
          {{ $t('pages.applyStaffParking.steps.step1') }}
        </span>
        <div class="img-container bg-dark rounded step-des-img">
          <img src="/images/upload/填寫申請書.svg" alt="填寫申請書" />
        </div>
      </div>
      <div class="d-flex gap-3 mb-5 mb-sm-3 text-white">
        <span class="bg-dark rounded step-num"> 2 </span>
        <span class="bg-dark rounded step-des">
          {{ $t('pages.applyStaffParking.steps.step2') }}
        </span>
        <div class="img-container bg-dark rounded step-des-img">
          <img src="/images/steps/print.svg" alt="列印" />
        </div>
      </div>
      <div class="d-flex gap-3 mb-5 mb-sm-3 text-white">
        <span class="bg-dark rounded step-num"> 3 </span>
        <span class="bg-dark rounded step-des">
          {{ $t('pages.applyStaffParking.steps.step3') }}
        </span>
        <div class="img-container bg-dark rounded step-des-img">
          <img src="/images/steps/sign.svg" alt="簽章" />
        </div>
      </div>
      <div class="d-flex gap-3 mb-5 mb-sm-3 text-white">
        <span class="bg-dark rounded step-num"> 4 </span>
        <span class="bg-dark rounded step-des">
          {{ $t('pages.applyStaffParking.steps.step4') }}
        </span>
        <div class="img-container bg-dark rounded step-des-img">
          <img src="/images/upload/上傳申請書.svg" alt="上傳申請書" />
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <router-link to="/apply-staff-parking/step1" class="w-75">
      <button class="btn btn-secondary py-3 apply-btn w-100">
        <span class="fw-bold fs-4 text-primary">
          {{ $t('pages.applyStaffParking.steps.apply') }}
        </span>
      </button>
    </router-link>
  </div>
</template>

<style scoped>
.step-num {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-des {
  width: 30vw;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.step-des-img {
  width: 80px;
  height: 80px;
}

.img-container {
  width: 80px;
  height: 80px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.apply-btn {
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}

@media (max-width: 576px) {
  .step-num {
    width: 60px;
    height: 60px;
  }

  .step-des {
    width: 40vw;
    height: 60px;
    padding: 0 25px;
  }

  .img-container {
    width: 60px;
    height: 60px;
  }
}
</style>
