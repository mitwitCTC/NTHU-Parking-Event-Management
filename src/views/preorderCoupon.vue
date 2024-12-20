<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.preorderCoupon.title')"
    :subtitle="$t('pages.preorderCoupon.subtitle')"
    :showBackIcon="true"
  >
    <template #content>
      <router-view></router-view>
    </template>
  </TheLayout>
</template>

<style scoped>
.back-icon {
  cursor: pointer;
}
</style>
