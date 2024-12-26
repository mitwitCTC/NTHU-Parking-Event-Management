import axios from 'axios'

const apiUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://hq.paca.com.tw:18080/api'

const pacaApi = axios.create({
  baseURL: apiUrl,
})

export default pacaApi
