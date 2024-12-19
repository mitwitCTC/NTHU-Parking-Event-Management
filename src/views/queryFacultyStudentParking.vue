<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout
    :title="$t('pages.queryFacultyStudentParking.title')"
    :subtitle="$t('pages.queryFacultyStudentParking.subtitle')"
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
