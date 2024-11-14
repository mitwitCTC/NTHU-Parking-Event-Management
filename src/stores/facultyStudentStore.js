import { defineStore } from 'pinia'

export const useFacultyStudentStore = defineStore('facultyStudent', {
  state: () => ({
    applicant_data: {},
  }),
  actions: {
    setApplicantData(data) {
      this.applicant_data = data
      sessionStorage.setItem(
        'faculty_student_applicant_data',
        JSON.stringify(data),
      )
    },
    getApplicantData() {
      const storedData = sessionStorage.getItem(
        'faculty_student_applicant_data',
      )
      if (storedData) {
        this.applicant_data = JSON.parse(storedData)
      }
    },
  },
})
