<template>
  <svg :width="width" :height="height" @click="generateCaptcha">
    <!-- 背景 -->
    <rect width="100%" height="100%" fill="#f3f4f6" />
    <!-- 變形文字 -->
    <g
      v-for="(char, index) in captchaText"
      :key="index"
      :transform="getTransform(index)"
    >
      <text
        :x="getCharX(index)"
        :y="height / 2"
        dominant-baseline="middle"
        text-anchor="middle"
        :fill="textColor"
        :font-size="fontSize"
        font-family="monospace"
        style="user-select: none"
      >
        {{ char }}
      </text>
    </g>
    <!-- 遮罩文字 -->
    <rect
      width="100%"
      height="100%"
      fill="transparent"
      style="pointer-events: none"
    />
  </svg>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 定義常數
const width = 120
const height = 40
const fontSize = 24
const textColor = '#333'
const captchaText = ref('')

// 定義 emit 事件
const emit = defineEmits(['update:captchaText'])

// 隨機生成驗證碼
function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaText.value = Array.from({ length: 5 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('')

  // 發送 captchaText 的值給父組件
  emit('update:captchaText', captchaText.value)
}

// 計算每個字元的 x 位置
function getCharX(index) {
  const spacing = width / captchaText.value.length
  return spacing * index + spacing / 2
}

// 生成文字的變形屬性 (旋轉 & 縮放)
function getTransform(index) {
  const rotate = Math.random() * 20 - 10 // 限制旋轉角度為 -10 至 10 度
  const scale = 0.9 + Math.random() * 0.2 // 縮放比例為 0.9 至 1.1
  const x = getCharX(index)
  const y = height / 2
  return `translate(${x}, ${y}) rotate(${rotate}) scale(${scale}) translate(${-x}, ${-y})`
}

onMounted(generateCaptcha)
</script>

<style scoped>
svg {
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  user-select: none; /* 防止選中文字 */
}
</style>
