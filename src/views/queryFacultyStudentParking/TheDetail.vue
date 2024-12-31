<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import TheLayout from '@/components/TheLayout.vue'
import { computed } from 'vue'
const serial_number = ref('')
serial_number.value = computed(() => {
  console.log(router)
  return this.$route.params.id
})
</script>
<template>
  <TheLayout
    :title="$t('pages.queryFacultyStudentParking.title')"
    :subtitle="$t('pages.queryFacultyStudentParking.subtitle')"
    :showBackIcon="true"
  >
    <div>
      <h1>Detail Page</h1>
      <p>Serial Number: {{ serial_number }}</p>
    </div>
  </TheLayout>
</template>
