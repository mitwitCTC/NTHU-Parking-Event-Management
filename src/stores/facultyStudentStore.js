import { defineStore } from 'pinia'

export const useFacultyStudentStore = defineStore('facultyStudent', {
  state: () => ({
    applicant_data: {},
    vehicle_registered_list: [],
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
    setVehicleRegisteredList(data) {
      this.vehicle_registered_list = data
      sessionStorage.setItem(
        'faculty_student_applicant_data_vehicle_registered_list',
        JSON.stringify(data),
      )
    },
    getVehicleRegisteredList() {
      const storedData = sessionStorage.getItem(
        'faculty_student_applicant_data_vehicle_registered_list',
      )
      if (storedData) {
        this.vehicle_registered_list = JSON.parse(storedData)
      }
    },
  },
})
