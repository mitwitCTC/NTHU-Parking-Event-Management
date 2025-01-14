<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import TheLayout from '@/components/TheLayout.vue'
const serial_number = ref('')
serial_number.value = route.params.id
import Api from '@/api'

const form_details = ref({})
const showSearchFailModal = ref(false)
async function getFromDetails() {
  try {
    const response = await Api.post('/main/searchFromDetail', { serial_number: serial_number.value })
    if (response.data.returnCode == 0) {
      form_details.value = {
        form_status: response.data.data.form_status,
        payment_status: response.data.data.payment_status,
        receive_status: response.data.data.receive_status,
        application_time: response.data.data.created_at,
        cancel_application_time: response.data.data.reject_time, // 取消申請時間
        receive_location: response.data.data.receive_location,
        payment_method: response.data.data.payment_method,
        amount: response.data.amount || 0,
        vehicle_registered_list: response.data.data.content.map(({ plate, main_pass_code }) => ({
          plate,
          main_pass_code
        }))
      }
    }
  } catch (error) {
    console.error(error)
    showSearchFailModal.value = true
  }
}
function closeSearchFailModal() {
  showSearchFailModal.value = false
  router.go(-1)
}
function closeCancelApplicationFailModal() {
  showCancelApplicationFailModal.value = false
}

onMounted(() => {
  getFromDetails()
})

import { useFormStatus } from '@/composables/useFormStatus.js'
const { getFormStatuses, getStatusText } = useFormStatus()
getFormStatuses()
const errors = ref({}) // 儲存錯誤訊息
import SearchFailModal from '@/components/SearchFailModal.vue'
import CancelApplicationModal from '@/components/CancelApplicationModal.vue'
import CancelApplicationFailModal from '@/components/CancelApplicationFailModal.vue'
const showCancelApplicationModal = ref(false)
const showCancelApplicationFailModal = ref(true)
function closeCancelApplicationModal() {
  showCancelApplicationModal.value = false
}
async function cancelApplication() {
  try {
    const response = await Api.post('/main/applicantreject', { serial_number: serial_number.value })
    if (response.data.returnCode == 0) {
      closeCancelApplicationModal()
      router.push('/cancel-application-success')
    } else {
      showCancelApplicationFailModal.value = true
    }
  } catch (error) {
    console.error(error)
    showCancelApplicationFailModal.value = true
  }
}
</script>
<template>
  <TheLayout :title="$t('pages.queryStaffParking.title')" :subtitle="$t('pages.queryStaffParking.subtitle')"
    :showBackIcon="true">
    <template #content>
      <div class="form-info-wrapper mt-3">
        <div class="form-info text-center">
          <p class="fs-3">
            {{ serial_number }}
          </p>
          <p>
            <span v-if="form_details.form_status != 2" class="fw-bold fs-4">
              <!-- 若 form_status 不為 2 已審核，顯示表單狀態 -->
              {{ getStatusText('form_status', form_details.form_status) }}
            </span>
            <span v-else-if="form_details.payment_status == 0" class="fw-bold fs-4">
              <!-- 未繳費，顯示審核與繳費狀態 -->
              {{
                getStatusText('form_status', form_details.form_status) +
                ' / ' +
                getStatusText('payment_status', form_details.payment_status)
              }}
            </span>
            <span v-else-if="form_details.payment_status == 1" class="fw-bold fs-4">
              <!-- 已繳費，顯示所有狀態 -->
              {{
                getStatusText('form_status', form_details.form_status) +
                ' / ' +
                getStatusText('payment_status', form_details.payment_status) +
                ' / ' +
                getStatusText('receive_status', form_details.receive_status)
              }}
            </span>
          </p>
        </div>
      </div>
      <div class="container my-2">
        <div class="form-detail">
          <h5>
            {{ $t('pages.queryStaffParking_details.form_info') }}
          </h5>
          <section class="bg-white rounded-2 p-2">
            <div class="mb-2">
              <span class="text-third">
                {{
                  $t(
                    'pages.queryStaffParking_details.application_date',
                  )
                }}
              </span>
              <div class="d-flex align-items-center">
                <div>
                  {{ form_details.application_time }}
                </div>
                <div class="d-flex pointer" v-if="form_details.form_status == 0 || form_details.form_status == 1"
                  @click="showCancelApplicationModal = true">
                  [
                  <span class="text-primary">
                    {{ $t('pages.queryStaffParking_details.cancel_application') }}
                  </span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/delete.svg" alt="delete">
                  </div>
                  ]
                </div>
              </div>
            </div>
            <div v-if="form_details.form_status == 999" class="mb-2">
              <span class="text-third">
                {{ $t('pages.queryStaffParking_details.cancel_application_date') }}
              </span>
              <br />
              <span>
                {{ form_details.cancel_application_time }}
              </span>
            </div>
            <section class="mb-2">
              <div class="d-flex vehicle-header">
                <span class="text-third header-item">
                  {{
                    $t(
                      form_details.form_status == 999
                        ? 'pages.queryStaffParking_details.cancel_application_plate'
                        : 'pages.queryStaffParking_details.plate',
                    )
                  }}
                </span>
                <span class="text-third header-item">
                  {{ $t('pages.queryStaffParking_details.main_pass_code') }}
                </span>
              </div>
              <div class="d-flex vehicle-row px-3" v-for="(item, index) in form_details.vehicle_registered_list"
                :key="index">
                <span class="row-item">{{ item.plate }}</span>
                <span class="row-item">
                  {{ $t(`all_main_pass_code_list.${item.main_pass_code}`) }}
                </span>
              </div>
            </section>
            <p v-if="form_details.form_status != 999">
              <span class="text-third">
                {{ $t('pages.queryStaffParking_details.receive_campus') }}
              </span>
              <br />
              <span>
                {{ $t(`receive_location.${form_details.receive_location || 'unknown'}`) }}
              </span>
            </p>
            <div v-if="form_details.form_status != 999">
              <span class="text-third">
                {{ $t('pages.queryStaffParking_details.payment_method') }}
              </span>
              <br />
              <div v-if="form_details.payment_status == 0" class="d-flex align-items-center">
                <span>
                  {{ $t(`payment_methods.${form_details.payment_method || 'unknown'}`) }}
                </span>
                <div class="d-flex pointer" v-if="form_details.form_status == '2'">
                  [
                  <span class="text-primary">{{ $t('pages.queryStaffParking_details.download') }}</span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/download.svg" alt="download">
                  </div>
                  ]
                </div>
              </div>
              <div v-else-if="form_details.payment_status == 1" class="d-flex align-items-center">
                <span>{{ getStatusText('payment_status', form_details.payment_status) }}</span>
                <div class="d-flex pointer">
                  [
                  <span class="text-primary">{{ $t('pages.queryStaffParking_details.search_invoice') }}</span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/query.svg" alt="query">
                  </div>
                  ]
                </div>
              </div>
            </div>
            <p v-if="form_details.form_status != 999">
              <span class="text-third">
                {{ $t('pages.queryStaffParking_details.amount') }}
              </span>
              <br />
              <span>
                {{ form_details.amount?.toLocaleString('en-US') }}
              </span>
            </p>
            <p v-if="form_details.form_status != 999">
              <span class="text-third">
                {{
                  $t('pages.queryStaffParking_details.receive_status')
                }}
              </span>
              <br />
              <span>
                {{
                  form_details.payment_status == 0
                    ? 'NA'
                    : $t(
                      `statuses.receive_status.${form_details.receive_status}`,
                    )
                }}
              </span>
            </p>
          </section>
        </div>
      </div>
      <!-- 查無表單資訊 modal -->
      <SearchFailModal :showSearchFailModal="showSearchFailModal" :errors="errors" @close="closeSearchFailModal" />
      <!-- 取消申請 modal 開始 -->
      <CancelApplicationModal :showCancelApplicationModal="showCancelApplicationModal" @apply="cancelApplication"
        @close="closeCancelApplicationModal" />
      <!-- 取消申請失敗 modal 開始 -->
      <CancelApplicationFailModal :showCancelApplicationFailModal="showCancelApplicationFailModal"
        @close="closeCancelApplicationFailModal" />
    </template>
  </TheLayout>
</template>

<style scoped lang="scss">
.form-info-wrapper {
  width: 100vw;
  /* 滿版寬度 */
  background-color: white;
  position: relative;
  left: 50%;
  margin-left: -50vw;
}

.form-info {
  margin: 0 auto;
  padding: 16px;
}


.header-item,
.row-item {
  flex: 1;
  /* 讓每個項目占用相同的空間 */
  text-align: start;
  /* 文字水平置中 */
}

.vehicle-header {
  font-weight: bold;
  /* 標題加粗 */
}

.vehicle-row {
  padding: 4px 0;
}

.pointer {
  cursor: pointer;
}

.icon-container {
  width: 25px;
  height: 25px;

  img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
    object-fit: contain;
  }
}
</style>
