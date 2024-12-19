<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.queryStaffParking.title')"
    :subtitle="$t('pages.queryStaffParking.subtitle')"
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
