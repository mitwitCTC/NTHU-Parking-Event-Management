<script setup>
import { ref, onMounted } from 'vue'
import TheLayout from '@/components/TheLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const isValid = ref(true)
onMounted(() => {
  if (isValid.value) {
    router.push({ name: 'ApplyFacultyStudentParking_step1' })
  } else {
    router.push({ name: 'ApplyFacultyStudentParking_VerifyFail' })
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
