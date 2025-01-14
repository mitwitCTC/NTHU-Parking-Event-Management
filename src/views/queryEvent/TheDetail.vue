<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
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
        application_time: response.data.dataapplication_time,
        cancel_application_time: response.data.data.reject_time, // 取消申請時間
        activity_title: response.data.data.activity_title,
        activity_campus: response.data.data.activity_campus,
        activity_start_date: response.data.data.activity_start_date,
        activity_end_date: response.data.data.activity_end_date,
        activity_start_time: response.data.data.activity_start_time,
        activity_end_time: response.data.data.activity_end_time,
        parkingArea: response.data.data.application_park_location
      }
    }
  } catch (error) {
    console.error(error)
    showSearchFailModal.value = true
  }
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
  <TheLayout :title="$t('pages.queryEvent.title')" :subtitle="$t('pages.queryEvent.subtitle')" :showBackIcon="true">
    <template #content>
      <div class="form-info-wrapper mt-3">
        <div class="form-info text-center">
          <p class="fs-3">
            {{ serial_number }}
          </p>
          <p class="fw-bold fs-4">
            {{ getStatusText('form_status', form_details.form_status) }}
          </p>
        </div>
      </div>
      <div class="container my-2">
        <div class="form-detail">
          <h5>
            {{ $t('pages.queryEvent_details.form_info') }}
          </h5>
          <section class="bg-white rounded-2 p-2">
            <div class="mb-2">
              <span class="text-third">
                {{
                  $t(
                    'pages.queryEvent_details.application_date',
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
                    {{ $t('pages.queryEvent_details.cancel_application') }}</span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/delete.svg" alt="delete">
                  </div>
                  ]
                </div>
              </div>
            </div>
            <div v-if="form_details.form_status == 999" class="mb-2">
              <span class="text-third">
                {{ $t('pages.queryEvent_details.cancel_application_date') }}
              </span>
              <br />
              <span>
                {{ form_details.cancel_application_time }}
              </span>
            </div>
            <div class="mb-2">
              <span class="text-third">
                {{ $t('pages.queryEvent_details.activity_title') }}
              </span>
              <br />
              <span>
                {{ form_details.activity_title }}
              </span>
            </div>
            <div v-if="form_details.form_status != '999'">
              <div class="mb-2">
                <span class="text-third">
                  {{
                    $t('pages.queryEvent_details.activity_campus')
                  }}
                </span>
                <br />
                <span>
                  {{ $t(`receive_location.${form_details.activity_campus}`) }}
                </span>
              </div>
              <div class="mb-2">
                <span class="text-third">
                  {{ $t('pages.queryEvent_details.activity_start_date') }}
                </span>
                <br />
                <span>
                  {{ form_details.activity_start_date }}
                </span>
              </div>
              <div class="mb-2">
                <span class="text-third">
                  {{ $t('pages.queryEvent_details.activity_start_time') }}
                </span>
                <br />
                <span>
                  {{ form_details.activity_start_time }}
                </span>
              </div>
              <div class="mb-2">
                <span class="text-third">
                  {{ $t('pages.queryEvent_details.activity_end_date') }}
                </span>
                <br />
                <span>
                  {{ form_details.activity_end_date }}
                </span>
              </div>
              <div class="mb-2">
                <span class="text-third">
                  {{ $t('pages.queryEvent_details.activity_end_time') }}
                </span>
                <br />
                <span>
                  {{ form_details.activity_end_time }}
                </span>
              </div>
              <div class="mb-2">
                <span class="text-third">
                  {{ $t('pages.queryEvent_details.parkingArea') }}
                </span>
                <br />
                <span>
                  {{ form_details.parkingArea ? form_details.parkingArea : 'NA' }}
                </span>
              </div>
            </div>
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
