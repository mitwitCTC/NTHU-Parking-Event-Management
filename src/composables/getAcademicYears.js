import { ref, onMounted } from 'vue'
import pacaApi from '@/pacaApi'

export function useAcademicYears() {
  const academicYears = ref([])

  const fetchAcademicYears = async () => {
    try {
      const response = await pacaApi.get('/v2/setting/academicyearlist', {
        headers: {
          Authorization:
            'jYs3u6lUwi4iwyvGCl0BPnPyefUfIVd1iGLcMUoFn0mWm2hLs04MY460IJbZTT9T+6+H+ejjAbzwzmW17aSX5+z3',
        },
      })
      const data = response.data

      // 從資料中提取所有不重複的 academic_year
      const uniqueYears = [
        ...new Set(data.map(item => item.academic_year)),
      ].map(Number)

      // 按數字大小排序學年
      academicYears.value = uniqueYears.sort((a, b) => a - b)
    } catch (error) {
      console.error('Error fetching academic years:', error)
    }
  }

  onMounted(fetchAcademicYears)

  return {
    academicYears,
    fetchAcademicYears,
  }
}
