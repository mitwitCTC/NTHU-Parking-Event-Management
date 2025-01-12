import { defineStore } from 'pinia'

export const useQueryStaffParkingStore = defineStore('searchStore', {
  state: () => ({
    searchForm: {
      applicant: '',
      phone_number: '',
      academic_year: null,
    },
    resultList: [],
  }),
  actions: {
    setSearchForm(form) {
      this.searchForm = { ...form }
    },
    setResultList(results) {
      this.resultList = [...results]
    },
  },
})
