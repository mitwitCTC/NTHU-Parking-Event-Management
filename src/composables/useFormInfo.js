import { ref } from 'vue'
import pacaApi from '@/pacaApi'

export function useFormInfo() {
  const form_info = ref({ title: '', form_code: '' })

  async function getFormInfo(documentType) {
    try {
      const response = await pacaApi.get('/v2/forms/info', {
        headers: {
          Authorization:
            'jYs3u6lUwi4iwyvGCl0BPnPyefUfIVd1iGLcMUoFn0mWm2hLs04MY460IJbZTT9T+6+H+ejjAbzwzmW17aSX5+z3',
        },
      })
      const forms = response.data.check_form_setting
      const targetForm = forms.find(form => form.title === documentType)

      if (targetForm) {
        form_info.value = {
          title: targetForm.title,
          form_code: targetForm.form_code,
        }
      } else {
        form_info.value = {
          title: '表單資訊取得錯誤',
          form_code: '',
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { form_info, getFormInfo }
}
