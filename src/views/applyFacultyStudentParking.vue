<script setup>
import { ref, onMounted } from 'vue'
import TheLayout from '@/components/TheLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const isValid = ref(true)
onMounted(() => {
  if (isValid.value) {
    router.replace({ name: 'ApplyFacultyStudentParking_step1' })
  } else {
    router.replace({ name: 'ApplyFacultyStudentParking_VerifyFail' })
  }
})
</script>

<template>
  <TheLayout
    :title="$t('pages.applyFacultyStudentParking.title')"
    :subtitle="$t('pages.applyFacultyStudentParking.subtitle')"
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
