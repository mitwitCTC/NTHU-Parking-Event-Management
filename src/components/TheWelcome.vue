<script setup>
import TheLayout from '@/components/TheLayout.vue'
</script>

<template>
  <TheLayout>
    <template #header-content>
      <h2>{{ $t('pages.index.title') }}</h2>
      <h5>{{ $t('pages.index.subtitle') }}</h5>
    </template>
    <template #content>
      <div class="query-btn d-flex justify-content-end pe-3">
        <button class="btn btn-primary">
          <router-link to="query-links" class="text-white">
            {{ $t('pages.index.queryLinks') }}
          </router-link>
        </button>
      </div>
      <div class="container">內容</div>
    </template>
  </TheLayout>
</template>
