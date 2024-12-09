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
