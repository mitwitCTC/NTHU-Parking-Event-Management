import { defineStore } from 'pinia'

export const useFacultyStudentStore = defineStore('facultyStudent', {
  state: () => ({
    applicant_data: {},
    vehicle_registered_list: [],
    permitTypeRemaining: [],
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
    setPermitTypeRemaining(data) {
      this.permitTypeRemaining = data
      sessionStorage.setItem('permitTypeRemaining', JSON.stringify(data))
    },
    getPermitTypeRemaining() {
      const storedData = sessionStorage.getItem('permitTypeRemaining')
      if (storedData) {
        this.permitTypeRemaining = JSON.parse(storedData)
      }
    },
    filterAndCalculatePassCodes(data) {
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data)
        this.setPermitTypeRemaining([])
        return
      }
      const filteredData = data
        .filter(
          item => item.main_pass_code === 'TC' || item.main_pass_code === 'TE',
        )
        .map(item => ({
          main_pass_code: item.main_pass_code,
          remaining_count: Math.max(0, 5 - item.count),
        }))
      this.setPermitTypeRemaining(filteredData)
    },
    clear() {
      sessionStorage.removeItem('faculty_student_applicant_data')
      sessionStorage.removeItem(
        'faculty_student_applicant_data_vehicle_registered_list',
      )
      sessionStorage.removeItem('permitTypeRemaining')
      // 清空 Pinia 狀態
      this.applicant_data = {}
      this.vehicle_registered_list = []
      this.permitTypeRemaining = []
    },
  },
})
