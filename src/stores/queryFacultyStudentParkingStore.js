import { defineStore } from 'pinia'

export const useQueryFacultyStudentParkingStore = defineStore('searchStore', {
  state: () => ({
    searchForm: {
      applicant_number: '',
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
