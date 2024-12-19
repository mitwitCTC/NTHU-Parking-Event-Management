import { defineStore } from 'pinia'

export const useEventCouponStore = defineStore('eventCoupon', {
  state: () => ({
    applicant_data: {},
  }),
  actions: {
    setApplicantData(data) {
      this.applicant_data = data
      sessionStorage.setItem(
        'event_coupon_applicant_data',
        JSON.stringify(data),
      )
    },
    getApplicantData() {
      const storedData = sessionStorage.getItem('event_coupon_applicant_data')
      if (storedData) {
        this.applicant_data = JSON.parse(storedData)
      }
    },
    clear() {
      sessionStorage.removeItem('event_coupon_applicant_data')
      // 清空 Pinia 狀態
      this.applicant_data = {}
    },
  },
})
