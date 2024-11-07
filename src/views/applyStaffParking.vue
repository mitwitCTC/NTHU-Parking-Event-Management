<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout>
    <template #header-content>
      <div class="d-flex">
        <img
          src="/images/Chevron-left.svg"
          alt="back-icon"
          @click="$router.back(-1)"
          class="back-icon ms-3"
        />
        <div class="text-center flex-grow-1">
          <h2>{{ $t('pages.applyStaffParking.title') }}</h2>
          <h5>{{ $t('pages.applyStaffParking.subtitle') }}</h5>
        </div>
      </div>
    </template>
    <template #content>
      <div class="container">
        <router-view></router-view>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.back-icon {
  cursor: pointer;
}
</style>
