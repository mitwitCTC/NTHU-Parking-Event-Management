import { ref } from 'vue'
import pacaApi from '@/pacaApi'
import { useI18n } from 'vue-i18n'

export function useFormStatus() {
  const { t } = useI18n()
  const statuses = ref({
    form_status: {},
    payment_status: {},
    receive_status: {},
    applicant_type: {},
    activity_location: {},
    receive_location: {},
    payment_method: {},
    receive_method: {},
  })

  async function getFormStatuses() {
    try {
      const response = await pacaApi.get('/v2/forms/info', {
        headers: {
          Authorization:
            'jYs3u6lUwi4iwyvGCl0BPnPyefUfIVd1iGLcMUoFn0mWm2hLs04MY460IJbZTT9T+6+H+ejjAbzwzmW17aSX5+z3',
        },
      })

      const data = response.data

      statuses.value = {
        form_status: data.form_status,
        payment_status: data.payment_status,
        receive_status: data.receive_status,
        applicant_type: data.applicant_type,
        activity_location: data.activity_location,
        receive_location: data.receive_location,
        payment_method: data.payment_method,
        receive_method: data.receive_method,
      }
      console.log(statuses.value)
    } catch (error) {
      console.error('Error fetching form statuses:', error)
    }
  }

  function getStatusText(category, value) {
    // 確保 value 有效，如果為 undefined 或其他無效值則使用 'unknown'
    if (value === undefined || value === null) {
      value = 'unknown'
    }
    const key = `${category}.${value}`
    return t(`statuses.${key}`) || t('statuses.unknown')
  }

  return { statuses, getFormStatuses, getStatusText }
}
