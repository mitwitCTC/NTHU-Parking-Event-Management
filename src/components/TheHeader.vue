<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  showBackIcon: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="bg-secondary text-center fixed-top">
    <div class="header text-white d-flex align-items-center">
      <!-- 回上一頁 -->
      <img
        v-if="showBackIcon"
        src="/images/Chevron-left.svg"
        alt="back-icon"
        @click="$emit('goBack')"
        class="back-icon me-3"
      />
      <div class="flex-grow-1 text-center">
        <!-- 標題 -->
        <h2>{{ title }}</h2>
        <!-- 副標題 -->
        <h5>{{ subtitle }}</h5>
      </div>
    </div>
    <!-- 默認插槽，顯示 HeaderButtonsSection -->
    <slot></slot>
  </div>
</template>

<style scoped>
.header {
  padding: 20px;
  color: white;
}

.back-icon {
  cursor: pointer;
  width: 24px;
}
</style>
