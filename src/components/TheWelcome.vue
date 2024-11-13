<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout>
    <template #header-content>
      <h2>{{ $t('pages.index.title') }}</h2>
      <h5>{{ $t('pages.index.subtitle') }}</h5>
    </template>
    <template #content>
      <div class="container mt-3">
        <ul class="nav-links">
          <li>
            <router-link to="apply-faculty-student-parking">
              <p class="d-flex flex-column mb-0 text-nowrap">
                <span class="fw-bold fs-4">
                  {{ $t('pages.index.applyFacultyStudentParking') }}
                </span>
                <span class="fw-light fs-6">
                  {{ $t('pages.index.applyFacultyStudentParking_subtitle') }}
                </span>
              </p>
            </router-link>
          </li>
          <li>
            <router-link to="apply-staff-parking">
              <p class="d-flex flex-column mb-0 text-nowrap">
                <span class="fw-bold fs-4">
                  {{ $t('pages.index.applyStaffParking') }}
                </span>
                <span class="fw-light fs-6">
                  {{ $t('pages.index.applyStaffParking_subtitle') }}
                </span>
              </p>
            </router-link>
          </li>
          <li>
            <router-link to="apply-faculty-student-parking">
              <p class="d-flex flex-column mb-0 text-nowrap">
                <span class="fw-bold fs-4">
                  {{ $t('pages.index.applyEvent') }}
                </span>
                <span class="fw-light fs-6">
                  {{ $t('pages.index.applyEvent_subtitle') }}
                </span>
              </p>
            </router-link>
          </li>
          <li>
            <router-link to="apply-faculty-student-parking">
              <p class="d-flex flex-column mb-0 text-nowrap">
                <span class="fw-bold fs-4">
                  {{ $t('pages.index.applyEventCoupon') }}
                </span>
                <span class="fw-light fs-6">
                  {{ $t('pages.index.applyEventCoupon_subtitle') }}
                </span>
              </p>
            </router-link>
          </li>
          <li>
            <router-link to="apply-faculty-student-parking">
              <p class="d-flex flex-column mb-0 text-nowrap">
                <span class="fw-bold fs-4">
                  {{ $t('pages.index.preorderCoupon') }}
                </span>
                <span class="fw-light fs-6">
                  {{ $t('pages.index.preorderCoupon_subtitle') }}
                </span>
              </p>
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  li {
    background-color: #ffffff;
    border-radius: 15px;
    text-align: center;
    padding: 30px;
    width: 80vw;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
}
</style>
