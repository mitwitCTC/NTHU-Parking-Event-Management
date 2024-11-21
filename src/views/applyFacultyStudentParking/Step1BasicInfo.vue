<script setup>
import router from '@/router'
import { onMounted, ref } from 'vue'
import FormValidator from '@/components/FormValidator.vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
import { Modal } from 'bootstrap'

const facultyStudentStore = useFacultyStudentStore()

const applicant_data = ref({
  has_disability_certificate: '0', // 預設未持有身心障礙手冊
  academic_year: '', // 學年
  email: '', // 電子郵件
  phone_number: '', // 電話號碼
})

// 取得基本資料
async function getBasic_info() {
  applicant_data.value.applicant_type = '2'
  applicant_data.value.applicant_type_title = '在職教職員工'
  applicant_data.value.applicant_source = '課務組'
  applicant_data.value.applicant = '王大明'
  applicant_data.value.applicant_number = 'A09035'
  applicant_data.value.email = 'DM.Wang@ess.nthu.edu.tw'
  applicant_data.value.phone_number = '0960712213'
}
onMounted(() => {
  getBasic_info()
})

let validatorModal = null
onMounted(() => {
  // 初始化驗證 Modal
  const validatorModalElement = document.getElementById('validatorModal')
  if (validatorModalElement) {
    validatorModal = new Modal(validatorModalElement)
  }
})

function closeValidatorModal() {
  if (validatorModal) {
    validatorModal.hide()
  }
}

const academicYears = ref([]) // 用來儲存學年選項
// 計算學年
onMounted(() => {
  const currentYear = new Date().getFullYear()
  const currentAcademicYear = currentYear - 1911
  const nextAcademicYear = currentAcademicYear + 1

  // 更新學年選項
  academicYears.value = [currentAcademicYear, nextAcademicYear]
  // 預設選本學年
  applicant_data.value.academic_year = currentAcademicYear
})

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件

function formValidate() {
  const rules = {
    email: { required: true, email: true },
    phone_number: { required: true, phone_number: true },
    academic_year: { required: true },
  }

  const { isValid, errors } = formValidatorRef.value.validateForm(
    applicant_data.value,
    rules,
  )

  if (!isValid) {
    console.error('Form Validation Error', errors)
    if (validatorModal) {
      validatorModal.show()
    }
  }

  return isValid
}

// 前往登記車輛頁面
function next() {
  if (formValidate()) {
    facultyStudentStore.setApplicantData(applicant_data.value)
    router.push({ name: 'ApplyFacultyStudentParking_step2' })
  }
}
</script>

<template>
  <div>
    <FormValidator ref="formValidatorRef" />

    <section>
      <p class="m-0">
        <span>{{ applicant_data.applicant_type_title }}</span>
        <span>／</span>
        <span>{{ applicant_data.applicant_source }}</span>
      </p>
      <p class="my-1">
        {{ applicant_data.applicant_number }}
      </p>
      <p class="m-0">
        {{ applicant_data.applicant }}
      </p>
    </section>
    <section>
      <form>
        <div class="my-3">
          <label for="academic_year" class="form-label">
            {{
              $t('pages.applyFacultyStudentParking.basic_info.academic_year')
            }}
          </label>
          <select class="form-select" v-model="applicant_data.academic_year">
            <option v-for="year in academicYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.email') }}
          </label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="applicant_data.email"
          />
        </div>
        <div class="mb-3">
          <label for="phone_number" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.phone_number') }}
          </label>
          <input
            type="text"
            class="form-control"
            id="phone_number"
            v-model="applicant_data.phone_number"
          />
        </div>
        <div class="mb-3">
          {{
            $t(
              'pages.applyFacultyStudentParking.basic_info.has_disability_certificate',
            )
          }}
          <div class="d-flex flex-column flex-md-row gap-md-5">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="campusToReceiveCertificate1"
                id="campusToReceiveCertificate1"
                v-model="applicant_data.has_disability_certificate"
                value="1"
              />
              <label class="form-check-label" for="campusToReceiveCertificate1">
                {{ $t('pages.applyFacultyStudentParking.basic_info.yes') }}
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="campusToReceiveCertificate2"
                id="campusToReceiveCertificate2"
                v-model="applicant_data.has_disability_certificate"
                value="0"
              />
              <label class="form-check-label" for="campusToReceiveCertificate2">
                {{ $t('pages.applyFacultyStudentParking.basic_info.no') }}
              </label>
            </div>
          </div>
        </div>
      </form>
      <div class="text-center">
        <button class="btn btn-secondary" @click="next">
          {{ $t('pages.applyFacultyStudentParking.basic_info.next') }}
        </button>
      </div>
    </section>

    <!-- 驗證訊息 modal 開始 -->
    <div
      class="modal fade"
      id="validatorModal"
      tabindex="-1"
      aria-labelledby="validatorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-secondary">
            <h5 class="modal-title text-black" id="validatorModalLabel">
              {{ $t('validation.title') }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeValidatorModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ $t('validation.content') }}</p>
          </div>
          <div class="modal-footer">
            <p class="pointer text-primary" @click="closeValidatorModal">
              {{ $t('validation.confirm') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 驗證訊息 modal 結束 -->
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
