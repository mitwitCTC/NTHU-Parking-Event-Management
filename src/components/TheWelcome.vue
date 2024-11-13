<script setup>
import TheLayout from '@/components/TheLayout.vue'

const navItems = [
  {
    to: 'apply-faculty-student-parking',
    imageSrc: 'images/index/車證.svg',
    alt: '教職員工生停車證',
    title: 'pages.index.applyFacultyStudentParking',
    subtitle: 'pages.index.applyFacultyStudentParking_subtitle',
  },
  {
    to: 'apply-staff-parking',
    imageSrc: 'images/index/工作證.svg',
    alt: '工作人員停車證',
    title: 'pages.index.applyStaffParking',
    subtitle: 'pages.index.applyStaffParking_subtitle',
  },
  {
    to: 'apply-faculty-student-parking',
    imageSrc: 'images/index/自辦活動.svg',
    alt: '各單位自辦活動',
    title: 'pages.index.applyEvent',
    subtitle: 'pages.index.applyEvent_subtitle',
  },
  {
    to: 'apply-faculty-student-parking',
    imageSrc: 'images/index/自辦活動與抵用券.svg',
    alt: '自辦活動與抵用券',
    title: 'pages.index.applyEventCoupon',
    subtitle: 'pages.index.applyEventCoupon_subtitle',
  },
  {
    to: 'apply-faculty-student-parking',
    imageSrc: 'images/index/預購抵用券.svg',
    alt: '預購抵用券',
    title: 'pages.index.preorderCoupon',
    subtitle: 'pages.index.preorderCoupon_subtitle',
  },
]
</script>

<template>
  <TheLayout
    :title="$t('pages.index.title')"
    :subtitle="$t('pages.index.subtitle')"
    :showBackIcon="false"
  >
    <template #content>
      <div class="container mt-3">
        <ul class="nav-links">
          <li
            v-for="(item, index) in navItems"
            :key="index"
            class="d-flex justify-content-center"
          >
            <router-link
              :to="item.to"
              class="w-100 h-100 d-flex justify-content-center"
            >
              <div class="row w-100 align-items-center">
                <div class="col-3 col-md-5 d-flex justify-content-end">
                  <div class="img-container" v-if="item.imageSrc">
                    <img :src="item.imageSrc" :alt="item.alt" />
                  </div>
                </div>
                <div class="col-7 col-md-7">
                  <p class="d-flex flex-column mb-0 text-start text-nowrap">
                    <span class="fw-bold fs-5">
                      {{ $t(item.title) }}
                    </span>
                    <span class="fw-light fs-6">
                      {{ $t(item.subtitle) }}
                    </span>
                  </p>
                </div>
              </div>
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
    padding: 10px;
    width: 90vw;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  }
}

.img-container {
  width: 60px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
    object-fit: contain;
  }
}
</style>
