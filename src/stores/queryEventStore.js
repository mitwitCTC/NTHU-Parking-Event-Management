import { defineStore } from 'pinia'

export const useQueryEventStore = defineStore('searchStore', {
  state: () => ({
    searchForm: {
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
