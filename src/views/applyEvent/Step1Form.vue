<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import StepNavigator from '@/components/StepNavigator.vue'
import router from '@/router'
import { useFormInfo } from '@/composables/useFormInfo'
const { form_info, getFormInfo } = useFormInfo()
import { useROCYear } from '@/composables/getCurrentROCYear'
const { rocYear, getROCYear } = useROCYear()
onMounted(() => {
  getROCYear()
})
const currentStep = ref(1)

// 定義步驟資料
const steps = [
  {
    step: 1,
    to: '/apply-event/Step1',
    imageSrc: '/images/upload/填寫申請書.svg',
    alt: 'stepNavigator.fillOut',
    title: 'stepNavigator.fillOut',
    currentStepClass: 1,
  },
  {
    step: 2,
    to: '/apply-event/Step2_1',
    imageSrc: '/images/upload/上傳申請書.svg',
    alt: 'stepNavigator.uploadAndSubmit',
    title: 'stepNavigator.uploadAndSubmit',
    currentStepClass: 2,
  },
]

// 申請人資料
const applicant_data = ref({
  activity_title: '', // 活動名稱
  activity_start_date: '', // 活動日期(起)
  activity_end_date: '', // 活動日期(迄)
  activity_start_time: '', // 活動時間(起)
  activity_end_time: '', // 活動時間(迄)
  activity_campus: '1', // 預設在校本部活動
  area: '', // 活動地點
  headcount: 0, // 預估參加人數
  bus_count: 0, // 預估入校遊覽車數
  car_count: 0, // 預估入校小客車數
  source: '', // 申請單位
  applicant: '', // 申請人
  phone_number: '', // 連絡電話
  email: '', // 信箱
})
const startDateInput = ref(null)
const endDateInput = ref(null)
const startTimeInput = ref(null)
const endTimeInput = ref(null)

const tomorrowDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = (today.getDate() + 1).toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})

// 根據 start_date 動態設定 end_date 的 min
const minEndDate = computed(() => {
  return applicant_data.value.activity_start_date || tomorrowDate.value
})
watch(
  () => applicant_data.value.activity_start_date,
  newStartDate => {
    if (newStartDate && applicant_data.value.activity_end_date < newStartDate) {
      applicant_data.value.activity_end_date = newStartDate
    }
  },
)

function openDatePicker(type) {
  if (type === 'startDate' && startDateInput.value) {
    startDateInput.value.showPicker()
  } else if (type === 'endDate' && endDateInput.value) {
    endDateInput.value.showPicker()
  }
}
function openTimePicker(type) {
  if (type === 'startTime' && startDateInput.value) {
    startTimeInput.value.showPicker()
  } else if (type === 'endTime' && endDateInput.value) {
    endTimeInput.value.showPicker()
  }
}

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    activity_title: { required: true },
    activity_start_date: { required: true },
    activity_end_date: { required: true },
    activity_start_time: { required: true },
    activity_end_time: { required: true },
    activity_campus: { required: true },
    area: { required: true },
    headcount: { required: true },
    bus_count: { required: true },
    car_count: { required: true },
    source: { required: true },
    applicant: { required: true },
    phone_number: { required: true, phone_number: true },
    email: { required: true, email: true },
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errors: errorsResult } =
      formValidatorRef.value.validateForm(applicant_data.value, rules)

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult
      // 設定錯誤訊息
      showModal.value = true // 顯示驗證錯誤 Modal
    }

    return isValid
  } else {
    console.error('FormValidator reference is not correctly initialized.')
    return false
  }
}
// 這個方法將由 ValidationModal 觸發來關閉 Modal
function closeValidatorModal() {
  showModal.value = false
}
function handleNext() {
  if (formValidate()) {
    showConfirmModal.value = true
  }
}
const showConfirmModal = ref(false) // 控制 確認送出申請Modal 顯示
function closeConfirmModal() {
  showConfirmModal.value = false
}
const formatApplicationData = ref({})
async function apply() {
  if (formValidate()) {
    await getFormInfo('活動')
    formatApplicationData.value = {
      title: form_info.value.title, // 表單名稱
      form_code: form_info.value.form_code, // 表單代碼
      academic_year: rocYear,
      applicant_type: 0,
      activity_title: applicant_data.value.activity_title,
      activity_start_date: applicant_data.value.activity_start_date,
      activity_end_date: applicant_data.value.activity_end_date,
      activity_start_time: applicant_data.value.activity_start_time,
      activity_end_time: applicant_data.value.activity_end_time,
      activity_location: applicant_data.value.activity_campus,
      event_location: applicant_data.value.area,
      activity_people_quantity: applicant_data.value.headcount,
      activity_bus_quantity: applicant_data.value.bus_count,
      activity_car_quantity: applicant_data.value.car_count,
      activity_source: applicant_data.value.source,
      applicant: applicant_data.value.applicant,
      phone_number: applicant_data.value.phone_number,
      email: applicant_data.value.email,
    }
    showConfirmModal.value = false
    router.replace({ name: 'Home' })
  }
}
function goToUploadDocuments() {
  router.push({ name: 'ApplyEvent_step2_1' })
}
</script>
<template>
  <StepNavigator :currentStep="currentStep" :steps="steps" />
  <!-- 引入 FormValidator 元件 -->
  <FormValidator ref="formValidatorRef" />
  <form>
    <div class="mb-3">
      <label for="activity" class="form-label">
        {{ $t('pages.applyEvent.form.activity') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="activity"
        v-model="applicant_data.activity_title"
      />
    </div>
    <div class="mb-3 position-relative">
      <label for="activity_start_date" class="form-label">
        {{ $t('pages.applyEvent.form.start_date') }}
      </label>
      <div @click="openDatePicker('startDate')">
        <input
          type="date"
          ref="startDateInput"
          class="form-control custom-date-time-input"
          id="activity_start_date"
          v-model="applicant_data.activity_start_date"
          :min="tomorrowDate"
        />
        <img
          src="/images/Arturo-Wibawa-Akar-Calendar.svg"
          alt="Calendar Icon"
          class="custom-date-time-icon"
        />
      </div>
    </div>
    <div class="mb-3 position-relative">
      <label for="activity_end_date" class="form-label">
        {{ $t('pages.applyEvent.form.end_date') }}
      </label>
      <div @click="openDatePicker('endDate')">
        <input
          type="date"
          ref="endDateInput"
          class="form-control custom-date-time-input"
          id="activity_end_date"
          v-model="applicant_data.activity_end_date"
          :min="minEndDate"
        />
        <img
          src="/images/Arturo-Wibawa-Akar-Calendar.svg"
          alt="Calendar Icon"
          class="custom-date-time-icon"
        />
      </div>
    </div>
    <div class="mb-3 position-relative">
      <label for="activity_start_time" class="form-label">
        {{ $t('pages.applyEvent.form.start_time') }}
      </label>
      <div @click="openTimePicker('startTime')">
        <input
          type="time"
          ref="startTimeInput"
          class="form-control custom-date-time-input"
          id="activity_start_time"
          v-model="applicant_data.activity_start_time"
        />
        <img
          src="/images/Arturo-Wibawa-Akar-Clock.svg"
          alt="Clock Icon"
          class="custom-date-time-icon"
        />
      </div>
    </div>
    <div class="mb-3 position-relative">
      <label for="activity_end_time" class="form-label">
        {{ $t('pages.applyEvent.form.end_time') }}
      </label>
      <div @click="openTimePicker('endTime')">
        <input
          type="time"
          ref="endTimeInput"
          class="form-control custom-date-time-input"
          id="activity_end_date"
          v-model="applicant_data.activity_end_time"
        />
        <img
          src="/images/Arturo-Wibawa-Akar-Clock.svg"
          alt="Clock Icon"
          class="custom-date-time-icon"
        />
      </div>
    </div>
    <div class="mb-3">
      {{ $t('pages.applyEvent.form.location') }}
      <div class="d-flex flex-column flex-md-row gap-md-5">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="activity_campus1"
            v-model="applicant_data.activity_campus"
            value="1"
          />
          <label class="form-check-label" for="activity_campus1">
            {{ $t('pages.applyEvent.form.primaryCampus') }}
          </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            id="activity_campus2"
            v-model="applicant_data.activity_campus"
            value="2"
          />
          <label class="form-check-label" for="activity_campus2">
            {{ $t('pages.applyEvent.form.nanDaCampus') }}
          </label>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="area" class="form-label">
        {{ $t('pages.applyEvent.form.area') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="area"
        v-model="applicant_data.area"
      />
    </div>
    <div class="mb-3">
      <label for="headcount" class="form-label">
        {{ $t('pages.applyEvent.form.headcount') }}
      </label>
      <input
        type="number"
        class="form-control"
        id="headcount"
        v-model="applicant_data.headcount"
      />
    </div>
    <div class="mb-3">
      <label for="bus_count" class="form-label">
        <span>{{ $t('pages.applyEvent.form.bus_count') }}&nbsp;</span>
        <span class="text-primary">{{ $t('pages.applyEvent.form.bus') }}</span>
      </label>
      <input
        type="number"
        class="form-control"
        id="bus_count"
        v-model="applicant_data.bus_count"
      />
    </div>
    <div class="mb-3">
      <label for="car_count" class="form-label">
        <span>{{ $t('pages.applyEvent.form.car_count') }}&nbsp;</span>
        <span class="text-primary">{{ $t('pages.applyEvent.form.car') }}</span>
      </label>
      <input
        type="number"
        class="form-control"
        id="car_count"
        v-model="applicant_data.car_count"
      />
    </div>
    <div class="mb-3">
      <label for="source" class="form-label">
        {{ $t('pages.applyEvent.form.source') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="source"
        v-model="applicant_data.source"
      />
    </div>
    <div class="mb-3">
      <label for="applicant" class="form-label">
        {{ $t('pages.applyEvent.form.applicant') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="applicant"
        v-model="applicant_data.applicant"
      />
    </div>
    <div class="mb-3">
      <label for="phone_number" class="form-label">
        {{ $t('pages.applyEvent.form.phone_number') }}
      </label>
      <input
        type="text"
        class="form-control"
        id="phone_number"
        v-model="applicant_data.phone_number"
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">
        {{ $t('pages.applyEvent.form.email') }}
      </label>
      <input
        type="mail"
        class="form-control"
        id="email"
        v-model="applicant_data.email"
      />
    </div>
    <div class="note">
      <p class="text-danger">
        <span>
          {{ $t('pages.applyEvent.form.note_title') }}
          <br />
        </span>
        <span>
          {{ $t('pages.applyEvent.form.note_content') }}
        </span>
      </p>
    </div>
    <div class="text-center">
      <button class="btn btn-secondary w-100" @click.prevent="handleNext">
        {{ $t('pages.applyEvent.form.print') }}
      </button>
    </div>
  </form>
  <div class="mt-3 text-center">
    <button class="btn btn-secondary w-100" @click="goToUploadDocuments">
      {{ $t('pages.applyEvent.form.uploadDocuments') }}
    </button>
  </div>
  <!-- 引入 ValidationModal 元件 -->
  <ValidationModal
    :showModal="showModal"
    :errors="errors"
    @close="closeValidatorModal"
  />
  <!-- 確認送出申請資料 modal -->
  <ConfirmModal
    :showConfirmModal="showConfirmModal"
    @close="closeConfirmModal"
    @apply="apply"
  />
</template>

<style scoped>
.custom-date-wrapper {
  cursor: pointer;
  display: inline-block;
  width: 100%; /* 確保覆蓋整個輸入框 */
}

.custom-date-time-input::-webkit-calendar-picker-indicator {
  display: none; /* 隱藏內建 icon */
}

.custom-date-time-input {
  position: relative;
  padding-right: 40px; /* 為自定義圖標預留空間 */
}

.custom-date-time-icon {
  position: absolute;
  right: 10px;
  top: 70%;
  transform: translateY(-50%);
  width: 24px; /* 根據需求調整寬度 */
  height: 24px; /* 根據需求調整高度 */
  pointer-events: none; /* 確保點擊圖標不會阻止輸入框的操作 */
}
</style>
