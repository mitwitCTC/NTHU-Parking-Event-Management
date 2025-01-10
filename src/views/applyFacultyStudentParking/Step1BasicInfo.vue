<script setup>
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import Api from '@/api'
import router from '@/router'
import { onMounted, ref, watch } from 'vue'
import { useAcademicYears } from '@/composables/getAcademicYears.js'
const { academicYears } = useAcademicYears('/api/academic-years')
import FormValidator from '@/components/FormValidator.vue' // 引入 FormValidator
import ValidationModal from '@/components/ValidationModal.vue'
import ApplicatioinResultModal from '@/components/ApplicatioinResultModal.vue'
import PendingReviewRestrictionModal from '@/components/PendingReviewRestrictionModal.vue'
import { useFacultyStudentStore } from '@/stores/facultyStudentStore'

const facultyStudentStore = useFacultyStudentStore()

const applicant_data = ref({
  has_disability_certificate: '0', // 預設未持有身心障礙手冊
  academic_year: '', // 學年
  email: '', // 電子郵件
  phone_number: '', // 電話號碼
  CarrierType: '3J0001', // 預設為網優載具
  CarrierID1: '', // 載具顯碼
  CarrierID2: '', // 載具隱碼
  DonateMark: '0', // 捐贈註記，0：預設，無捐贈，1：捐贈
  NPOBAN: '' // 捐贈對象
})
onMounted(() => {
  facultyStudentStore.getApplicantData()
  if (facultyStudentStore.applicant_data != {}) {
    Object.assign(applicant_data.value, facultyStudentStore.applicant_data)
  }
  if (facultyStudentStore.applicant_data.vat_number != '') {
    invoice_needVat.value = true
  }
})
const invoice_needVat = ref(false)

// 取得基本資料
async function getBasic_info() {
  applicant_data.value.applicant_type = '2'
  applicant_data.value.applicant_type_title = '在職教職員工'
  applicant_data.value.applicant_source = '課務組'
  applicant_data.value.applicant = '王大明'
  applicant_data.value.applicant_number = 'A09035'
  applicant_data.value.email = 'DM.Wang@ess.nthu.edu.tw'
  applicant_data.value.phone_number = '0960712213'
  generateSerialNumber()
}
const showApplicatioinResultModal = ref(false) // 控制 提交失敗結果Modal 顯示

function closeApplicatioinResultModal() {
  showApplicatioinResultModal.value = false
}

const ischeckingPlateCount = ref(false) // 等待確認車輛數資料回傳中
const showPendingReviewRestrictionModal = ref(false) // 有審核中/待審核申請 Modal
// 確認車輛數
async function checkPlateCount() {
  ischeckingPlateCount.value = true
  try {
    const response = await Api.post('/main/plateCount', {
      academic_year: applicant_data.value.academic_year,
      applicant_number: applicant_data.value.applicant_number,
    })

    if (response.data.returnCode == 0) {
      if (response.data.message === '目前已登記車輛數') {
        const data = response.data.data

        const hasTC = data.some(item => item.main_pass_code === 'TC')
        const hasTE = data.some(item => item.main_pass_code === 'TE')

        let resultData = []

        if (hasTC && hasTE) {
          // 有 TC 和 TE，存入其資料
          resultData = data.filter(
            item =>
              item.main_pass_code === 'TC' || item.main_pass_code === 'TE',
          )
        } else if (hasTC && !hasTE) {
          // 有 TC 無 TE
          resultData = data.filter(item => item.main_pass_code === 'TC')
          resultData.push({ main_pass_code: 'TE', count: 5 })
        } else if (!hasTC && hasTE) {
          // 無 TC 有 TE
          resultData = data.filter(item => item.main_pass_code === 'TE')
          resultData.push({ main_pass_code: 'TC', count: 5 })
        } else {
          // 無 TC 無 TE
          resultData = [
            { main_pass_code: 'TC', count: 5 },
            { main_pass_code: 'TE', count: 5 },
          ]
        }

        facultyStudentStore.setPermitTypeRemaining(
          resultData.map(item => ({
            main_pass_code: item.main_pass_code,
            remaining_count: item.count,
          })),
        )
      } else if (response.data.message === '無資料') {
        facultyStudentStore.setPermitTypeRemaining([
          { main_pass_code: 'TC', remaining_count: 5 },
          { main_pass_code: 'TE', remaining_count: 5 },
        ])
      }
    } else if (response.data.returnCode == -2) {
      showPendingReviewRestrictionModal.value = true
    } else if (response.data.returnCode == -3) {
      // 泊律恆無此表單
      facultyStudentStore.setPermitTypeRemaining([
        { main_pass_code: 'TC', remaining_count: 5 },
        { main_pass_code: 'TE', remaining_count: 5 },
      ])
    } else {
      showApplicatioinResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    showApplicatioinResultModal.value = true
  } finally {
    ischeckingPlateCount.value = false
  }
}
function closePendingReviewRestrictionModal() {
  showPendingReviewRestrictionModal.value = false
  router.push({ name: 'Home' })
}

watch(
  () => applicant_data.value.DonateMark,
  (newValue) => {
    if (newValue == 1) {
      // DonateMark 勾選時
      applicant_data.value.NPOBAN = ''; // NPOBAN 可選 (清空，讓使用者重新選擇)
      invoice_needVat.value = false; // 強制 invoice_needVat 為 false
      applicant_data.value.vat_number = ''; // 清空統編
    } else {
      // DonateMark 未勾選時
      applicant_data.value.NPOBAN = ''; // 確保 NPOBAN 為空
    }
  }
);

watch(
  () => invoice_needVat.value,
  (newValue) => {
    if (newValue) {
      applicant_data.value.DonateMark = 0; // DonateMark 必須未勾選
    } else {
      applicant_data.value.vat_number = ''
    }
  }
);

// 建立表單序號
function generateSerialNumber() {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // 取西元年後兩碼
  const month = String(now.getMonth() + 1).padStart(2, '0') // 月份補零
  const date = String(now.getDate()).padStart(2, '0') // 日期補零
  const hours = String(now.getHours()).padStart(2, '0') // 小時補零
  const minutes = String(now.getMinutes()).padStart(2, '0') // 分鐘補零
  const seconds = String(now.getSeconds()).padStart(2, '0') // 秒數補零
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0') // 毫秒補零

  // 組合表單序號
  const serialNumber = `C${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`

  // 將表單序號寫入 applicant_data.value
  applicant_data.value.serial_number = serialNumber
}

onMounted(() => {
  getBasic_info()
})

const formValidatorRef = ref(null) // 用來引用 FormValidator 元件
const showModal = ref(false) // 控制 Modal 顯示
const errors = ref({}) // 儲存錯誤訊息

function formValidate() {
  const rules = {
    email: { required: true, email: true },
    phone_number: { required: true, phone_number: true },
    academic_year: { required: true },
  }

  // 選擇共通性載具，則載具欄位為必填
  if (applicant_data.value.CarrierType == '3J0002') {
    rules.CarrierID1 = { required: true, CarrierID1: true }
  }
  // 選擇捐贈，則捐贈機構欄位為必填
  if (applicant_data.value.DonateMark == true) {
    rules.NPOBAN = { required: true }
  }
  // 如果需開立統編，則統編欄位為必填
  if (invoice_needVat.value) {
    rules.vat_number = { required: true, vat_number: true }
  }

  // 確保 formValidatorRef 正確引用 FormValidator 組件
  if (formValidatorRef.value) {
    const { isValid, errors: errorsResult } = formValidatorRef.value.validateForm(
      applicant_data.value,
      rules,
    )

    // 如果驗證失敗
    if (!isValid) {
      errors.value = errorsResult // 設定錯誤訊息
      showModal.value = true // 顯示 Modal
    }

    return isValid
  } else {
    console.error('FormValidator reference is not correctly initialized.')
    return false
  }
}

// 前往登記車輛頁面
function next() {
  if (formValidate()) {
    formatApplicationData()
    facultyStudentStore.setApplicantData(applicant_data.value)
    router.push({ name: 'ApplyFacultyStudentParking_step2' })
  }
}
import { useDonationOrganization } from '@/composables/useDonationOrganization'
const { donationOrganizationList } = useDonationOrganization()
import { generateUXB2BCode } from '@/composables/generateUXB2BCode'
// 處理申請人資料
function formatApplicationData() {
  if (applicant_data.value.CarrierType == '3J0001') {
    applicant_data.value.CarrierID1 = generateUXB2BCode(applicant_data.value.phone_number)
  }
  applicant_data.value.CarrierID2 = applicant_data.value.CarrierID1
}

// 這個方法將由 ValidationModal 觸發來關閉 Modal
function closeValidatorModal() {
  showModal.value = false
}
</script>

<template>
  <div>
    <!-- 引入 FormValidator 元件 -->
    <FormValidator ref="formValidatorRef" />

    <loading :active="ischeckingPlateCount" :is-full-page="true"></loading>
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
          <select class="form-select" v-model="applicant_data.academic_year" @change="checkPlateCount">
            <option v-for="year in academicYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.email') }}
          </label>
          <input type="email" class="form-control" id="email" v-model="applicant_data.email" />
        </div>
        <div class="mb-3">
          <label for="phone_number" class="form-label">
            {{ $t('pages.applyFacultyStudentParking.basic_info.phone_number') }}
          </label>
          <input type="text" class="form-control" id="phone_number" v-model="applicant_data.phone_number" />
        </div>
        <div class="mb-3">
          {{
            $t(
              'pages.applyFacultyStudentParking.basic_info.has_disability_certificate',
            )
          }}
          <div class="d-flex flex-column flex-md-row gap-md-5">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="has_disability_certificate1"
                id="has_disability_certificat1" v-model="applicant_data.has_disability_certificate" value="1" />
              <label class="form-check-label" for="has_disability_certificate1">
                {{ $t('pages.applyFacultyStudentParking.basic_info.yes') }}
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="has_disability_certificate2"
                id="has_disability_certificate2" v-model="applicant_data.has_disability_certificate" value="0" />
              <label class="form-check-label" for="has_disability_certificate2">
                {{ $t('pages.applyFacultyStudentParking.basic_info.no') }}
              </label>
            </div>
          </div>
        </div>
        <div class="mb-3">
          {{
            $t(
              'pages.applyFacultyStudentParking.basic_info.invoice.title',
            )
          }}
          <div class="invoice-section p-2">

            <div class="d-flex flex-column flex-md-row gap-md-5">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="carrierType1" id="carrierType1"
                  v-model="applicant_data.CarrierType" value="3J0001" />
                <label class="form-check-label" for="carrierType1">
                  {{ $t('pages.applyFacultyStudentParking.basic_info.invoice.uxb2b') }}
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="carrierType2" id="carrierType2"
                  v-model="applicant_data.CarrierType" value="3J0002" />
                <label class="form-check-label" for="carrierType2">
                  {{ $t('pages.applyFacultyStudentParking.basic_info.invoice.mobile_carrier') }}
                </label>
              </div>
            </div>
            <div class="mb-3" v-if="applicant_data.CarrierType == '3J0002'">
              <input type="text" class="form-control" id="CarrierID1" v-model="applicant_data.CarrierID1" />
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="DonateMark" id="DonateMark"
                v-model="applicant_data.DonateMark" true-value="1" false-value="0" />
              <label class="form-check-label" for="DonateMark">
                {{ $t('pages.applyFacultyStudentParking.basic_info.invoice.donate') }}
              </label>
            </div>
            <select class="form-select" v-model="applicant_data.NPOBAN" :disabled="applicant_data.DonateMark == 0">
              <option v-for="item in donationOrganizationList" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
            <hr>
            <div class="mb-3">
              <div class="d-flex flex-column flex-md-row gap-md-5">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="invoice_needVat1" v-model="invoice_needVat"
                    :value=true :disabled="applicant_data.DonateMark == 1" />
                  <label class="form-check-label" for="invoice_needVat1">
                    {{ $t('pages.applyFacultyStudentParking.basic_info.invoice.withVat') }}
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="invoice_needVat2" v-model="invoice_needVat"
                    :value=false />
                  <label class="form-check-label" for="invoice_needVat2">
                    {{ $t('pages.applyFacultyStudentParking.basic_info.invoice.withoutVat') }}
                  </label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="company_name" class="form-label">
                {{ $t('pages.preorderCoupon.invoice.company_name') }}
              </label>
              <input type="text" class="form-control" id="company_name" v-model="applicant_data.company_name" />
            </div>
            <div class="mb-3">
              <label for="vat_number" class="form-label">
                {{ $t('pages.preorderCoupon.invoice.vat_number') }}
              </label>
              <input type="text" class="form-control" id="vat_number" :disabled="invoice_needVat == false"
                v-model="applicant_data.vat_number" />
            </div>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-secondary" @click.prevent="next">
            {{ $t('pages.applyFacultyStudentParking.basic_info.next') }}
          </button>
        </div>
      </form>
    </section>

    <!-- 提交申請失敗 modal 開始 -->
    <ApplicatioinResultModal :showApplicatioinResultModal="showApplicatioinResultModal"
      @close="closeApplicatioinResultModal" />
    <!-- 申請限制 modal  -->
    <PendingReviewRestrictionModal :showPendingReviewRestrictionModal="showPendingReviewRestrictionModal"
      @close="closePendingReviewRestrictionModal" />
    <!-- 引入 ValidationModal 元件 -->
    <ValidationModal :showModal="showModal" :errors="errors" @close="closeValidatorModal" />
  </div>
</template>

<style scoped>
.invoice-section {
  border: 2px solid darkgray;
  border-radius: 5px;
}
</style>
