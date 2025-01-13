import { defineStore } from 'pinia'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    applicant_data: {},
    staff_applicant_data_vehicle_registered_list: [], // 新增陣列用於儲存車輛註冊資料
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
    clear() {
      sessionStorage.removeItem('staff_applicant_data')
      sessionStorage.removeItem('staff_applicant_data_vehicle_registered_list') // 移除車輛資料
      this.applicant_data = {}
      this.staff_applicant_data_vehicle_registered_list = []
    },
    setVehicleRegisteredList(dataArray) {
      // 僅提取 plate、main_pass_code、car_type_title 並存入 vehicle_registered_list
      this.staff_applicant_data_vehicle_registered_list = dataArray.map(
        ({ plate, main_pass_code, car_type_title }) => ({
          plate,
          main_pass_code,
          car_type_title,
        }),
      )

      // 寫入 sessionStorage
      sessionStorage.setItem(
        'staff_applicant_data_vehicle_registered_list',
        JSON.stringify(this.staff_applicant_data_vehicle_registered_list),
      )
    },
    getVehicleRegisteredList() {
      const storedList = sessionStorage.getItem(
        'staff_applicant_data_vehicle_registered_list',
      )
      if (storedList) {
        this.staff_applicant_data_vehicle_registered_list =
          JSON.parse(storedList)
      }
    },
  },
})
