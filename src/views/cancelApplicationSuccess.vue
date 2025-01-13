<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout :title="$t('pages.cancelApplicationSuccess.title')"
    :subtitle="$t('pages.cancelApplicationSuccess.subtitle')" :showBackIcon="false">
    <template #content>
      <div class="container d-flex flex-column justify-content-center align-items-center h-70vh">
        <div class="img-container">
          <img src="/images/modal/Paomedia-Small-N-Flat-Sign-check.svg" alt="check" />
        </div>
        <h3 class="lh-lg text-center">
          <span>
            {{ $t('pages.cancelApplicationSuccess.canceled') }}
          </span>
          <br>
          <span>
            <router-link to="/query-links" class="fw-bold text-decoration-underline">
              {{ $t('pages.cancelApplicationSuccess.backQueryLinks') }}
            </router-link>
          </span>
        </h3>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.h-70vh {
  height: 70vh;
}

.img-container {
  width: 80px;
  height: 80px;
  margin-bottom: 40px;

  img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
}
</style>
