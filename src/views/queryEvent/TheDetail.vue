<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import TheLayout from '@/components/TheLayout.vue'
const serial_number = ref('')
serial_number.value = route.params.id

const form_details = ref({})
async function getFromDetails() {
  form_details.value = {
    form_status: '2',
    application_time: '2024-12-20 09:05:13',
    cancel_application_time: '2024-12-21 09:05:13',
    activity_title: "OOXX研討會",
    activity_campus: "1",
    activity_start_date: "2024-11-01",
    activity_end_date: "2024-11-30",
    activity_start_time: "09:05:13",
    activity_end_time: "18:05:13",
    parkingArea: "大禮堂前"
  }
}
onMounted(() => {
  getFromDetails()
})

import { useFormStatus } from '@/composables/useFormStatus.js'
const { getFormStatuses, getStatusText } = useFormStatus()
getFormStatuses()
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
                <div class="d-flex pointer" v-if="form_details.form_status == 0 || form_details.form_status == 1">
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
