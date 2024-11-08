<template>
  <div class="bg-secondary text-center fixed-top">
    <div class="header text-white">
      <!-- 插槽顯示頁首內容 -->
      <slot name="header-content"></slot>
    </div>
    <!-- 默認插槽，顯示 LanguageSwitcher -->
    <slot></slot>
  </div>
</template>

<style scoped>
.header {
  padding: 20px;
  color: white;
}
</style>
