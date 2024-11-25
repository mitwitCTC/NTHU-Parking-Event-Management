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
        class="container d-flex justify-content-center align-items-center h-70vh"
      >
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
</style>
