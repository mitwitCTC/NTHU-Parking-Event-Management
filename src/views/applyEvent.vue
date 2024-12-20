<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.applyEvent.title')"
    :subtitle="$t('pages.applyEvent.subtitle')"
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
