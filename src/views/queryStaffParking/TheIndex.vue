<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import TheLayout from '@/components/TheLayout.vue'

import { useQueryStaffParkingStore } from '@/stores/queryStaffParkingStore'
const searchStore = useQueryStaffParkingStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import { ref, computed, onMounted } from 'vue'
import { useAcademicYears } from '@/composables/getAcademicYears.js'
const { academicYears } = useAcademicYears('/api/academic-years')
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import pacaApi from '@/pacaApi'
import NoSearchResultModal from '@/components/NoSearchResultModal.vue'
import SearchFailModal from '@/components/SearchFailModal.vue'
const errors = ref({}) // 儲存錯誤訊息
const showNoSearchResultModal = ref(false)
const showSearchFailModal = ref(false)
function closeNoSearchResultModal() {
  showNoSearchResultModal.value = false
}
function closeSearchFailModal() {
  showSearchFailModal.value = false
}
import { useFormStatus } from '@/composables/useFormStatus.js'
const search_form_request_data = ref({
  applicant: '',
  phone_number: '',
  academic_year: null,
})
const result_list = ref([])
const { getFormStatuses, getStatusText } = useFormStatus()
getFormStatuses()
const isLoadingResult_list = ref(false)
async function search() {
  isLoadingResult_list.value = true
  await getFormInfo('工作證')
  search_form_request_data.value.form_code = form_info.value.form_code
  search_form_request_data.value.email = ''
  search_form_request_data.value.applicant_number = ''
  search_form_request_data.value.activity_title = ''
  search_form_request_data.value.project_number = ''
  try {
    const response = await pacaApi.post('/v2/forms/formsearch', search_form_request_data.value, {
      headers: {
        authorization:
          'jYs3u6lUwi4iwyvGCl0BPnPyefUfIVd1iGLcMUoFn0mWm2hLs04MY460IJbZTT9T+6+H+ejjAbzwzmW17aSX5+z3',
      },
    })

    result_list.value = response.data.map(({ id, serial_number, form_status, payment_status, receive_status }) => ({
      id,
      serial_number,
      form_status,
      payment_status,
      receive_status,
    }))

    if (result_list.value.length <= 0) {
      showNoSearchResultModal.value = true
    }

  } catch (error) {
    console.error(error)
    showSearchFailModal.value = true
    result_list.value = []
  }

  // 儲存搜尋條件和結果
  searchStore.setSearchForm(search_form_request_data.value)
  searchStore.setResultList(result_list.value)

  setTimeout(() => {
    isLoadingResult_list.value = false
  }, 1000)
}
onMounted(() => {
  // 初始化搜尋條件和結果
  search_form_request_data.value = { ...searchStore.searchForm }
  result_list.value = [...searchStore.resultList]
})

// 表格的多語系標籤
const tableLabels = computed(() => ({
  serial_number: t('pages.queryStaffParking.serial_number'),
  status: t('pages.queryStaffParking.status'),
}))

function goToDetail(serial_number) {
  router.push(`/query-staff-parking/${serial_number}`)
}
</script>

<template>
  <TheLayout :title="$t('pages.queryStaffParking.title')" :subtitle="$t('pages.queryStaffParking.subtitle')"
    :showBackIcon="true">
    <template #content>
      <div class="content-container">
        <form>
          <div class="mb-3">
            <label for="applicant" class="form-label">
              {{ $t('pages.queryStaffParking.applicant') }}
            </label>
            <input type="text" class="form-control" id="applicant" v-model="search_form_request_data.applicant" />
          </div>
          <div class="mb-3">
            <label for="phone_number" class="form-label">
              {{ $t('pages.queryStaffParking.phone_number') }}
            </label>
            <input type="text" class="form-control" id="phone_number" v-model="search_form_request_data.phone_number" />
          </div>
          <div class="mb-3">
            <label for="academic_year" class="form-label">
              {{ $t('pages.queryStaffParking.academic_year') }}
            </label>
            <select class="form-select" v-model="search_form_request_data.academic_year">
              <option v-for="year in academicYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="text-center">
            <button class="btn btn-secondary w-100" @click.prevent="search">
              {{ $t('pages.queryStaffParking.query') }}
            </button>
          </div>
        </form>
        <loading :active="isLoadingResult_list" :is-full-page="true"></loading>

        <div class="result-list px-2">
          <table class="table table-light" v-if="result_list.length > 0">
            <thead>
              <tr>
                <th scope="col" class="text-center">
                  {{ tableLabels.serial_number }}
                </th>
                <th scope="col" class="text-center">
                  {{ tableLabels.status }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in result_list" :key="index" class="pointer"
                @click="goToDetail(item.serial_number)">
                <th scope="row" class="text-center">
                  {{ item.serial_number }}
                </th>
                <th scope="row" class="text-end">
                  <span v-if="item.form_status != 2">
                    <!-- 若 form_status 不為 2 已審核，顯示表單狀態 -->
                    {{ getStatusText('form_status', item.form_status) }}
                  </span>
                  <span v-else-if="item.payment_status == 0">
                    <!-- 未繳費，顯示審核與繳費狀態 -->
                    {{
                      getStatusText('form_status', item.form_status) +
                      ' / ' +
                      getStatusText('payment_status', item.payment_status)
                    }}
                  </span>
                  <span v-else-if="item.payment_status == 1">
                    <!-- 已繳費，顯示付款與領取狀態 -->
                    {{
                      getStatusText('payment_status', item.payment_status) +
                      ' / ' +
                      getStatusText('receive_status', item.receive_status)
                    }}
                  </span>
                  <span class="text-primary pointer fw-bold"> &gt; </span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <NoSearchResultModal :showNoSearchResultModal="showNoSearchResultModal" :errors="errors"
          @close="closeNoSearchResultModal" />
        <SearchFailModal :showSearchFailModal="showSearchFailModal" :errors="errors" @close="closeSearchFailModal" />
        <router-view />
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.back-icon {
  cursor: pointer;
}

.pointer {
  cursor: pointer;
}

/* 確保頁面高度不超過視口高度 */
.content-container {
  display: flex;
  flex-direction: column;
}


.result-list {
  margin-top: 5px;
  flex-grow: 1;
  /* 佔據剩餘空間 */
  border: 2px solid darkgrey;
  width: 100%;
  overflow-y: auto;
  /* 僅垂直滾動 */
  height: 35vh;
}
</style>
