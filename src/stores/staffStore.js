import { defineStore } from 'pinia'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    applicant_data: {},
  }),
  actions: {
    setApplicantData(data) {
      this.applicant_data = data
      sessionStorage.setItem('applicant_data', JSON.stringify(data))
    },
    getApplicantData() {
      const storedData = sessionStorage.getItem('applicant_data')
      if (storedData) {
        this.applicant_data = JSON.parse(storedData)
      }
    },
  },
})
