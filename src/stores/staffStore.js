import { defineStore } from 'pinia'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    applicant_data: {},
  }),
  actions: {
    setApplicantData(data) {
      this.applicant_data = data
      sessionStorage.setItem('staff_applicant_data', JSON.stringify(data))
    },
    getApplicantData() {
      const storedData = sessionStorage.getItem('staff_applicant_data')
      if (storedData) {
        this.applicant_data = JSON.parse(storedData)
      }
    },
  },
})
