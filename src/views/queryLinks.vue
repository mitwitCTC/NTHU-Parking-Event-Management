<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
import TheLayout from '@/components/TheLayout.vue'

const navItems = [
  {
    to: 'query-faculty-student-parking',
    imageSrc: 'images/index/車證.svg',
    alt: '教職員工生停車證',
    title: 'pages.query.queryFacultyStudentParking',
    subtitle: 'pages.query.queryFacultyStudentParking_subtitle',
  },
  {
    to: 'query-staff-parking',
    imageSrc: 'images/index/工作證.svg',
    alt: '工作人員停車證',
    title: 'pages.query.queryStaffParking',
    subtitle: 'pages.query.queryStaffParking_subtitle',
  },
  {
    to: 'query-event',
    imageSrc: 'images/index/自辦活動.svg',
    alt: '各單位自辦活動',
    title: 'pages.query.queryEvent',
    subtitle: 'pages.query.queryEvent_subtitle',
  },
  {
    to: 'query-coupon',
    imageSrc: 'images/index/預購抵用券.svg',
    alt: '預購抵用券',
    title: 'pages.query.queryCoupon',
    subtitle: 'pages.query.queryCoupon_subtitle',
  },
]

// 根據當前語系決定subtitle的字型大小
const formattedNavItems = computed(() => {
  return navItems.map(item => {
    return {
      ...item,
      titleClass: locale.value === 'en' ? 'fs-6' : 'fs-5',
      subtitleClass: locale.value === 'en' ? 'fs-12' : 'fs-6',
    }
  })
})
</script>

<template>
  <TheLayout
    :title="$t('pages.query.title')"
    :subtitle="$t('pages.query.subtitle')"
    :showBackIcon="true"
  >
    <template #content>
      <div class="container mt-3">
        <ul class="nav-links">
          <li
            v-for="(item, index) in formattedNavItems"
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
                <div class="col-9 col-md-7">
                  <p class="d-flex flex-column mb-0 text-start">
                    <span :class="item.titleClass" class="fw-bold">
                      {{ t(item.title) }}
                    </span>
                    <span :class="item.subtitleClass" class="fw-light">
                      {{ t(item.subtitle) }}
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
