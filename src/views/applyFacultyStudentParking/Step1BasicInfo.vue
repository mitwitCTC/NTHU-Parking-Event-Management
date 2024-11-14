<script setup>
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'
const facultyStudentStore = useFacultyStudentStore()

const applicant_data = ref({})
applicant_data.value.has_disability_certificate = '0' // 預設未持有身心障礙手冊
async function getBasic_info() {
  applicant_data.value.applicant_type = '在職教職員'
  applicant_data.value.applicant_source = '課務組'
  applicant_data.value.applicant = '王大明'
  applicant_data.value.applicant_number = 'A09035'
  applicant_data.value.email = 'DM.Wang@ess.nthu.edu.tw'
  applicant_data.value.phone_number = '0960712213'
}
onMounted(() => {
  getBasic_info()
})

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
  // staffStore.getApplicantData()
})

// 前往登記車輛頁面
function next() {
  facultyStudentStore.setApplicantData(applicant_data.value)
  router.push({ name: 'ApplyFacultyStudentParking_step2' })
}
</script>

<template>
  <div>
    <section>
      <p class="m-0">
        <span>{{ applicant_data.applicant_type }}</span>
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
            type="mail"
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
  </div>
</template>
