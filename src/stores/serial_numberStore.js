import { defineStore } from 'pinia'

export const useSerialStore = defineStore('serial', {
  state: () => ({
    serialNumbers: {}, // 以表單類型作為 key 儲存 serial_number
  }),
  actions: {
    // 設定 serial_number 並同步到 sessionStorage
    setSerialNumber(formType, serialNumber) {
      this.serialNumbers[formType] = serialNumber
      sessionStorage.setItem(`serial_number_${formType}`, serialNumber)
    },
    // 從 Pinia 或 sessionStorage 取得 serial_number
    getSerialNumber(formType) {
      return (
        this.serialNumbers[formType] ||
        sessionStorage.getItem(`serial_number_${formType}`) ||
        ''
      )
    },
    // 清除特定表單類型的 serial_number
    clearSerialNumber(formType) {
      delete this.serialNumbers[formType]
      sessionStorage.removeItem(`serial_number_${formType}`)
    },
  },
})
