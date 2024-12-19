<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.queryCoupon.title')"
    :subtitle="$t('pages.queryCoupon.subtitle')"
    :showBackIcon="true"
  >
    <template #content>
      <div class="container"></div>
    </template>
  </TheLayout>
</template>

<style scoped>
.back-icon {
  cursor: pointer;
}
</style>
