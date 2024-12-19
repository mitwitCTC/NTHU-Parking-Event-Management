<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.queryEvent.title')"
    :subtitle="$t('pages.queryEvent.subtitle')"
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
