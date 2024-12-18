<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.applicationSuccess.title')"
    :subtitle="$t('pages.applicationSuccess.subtitle')"
    :showBackIcon="false"
  >
    <template #content>
      <div
        class="container d-flex flex-column justify-content-center align-items-center h-70vh"
      >
        <div class="img-container">
          <img
            src="/images/modal/Paomedia-Small-N-Flat-Sign-check.svg"
            alt="check"
          />
        </div>
        <h3 class="lh-lg">
          <span>
            {{ $t('pages.applicationSuccess.received') }}
          </span>
          <span>
            <router-link to="/" class="fw-bold text-decoration-underline">
              {{ $t('pages.applicationSuccess.index') }}
            </router-link>
          </span>
          <span>
            {{ $t('pages.applicationSuccess.checkProgress') }}
          </span>
          <span>
            <router-link
              to="query-links"
              class="fw-bold text-decoration-underline"
            >
              {{ $t('pages.applicationSuccess.queryLinks') }}
            </router-link>
          </span>
          <span>
            {{ $t('pages.applicationSuccess.progressInquiry') }}
          </span>
        </h3>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.h-70vh {
  height: 70vh;
}
.img-container {
  width: 80px;
  height: 80px;
  margin-bottom: 40px;
  img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
}
</style>
