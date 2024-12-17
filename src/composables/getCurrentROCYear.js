import { ref } from 'vue'

export function useROCYear() {
  // 用來儲存民國年的變數
  const rocYear = ref(0)

  // 計算今年的民國年
  function getROCYear() {
    const currentYear = new Date().getFullYear() // 取得西元年
    rocYear.value = currentYear - 1911 // 計算民國年
  }

  // 在組件掛載時自動執行一次 getROCYear()
  getROCYear()

  return { rocYear, getROCYear }
}
