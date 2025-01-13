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
        payment_status: response.data.data.payment_status,
        application_time: response.data.data.application_time,
        cancel_application_time: response.data.data.reject_time, // 取消申請時間
        coupon_quantity: response.data.data.coupon_quantity,
        amount: response.data.data.amount,
        payment_method: response.data.data.payment_method,
        project_number: response.data.data.project_number,
        receive_method: response.data.data.receive_method,
        invoice_status: response.data.data.invoice_status, // 發票狀態
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
      router.push('cancel-application-success')
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
  <TheLayout :title="$t('pages.queryCoupon.title')" :subtitle="$t('pages.queryCoupon.subtitle')" :showBackIcon="true">
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
            <span v-else class="fw-bold fs-4">
              <!-- 已審核(2) -->
              {{
                getStatusText('form_status', form_details.form_status)
              }}
            </span>
            <!-- 已審核(2)、付費方式為2繳費單，則呈現繳費狀態 -->
            <span v-if="form_details.form_status == 2 && form_details.payment_method == 2" class="fw-bold fs-4">
              /
              {{ getStatusText('payment_status', form_details.payment_status) }}
            </span>
          </p>
        </div>
      </div>
      <div class="container my-2">
        <div class="form-detail">
          <h5>
            {{ $t('pages.queryCoupon_details.form_info') }}
          </h5>
          <section class="bg-white rounded-2 p-2">
            <div class="mb-2">
              <span class="text-third">
                {{
                  $t(
                    'pages.queryCoupon_details.application_date',
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
                    {{ $t('pages.queryCoupon_details.cancel_application') }}</span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/delete.svg" alt="delete">
                  </div>
                  ]
                </div>
              </div>
            </div>
            <div v-if="form_details.form_status == 999" class="mb-2">
              <span class="text-third">
                {{
                  $t(
                    'pages.queryCoupon_details.cancel_application_date',
                  )
                }}
              </span>
              <br />
              <span>
                {{ form_details.cancel_application_time }}
              </span>
            </div>
            <p v-if="form_details.form_status != 999">
              <span class="text-third">
                {{
                  $t('pages.queryCoupon_details.coupon_quantity')
                }}
              </span>
              <br />
              <span>
                {{ form_details.coupon_quantity ? form_details.coupon_quantity?.toLocaleString('en-US') : 'NA' }}
              </span>
              <span>
                &nbsp;
                {{
                  form_details.coupon_quantity ? $t('pages.queryCoupon_details.unit') : ''
                }}
              </span>
            </p>
            <p v-if="form_details.form_status != 999">
              <span class="text-third">
                {{
                  $t('pages.queryCoupon_details.amount')
                }}
              </span>
              <br />
              <span class="d-flex">
                <span>
                  {{ form_details.amount ? form_details.amount?.toLocaleString('en-US') : 'NA' }}
                </span>
                <span>
                  &nbsp;
                  {{
                    form_details.amount ? $t('pages.queryCoupon_details.dollar') : ''
                  }}
                </span>
                <span v-if="form_details.payment_method == 2 && form_details.invoice_status" class="d-flex pointer">
                  [
                  <span class="text-primary">{{ $t('pages.queryCoupon_details.search_invoice') }}</span>
                  <div class="icon-container mx-2">
                    <img src="/images/query/query.svg" alt="query">
                  </div>
                  ]
                </span>
              </span>
            </p>
            <div v-if="form_details.form_status != 999" class="mb-3">
              <span class="text-third">
                {{
                  $t('pages.queryCoupon_details.payment_method')
                }}
              </span>
              <br />
              <!-- 表單狀態0/1審核中、付費方式為4計劃經費，顯示付費方式及計劃編號 -->
              <!-- 表單狀態0/1審核中、付費方式為2繳費單，顯示付費方式 -->
              <div v-if="form_details.form_status == 0 || form_details.form_status == 1">
                <div v-if="form_details.payment_method == 4">
                  <span>
                    {{ $t(`payment_methods.${form_details.payment_method}`) }}
                  </span>
                  <span>
                    &nbsp;
                    {{ form_details.project_number }}
                  </span>
                </div>
                <div v-if="form_details.payment_method == 2">
                  {{ $t(`payment_methods.${form_details.payment_method}`) }}
                </div>
              </div>
              <!-- 表單狀態2已審核通過、付費方式為4計劃經費，顯示付費方式及計劃編號 -->
              <!-- 表單狀態2已審核通過、付費方式為2繳費單，顯示付費方式及下載連結 -->
              <div v-if="form_details.form_status == 2">
                <div v-if="form_details.payment_method == 4">
                  <span>
                    {{ $t(`payment_methods.${form_details.payment_method}`) }}
                  </span>
                  <span>
                    &nbsp;
                    {{ form_details.project_number }}
                  </span>
                </div>
                <div v-if="form_details.payment_method == 2" class="d-flex">
                  {{ $t(`payment_methods.${form_details.payment_method}`) }}
                  <div class="d-flex pointer"
                    v-if="form_details.form_status == '2' && form_details.payment_status == '0'">
                    [
                    <span class="text-primary">{{ $t('pages.queryCoupon_details.download') }}</span>
                    <div class="icon-container mx-2">
                      <img src="/images/query/download.svg" alt="download">
                    </div>
                    ]
                  </div>
                </div>
              </div>
            </div>
            <div v-if="form_details.form_status != 999" class="mb-3">
              <span class="text-third">
                {{
                  $t('pages.queryCoupon_details.receive_method')
                }}
              </span>
              <br>
              <span>
                {{ $t(`receive_methods.${form_details.receive_method}`) }}
              </span>
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
